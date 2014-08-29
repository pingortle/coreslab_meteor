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

var projectStatusAllowedVals = ["sold", "cancelled", "pending"];
var projectIdRegex = /^[0-9]{3}\.[0-9]{3}$/;

AppSchema.Project = new SimpleSchema({
	id: {
		type: String,
		label: "Project",
		regEx: /^[0-9]{3}\.[0-9]{3}$/,
		index: true,
		unique: true,
	},
	description: {
		type: String,
		label: "Description",
		max: 100,
	},
	status: {
		type: String,
		label: "Status",
		allowedValues: projectStatusAllowedVals,
		autoform: {
			options: _.map(projectStatusAllowedVals, function(val) {
					return { label: val.charAt(0).toUpperCase() + val.slice(1), value: val };
				}),
		},
	},
});

Projects = new Meteor.Collection('projects');
Projects.attachSchema(AppSchema.Project);

Projects.simpleSchema().messages(
{
	"regEx id": "Project IDs should be made up of digits and periods, e.g. 123.456",
});
