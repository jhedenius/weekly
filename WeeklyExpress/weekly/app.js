var express = require('express'),
	routes = require('./routes'),
	MongoStore = require('connect-mongo')(express),
	auth = require('connect-auth'),
	TaskProvider = require('./taskprovider').TaskProvider,
	UserProvider = require('./userprovider').UserProvider,
	facebook = {
	    'appId'         : "your app id",
	    'appSecret'     : "your app secret",
	    'scope'         : "email",
	    'callback'      : "http://23.23.186.145/"
	};

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.use(express.cookieParser());
  app.use(auth([auth.Facebook(facebook)]));
  app.use(express.session({secret: 'my secret',store: new MongoStore({db: 'app'})}));
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


app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
