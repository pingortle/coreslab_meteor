Template.projects.events({
	'click .project-row': function(event) {
		Router.go('project', { wbs: event.currentTarget.id });
	},
});
