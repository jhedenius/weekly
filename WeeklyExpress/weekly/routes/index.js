


exports.index = function(req, res){
	res.render('test', { title: "Test" });
};

exports.allUsers = function(req, res){
	var userProvider= new UserProvider('127.0.0.1', 27017, function() {
		userProvider.findAll(function(error, users){
			res.send(users);
		});
	});
};

exports.createUser = function(req, res){
    var userProvider = null;
    userProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, users) {
        res.redirect('/users')
    });
};

exports.updateUser = function(req, res){
    var userProvider = null;
    userProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, users) {
        res.redirect('/users')
    });
};

exports.allTasks = function(req, res){
	var taskProvider = new TaskProvider('127.0.0.1', 27017, function(){
		console.log("all tasks");
		taskProvider.findAll(function(error, tasks){
			console.log("find all done ");
			res.send(tasks);
		});
	});
};

exports.createTask = function(req, res){
    var taskProvider = new TaskProvider('127.0.0.1', 27017, function(){
    	taskProvider.save(req.body, function( error, docs) {
        	res.redirect('/tasks')
        });
    });
};

exports.updateTask = function(req, res){
    var taskProvider = null;
    taskProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/tasks')
    });
};
