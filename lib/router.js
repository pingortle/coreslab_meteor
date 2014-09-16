Router.configure(
{
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	notFoundTemplate: 'not_found',
	waitOn: function() {
		return _.map(['currentUser'], function(x) {
			Meteor.subscribe(x);
		});
	}
});

WorkflowsController = RouteController.extend({
	template: 'workflows',
	waitOn: function() {
		return Meteor.subscribe('workflows');
	},
	data: function() {
		return {
			workflows: Workflows.find(),
			activeWorkflow: this.params.workflow_id && Workflows.findOne({ slug: this.params.workflow_id }),
		};
	},
});

ProjectsController = RouteController.extend({
	template: 'projects',
	waitOn: function() {
		return Meteor.subscribe('projects');
	},
	data: function() {
		return {
			projects: Projects.find(),
		};
	}
});

ProjectController = ProjectsController.extend({
	data: function() {
		return {
			projects: Projects.find(),
			activeProject: this.params.id && Projects.findOne({ id: this.params.id }),
		};
	}
});

Router.map(function() {
	this.route('home', {
		path: '/',
	});

	this.route('workflows', {
		path: '/workflows/:workflow_id',
		controller: WorkflowsController,
	});

	this.route('workflows_base', {
		path: '/workflows',
		controller: WorkflowsController,
	});

	this.route('projects', {
		path: '/projects',
		controller: ProjectsController,
	});

	this.route('new_project', {
		path: '/projects/new',
		waitOn: function() {
			Meteor.subscribe('productLines');
		},
	});

	this.route('project', {
		path: '/projects/:id',
		controller: ProjectController,
	});

	this.route('new_piece', {
		path: '/pieces/new',
	});

	this.route('new_bed', {
		path: '/beds/new',
	});

	this.route('new_product_line', {
		path: '/product-lines/new',
	});	

	this.route('settings', {
		path: '/settings',
	});

	this.route('user_settings', {
		path: '/settings/users',
		waitOn: function() {
			Meteor.subscribe('managedUsers');
		},
		data: function() {
			return Meteor.users.find();
		},
	});
});
