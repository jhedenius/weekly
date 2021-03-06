var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

UserProvider = function(host, port, callback) {
  this.db= new Db('weekly', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){callback();});
};


UserProvider.prototype.getCollection= function(callback) {
  this.db.collection('user', function(error, data_collection) {
    if( error ) callback(error);
    else callback(null, data_collection);
  });
};

UserProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, data_collection) {
      if( error ) callback(error)
      else {
        data_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

UserProvider.prototype.findById = function(id, callback) {
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

UserProvider.prototype.save = function(users, callback) {
    this.getCollection(function(error, data_collection) {
      if( error ) callback(error)
      else {
        if( typeof(users.length)=="undefined")
          users = [users];

        for( var i =0;i< users.length;i++ ) {
          article = users[i];
          article.created_at = new Date();
          if( article.comments === undefined ) article.comments = [];
          for(var j =0;j< article.comments.length; j++) {
            article.comments[j].created_at = new Date();
          }
        }

        data_collection.insert(users, function() {
          callback(null, users);
        });
      }
    });
};

exports.UserProvider = UserProvider;