// Routing is accomplished using IronRouter.
// Package: https://atmospherejs.com/iron/router

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

	this.route('edit_project', {
		path: '/projects/:id/edit',
		waitOn: function() {
			Meteor.subscribe('productLines');
			Meteor.subscribe('projects', { singleId: this.params.id });
		},
		data: function() {
			return Projects.findOne(this.params.id);
		},
	});

	this.route('project', {
		path: '/projects/:id',
		controller: ProjectController,
	});

	this.route('pieces', {
		path: '/pieces',
		waitOn: function () {
			Meteor.subscribe('pieces');
		},
		data: function() {
			return Pieces.find();
		},
	});

	this.route('new_piece', {
		path: '/projects/:id/:element/pieces/new',
		data: function() {
			return {
				projectId: this.params.id,
				projectElement: this.params.element
			};
		}
	});

	this.route('edit_piece', {
		path: '/projects/:projectId/:element/pieces/:id/edit',
		waitOn: function() {
			Meteor.subscribe('pieces', { singleId: this.params.id });
		},
		data: function() {
			return Pieces.findOne(this.params.id);
		},
	});

	this.route('beds', {
		path: '/beds',
		waitOn: function() {
			Meteor.subscribe('beds', {allowInactive: true});
		},
		data: function() {
			return Beds.find();
		},
	});

	this.route('new_bed', {
		path: '/beds/new',
	});

	this.route('edit_bed', {
		path: '/beds/:id/edit',
		waitOn: function() {
			Meteor.subscribe('beds', {singleId: this.params.id});
		},
		data: function() {
			return Beds.findOne(this.params.id);
		},
	});

	this.route('product_lines', {
		path: '/product-lines',
		waitOn: function() {
			Meteor.subscribe('productLines', {allowInactive: true});
		},
		data: function() {
			return ProductLines.find();
		}
	});

	this.route('new_product_line', {
		path: '/product-lines/new',
	});

	this.route('edit_product_line', {
		path: '/product-lines/:id/edit',
		waitOn: function() {
			Meteor.subscribe('productLines', {singleId: this.params.id});
		},
		data: function() {
			return ProductLines.findOne(this.params.id);
		},
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

	this.route('workflows_listing', {
		path: '/workflows-listing',
		waitOn: function() {
			Meteor.subscribe('workflows');
		},
		data: function() {
			return Workflows.find();
		}
	});

	this.route('new_workflow', {
		path: '/settings/workflows/new',
	});

	this.route('edit_workflow', {
		path: '/workflows/:id/edit',
		waitOn: function() {
			Meteor.subscribe('workflows');
		},
		data: function() {
			return Workflows.findOne(this.params.id);
		},
	});

	this.route('user_workflow_settings', {
		path: '/settings/users/:id/workflows',
		waitOn: function() {
			Meteor.subscribe('managedUsers', this.params.id);
			Meteor.subscribe('workflows');
		},
		data: function() {
			return {
				user: Meteor.users.findOne(this.params.id),
				workflows: Workflows.find(),
			};
		},
	});

	this.route('user_authorization_settings', {
		path: '/settings/users/:id/auth',
		waitOn: function() {
			Meteor.subscribe('managedUsers', this.params.id);
		},
		data: function() {
			return Meteor.users.findOne(this.params.id);
		},
	});
});
