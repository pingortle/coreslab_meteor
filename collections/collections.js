AppSchema = {};

AppSchema.Workflow = new SimpleSchema({
	slug: {
		type: String,
		label: "Unique Name",
		regEx: /^[a-z0-9-]{2,64}$/,
		index: true,
		unique: true,
	},
	name: {
		type: String,
		label: "Displayed Name",
		max: 100,
	},
	actionLinks: {
		type: [Object],
		maxCount: 10,
		optional: true,
	},
	"actionLinks.$.link": {
		type: String,
		label: "Action Link",
		max: 200,
	},
	"actionLinks.$.button_label": {
		type: String,
		label: "Button Label",
		max: 140,
	},
});

Workflows = new Meteor.Collection('workflows');
Workflows.attachSchema(AppSchema.Workflow);

AppSchema.Project = new SimpleSchema({
	wbs: {
		type: String,
		label: "WBS",
		regEx: /^[0-9]{3}\.[0-9]{3}$/,
		index: true,
		unique: true,
	},
	description: {
		type: String,
		label: "Description",
		max: 100,
	},
});

Projects = new Meteor.Collection('projects');
Projects.attachSchema(AppSchema.Project);

_.each([Workflows, Projects], function(collection) {
	collection.allow({
		insert: function(uID) {
			return uID;
		},
		update: function(uID) {
			return uID;
		},
	});
})
