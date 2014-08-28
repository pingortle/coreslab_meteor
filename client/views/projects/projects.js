Template.projects.events({
	'click .project-row': function(event) {
		var projectId = event.currentTarget.dataset.projectId;
		if (projectId)
			Router.go('project', { id: projectId });
	},
});
