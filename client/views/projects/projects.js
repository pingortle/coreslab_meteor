Template.projects.events({
	'click .project-row': function(event) {
		var wbs = event.currentTarget.id;
		if (wbs)
			Router.go('project', { wbs: wbs });
	},
});
