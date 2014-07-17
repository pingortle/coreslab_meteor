Template.projects.events({
	'click .project-row': function(event) {
		var wbs = event.currentTarget.dataset.wbs;
		if (wbs)
			Router.go('project', { wbs: wbs });
	},
});
