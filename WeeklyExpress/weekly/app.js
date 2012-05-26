
var express = require('express')
  , routes = require('./routes');


var TaskProvider = require('./taskprovider').TaskProvider;
var UserProvider = require('./userprovider').UserProvider;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(MethodOverride)
  app.use(ContentLength)
  app.use(Cookie)
  app.use(Session)
  app.use(Logger)
  app.use(require('facebook').Facebook, {
    apiKey: '238563556250872', 
    apiSecret: 'cfc48e3978736486bd406fbb1c12bad5'
  })
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

app.get('/tasks', routes.allTasks);
app.post('/task', routes.createTask);
app.put('/task', routes.updateTask);

app.get('/users', routes.allUsers);
app.post('/user', routes.createUser);
app.put('/user', routes.updateUser);

// Called to get information about the current authenticated user
app.get('/fbSession', function(){
  var fbSession = this.fbSession()
  if(fbSession) {
    // Here would be a nice place to lookup userId in the database
    // and supply some additional information for the client to use
  }
  // The client will only assume authentication was OK if userId exists
  this.contentType('json')
  this.halt(200, JSON.stringify(fbSession || {}))
})

// Called after a successful FB Connect
app.post('/fbSession', function() {
  var fbSession = this.fbSession() // Will return null if verification was unsuccesful
  if(fbSession) {
    // Now that we have a Facebook Session, we might want to store this new user in the db
    // Also, in this.params there is additional information about the user (name, pic, first_name, etc)
    // Note of warning: unlike the data in fbSession, this additional information has not been verified
    fbSession.first_name = this.params.post['first_name']
  }
  this.contentType('json')
  this.halt(200, JSON.stringify(fbSession || {}))
})

// Called on Facebook logout
app.post('/fbLogout', function() {
  this.fbLogout();
  this.halt(200, JSON.stringify({}))
})


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
