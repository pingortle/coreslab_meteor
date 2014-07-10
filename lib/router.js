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

Router.map(function() {
	this.route('home', {
		path: '/',
	});

	this.route('workflows', {
		path: '/workflows/:workflow_id',
		data: function() { 
			return {
				workflows: Workflows.find(),
				activeWorkflow: Workflows.findOne({ slug: this.params.workflow_id }),
			};
		},
	});

	this.route('workflows_base', {
		path: '/workflows',
		template: 'workflows',
		data: function() {
			return { workflows: Workflows.find(), };
		},
	});

	this.route('settings', {
		path: '/settings',
	});
});
