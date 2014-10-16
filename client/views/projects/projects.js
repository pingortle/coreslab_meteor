Template.projects.events({
	'click .project-row': function(event) {
		var projectId = event.currentTarget.dataset.projectId;
		if (projectId)
			Router.go('project', { id: projectId });
	},
});

Template.project_data.events({
	'click button.update-item': function(event) {
		var projectId = event.currentTarget.dataset.itemId;
		Router.go('edit_project', { id: projectId });
	},
	'click button.remove-item': function(event) {
		Router.go('projects');

		var projectId = event.currentTarget.dataset.itemId;
		Projects.remove(projectId);
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

Template.new_project.rendered = function () {
	var renderContext = this;
	Meteor.call('getNextProjectNumber', function (error, result) {
		if (error) Status.error(error);

		if (result)
			renderContext.$('input[data-schema-key="id"]').val(result);
	});
};

Template.edit_project.rendered = function() {
	var renderContext = this;
	this.autorun(function () {
		var projectId = _.first(renderContext.$('input[data-schema-key="id"]')).value;
		var project = Projects.findOne({id: projectId});

		if (project) {
			_.each(
				renderContext.$('select[data-schema-key^="elements."][data-schema-key$=".id"]'),
				function (element) {
					var index = +element.dataset.schemaKey.split('.')[1];
					var elementId = project.elements[index].id;
					var elementDescription = project.elements[index].description;

					var option = renderContext.$(element).find('option:contains("' + elementId +'")').find('option:contains("' + elementDescription + '")');
					if (option.length === 0) {
						renderContext.$(element)
							.append('<option value="' + elementId + '">' + elementId + ' - ' + elementDescription + '</option>');
					}

					element.value = elementId;
			});
		}
	});
};

Template.edit_project.events({
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

Template.afObjectField_project_elements.helpers({
	allElements: function() {
		return [{ label: "Please select a product…", value: "" }]
			.concat(ProductLines.find({}, {sort: { id: 1 }}).map(function(x) {
				return { label: x.id + "\t-\t" + x.description, value: x.id };
			}));
	},
	elementId: function(element) {
		return (element || this.atts.name) + ".id";
	},
});
