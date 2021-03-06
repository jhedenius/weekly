var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

TaskProvider = function(host, port, callback) {
  this.db= new Db('weekly', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){
  	console.log("open connection");
  	callback();
  });
};


TaskProvider.prototype.getCollection = function(callback) {
  this.db.collection('task', function(error, data_collection) {
    if(error){
    	console.log("Get collection error: " + error);
    	callback(error);
    } else{
    	console.log("Get collection success: " + data_collection);
    	callback(null, data_collection);
    }
  });
};

TaskProvider.prototype.findAll = function(callback) {
    console.log("Mongo get all");
    this.getCollection(function(error, data_collection) {
      if( error ){
      	console.log("Error " + error);
      	callback(error)
      } else {
        console.log("Mongo get collection success");
        data_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

TaskProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, data_collection) {
      if( error ) callback(error)
      else {
        data_collection.findOne({_id: data_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

TaskProvider.prototype.save = function(tasks, callback) {
    this.getCollection(function(error, data_collection) {
      if( error ) callback(error)
      else {
        if( typeof(tasks.length)=="undefined")
          tasks = [tasks];

        for( var i =0;i< tasks.length;i++ ) {
          article = tasks[i];
          article.created_at = new Date();
          if( article.comments === undefined ) article.comments = [];
          for(var j =0;j< article.comments.length; j++) {
            article.comments[j].created_at = new Date();
          }
        }

        data_collection.insert(tasks, function() {
          callback(null, tasks);
        });
      }
    });
};

exports.TaskProvider = TaskProvider;