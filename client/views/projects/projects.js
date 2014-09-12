Template.projects.events({
	'click .project-row': function(event) {
		var projectId = event.currentTarget.dataset.projectId;
		if (projectId)
			Router.go('project', { id: projectId });
	},
});

Template.new_project.events({
	'change select[data-schema-key^="elements."][data-schema-key$=".id"]': function(event, template) {
		var id = event.target.value;
		var element = ProductLines.findOne({id: id});

		var arrayIndex = event.target.dataset.schemaKey.replace('.id', '');
		var data = template.$('[data-schema-key^="' + arrayIndex + '"]:not([data-schema-key$=".id"])');
		_.each(data, function(x) {
			var key = x.dataset.schemaKey.replace(/^elements.[0-9]+./, '');
      if (element && element[key])
        x.value = element[key];
		});
	},
});

Template.afObjectField_project_elements.allElements = function() {
	return [{ label: "Please select a product.", value: "" }].concat(ProductLines.find().map(function(x) {
		return { label: x.id + " - " + x.description, value: x.id };
	}));
};

Template.afObjectField_project_elements.elementId = function(element) {
	return element || this.atts.name + ".id";
};
