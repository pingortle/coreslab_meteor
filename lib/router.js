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
			workflows: Workflows.find({}, { sort: {slug: 1} }),
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
			projects: Projects.find({}, { sort: {id: 0} }),
		};
	}
});

ProjectController = ProjectsController.extend({
	data: function() {
		return {
			projects: Projects.find({}, { sort: {id: 0} }),
			activeProject: this.params.id && Projects.findOne({ id: this.params.id }),
		};
	}
});

Router.onStop(function() {
	Session.set('breadcrumbs', null);
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
		onAfterAction: function() {
			Session.set('breadcrumbs', [
				{ title: 'Projects' },
			]);
		},
	});

	this.route('new_project', {
		path: '/projects/new',
		waitOn: function() {
			Meteor.subscribe('productLines');
		},
		onAfterAction: function() {
			Session.set('breadcrumbs', [
				{ title: 'Projects', route: 'projects' },
				{ title: 'New Project' },
			]);
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
		onAfterAction: function() {
			var data = this.data() || {};
			Session.set('breadcrumbs', [
				{ title: 'Projects', route: 'projects' },
				{ title: 'Edit ' + data.id + ': ' + data.description },
			]);
		},
	});

	this.route('project', {
		path: '/projects/:id',
		controller: ProjectController,
		onAfterAction: function() {
			var data = Projects.findOne({ id: this.params.id }) || {};
			Session.set('breadcrumbs', [
				{ title: 'Projects', route: 'projects' },
				{ title: data.id + ': ' + data.description },
			]);
		},
	});

	this.route('pieces', {
		path: '/pieces',
		waitOn: function () {
			Meteor.subscribe('pieces');
		},
		data: function() {
			return Pieces.find({}, { sort:[["projectID", "desc"], ["projectElementID", "asc"]] });
		},
		onAfterAction: function() {
			Session.set('breadcrumbs', [
				{ title: 'Pieces' },
			]);
		},
	});

	this.route('new_piece', {
		path: '/projects/:id/:element/pieces/new',
		data: function() {
			return {
				projectId: this.params.id,
				projectElement: this.params.element
			};
		},
		onAfterAction: function() {
			Session.set('breadcrumbs', [
				{ title: 'Projects', route: 'projects' },
				{ title: this.params.id, route: 'project', id: this.params.id },
				{ title: 'New Piece' },
			]);
		},
	});

	this.route('edit_piece', {
		path: '/projects/:projectId/:element/pieces/:id/edit',
		waitOn: function() {
			Meteor.subscribe('pieces', { singleId: this.params.id });
		},
		data: function() {
			return Pieces.findOne(this.params.id);
		},
		onAfterAction: function() {
			Session.set('breadcrumbs', [
				{ title: 'Projects', route: 'projects' },
				{ title: this.params.id, route: 'project', id: this.params.id },
				{ title: 'Edit Piece' },
			]);
		},
	});

	this.route('beds', {
		path: '/beds',
		waitOn: function() {
			Meteor.subscribe('beds', {allowInactive: true});
		},
		data: function() {
			return Beds.find({}, { sort: {name: 1} });
		},
		onAfterAction: function() {
			Session.set('breadcrumbs', [
				{ title: 'Beds'},
			]);
		},
	});

	this.route('new_bed', {
		path: '/beds/new',
		onAfterAction: function() {
			Session.set('breadcrumbs', [
				{ title: 'Beds'},
				{ title: 'New Bed', route: 'new_bed' },
			]);
		},
	});

	this.route('edit_bed', {
		path: '/beds/:id/edit',
		waitOn: function() {
			Meteor.subscribe('beds', {singleId: this.params.id});
		},
		data: function() {
			return Beds.findOne(this.params.id);
		},
		onAfterAction: function() {
			var data = this.data() || {};
			Session.set('breadcrumbs', [
				{ title: 'Beds', route: 'beds' },
				{ title: 'Edit ' + data.name },
			]);
		},
	});

	this.route('product_lines', {
		path: '/product-lines',
		waitOn: function() {
			Meteor.subscribe('productLines', {allowInactive: true});
		},
		data: function() {
			return ProductLines.find({}, { sort: {id: 1} });
		},
		onAfterAction: function() {
			Session.set('breadcrumbs', [
				{ title: 'Product Lines' },
			]);
		},
	});

	this.route('new_product_line', {
		path: '/product-lines/new',
		onAfterAction: function() {
			Session.set('breadcrumbs', [
				{ title: 'Product Lines', route: 'product_lines' },
				{ title: 'New Product Line' },
			]);
		},
	});

	this.route('edit_product_line', {
		path: '/product-lines/:id/edit',
		waitOn: function() {
			Meteor.subscribe('productLines', {singleId: this.params.id});
		},
		data: function() {
			return ProductLines.findOne(this.params.id);
		},
		onAfterAction: function() {
			var data = this.data() || {};
			Session.set('breadcrumbs', [
				{ title: 'Product Lines', route: 'product_lines' },
				{ title: 'Edit ' + data.id },
			]);
		},
	});

	this.route('settings', {
		path: '/settings',
		onAfterAction: function() {
			Session.set('breadcrumbs', [
				{ title: 'Settings' },
			]);
		},
	});

	this.route('user_settings', {
		path: '/settings/users',
		waitOn: function() {
			Meteor.subscribe('managedUsers');
		},
		data: function() {
			return Meteor.users.find({}, { sort: {createdAt: 1} });
		},
		onAfterAction: function() {
			Session.set('breadcrumbs', [
				{ title: 'Settings', route: 'settings' },
				{ title: 'User Settings' },
			]);
		},
	});

	this.route('workflows_listing', {
		path: '/workflows-listing',
		waitOn: function() {
			Meteor.subscribe('workflows');
		},
		data: function() {
			return Workflows.find({}, { sort: {slug: 1} });
		},
		onAfterAction: function() {
			Session.set('breadcrumbs', [
				{ title: 'Workflows' },
			]);
		},
	});

	this.route('new_workflow', {
		path: '/settings/workflows/new',
		onAfterAction: function() {
			Session.set('breadcrumbs', [
				{ title: 'Workflows', route: 'workflows_listing' },
				{ title: 'New Workflow' },
			]);
		},
	});

	this.route('edit_workflow', {
		path: '/workflows/:id/edit',
		waitOn: function() {
			Meteor.subscribe('workflows');
		},
		data: function() {
			return Workflows.findOne(this.params.id);
		},
		onAfterAction: function() {
			var data = this.data() || {};
			Session.set('breadcrumbs', [
				{ title: 'Workflows', route: 'workflows_listing' },
				{ title: 'Edit ' + data.name },
			]);
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
				workflows: Workflows.find({}, { sort: {slug: 1} }),
			};
		},
		onAfterAction: function() {
			Session.set('breadcrumbs', [
				{ title: 'Settings', route: 'settings' },
				{ title: 'User Settings', route: 'user_settings' },
				{ title: 'Manage Workflows' },
			]);
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
		onAfterAction: function() {
			Session.set('breadcrumbs', [
				{ title: 'Settings', route: 'settings' },
				{ title: 'User Settings', route: 'user_settings' },
				{ title: 'Manage Authorizations' },
			]);
		},
	});
});
