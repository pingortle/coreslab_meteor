Template.projects.events({
	'click .project-row': function(event) {
		var projectId = event.currentTarget.dataset.projectId;
		if (projectId)
			Router.go('project', { id: projectId });
	},
});

Template.new_project.events({
	'change select.project-element-picker': function(event, template) {
		var id = event.target.value;
		var element = ProjectElements.findOne({id: id});

		var arrayIndex = event.target.dataset.schemaKey.replace('.id', '');
		var data = template.$('[data-schema-key^="' + arrayIndex + '"]:not([data-schema-key$=".id"])');
		_.each(data, function(x) {
			var key = x.dataset.schemaKey.replace(/^elements.[0-9]+./, '');
			x.value = (element && element[key]) || "";
		});
	},
});

Template.project_element_input.allElements = function() {
	return ProjectElements.find();
};

Template.project_element_input.elementId = function(element) {
	return element || this.ctx.atts.name + ".id";
};
