var Task = Backbone.Model.extend({
	url : function() {
		return this.id ? '/task/' + this.id : '/task';
	}
});

var TaskCollection = Backbone.Collection.extend({
    model: Task,
    url: '/tasks'
});

$(function(){


    var taskCollection = new TaskCollection();
    
    fetchTasks(taskCollection);

	TasklistView = Backbone.View.extend({
		initialize: function(){
			this.render();
		},
		events: {
            "click input[type=button]": "addTask"
        },
        addTask: function( event ){
            // Button clicked, you can access the element that was clicked with event.currentTarget
            var newTask = new Task({name:$("#task_name").val()});
            newTask.save();
            fetchTasks(taskCollection);
       	},
		render: function(){
			// Compile the template using underscore
			var template = _.template( $("#tasklist_template").html(), { tasks: taskCollection.models, testarr: [1, 2, 3] } );
			this.el.html( template );
		}
	});
	
	
});

function fetchTasks(taskCollection){
	taskCollection.fetch({
    	success: function(){
    		var tasklistView = new TasklistView({ el: $("#tasklist_container") });
    	},
    	error: function(error){
			alert("Error: " + error);
    	}
    });
};