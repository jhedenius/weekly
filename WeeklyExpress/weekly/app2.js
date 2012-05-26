var facebook = {
    'appId'         : "238563556250872",
    'appSecret'     : "cfc48e3978736486bd406fbb1c12bad5",
    'scope'         : "email",
    'callback'      : "http://23.23.186.145/profile"
}

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var auth            = require('connect-auth');
//var UserProvider    = require('./providers/user').UserProvider;
var app             = module.exports = express.createServer();

/*
 * jocke
 */
var TaskProvider 	= require('./taskprovider').TaskProvider;
var UserProvider 	= require('./userprovider').UserProvider;
/*
 * 
 * end jocke
 */

// Configuration
app.configure(function(){
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(auth([auth.Facebook(facebook)]));
    app.use(express.session({secret: 'my secret',store: new MongoStore({db: 'app'})}));
    app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler()); 
});


// Providers
//var UserProvider = new UserProvider('localhost', 27017);

// Routes
app.get('/', function( request, response ) {
	console.log("root userid is " + request.session.userId);
    if(!request.session.userId ) {
        request.authenticate(['facebook'], function(error, authenticated) {
            if( authenticated ) {
                request.session.userId = request.getAuthDetails().user.id;
            }
        });
    } else {
    	var taskProvider = new TaskProvider('127.0.0.1', 27017, function(){
    		console.log("all tasks");
    		taskProvider.findAll(function(error, tasks){
    			console.log("find all done ");
    			response.send(tasks);
    		});
    	});	
    }
});

app.get('/profile', function( request, response ) {

    response.contentType('application/json');
    if( request.session.userId ){
        /*
    	UserProvider.findById( request.session.userId, function( error, user ){
            var userJSON = JSON.stringify( user );
            response.send( userJSON );
        });
        */
    	console.log("UserId: " + request.session.userId);
    } else {
    	console.log("profile");
        response.writeHead(303, { 'Location': "/" });
    }

});

app.get('/logout', function( request, response, params ) {
	console.log("logout");
    request.session.destroy();
    request.logout();
    response.writeHead(303, { 'Location': "/" });
    response.end('');

});

app.listen(2000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);