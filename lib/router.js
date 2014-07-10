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

	this.route('settings', {
		path: '/settings',
	});
});
