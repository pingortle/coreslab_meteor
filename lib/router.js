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

	var workflows = [
		{
			link: "/workflows/1",
			name: "Workflow 1",
		},
		{
			link: "/workflows/2",
			name: "Workflow 2",
		},
		{
			link: "/workflows/3",
			name: "Workflow 3",
		},
	];

	this.route('workflows', {
		path: '/workflows/:workflow_id',
		data: {
			workflows: workflows,
			activeWorkflow: {
				actionLinks: [
					{
						link: "/do_something",
						button_label: "Do something!"
					},
					{
						link: "/do_something",
						button_label: "Do something!"
					},
					{
						link: "/do_something",
						button_label: "Do something!"
					},
				],
			},
		},
	});

	this.route('workflows_base', {
		path: '/workflows',
		template: 'workflows',
		data: {
			workflows: workflows,
		},
	});

	this.route('settings', {
		path: '/settings',
	});
});
