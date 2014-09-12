AppSchema = {};

var toListSchema = function(schema, listName) {
	return _.reduce(
		_.zip(_.keys(schema), _.values(schema)),
		function (acc, next) {
			return (acc[listName + ".$." + next[0]] = next[1]) && acc;
		},
		{});
};

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

var projectElementSchema = {
	id: {
		type: String,
		label: "Element Prefix",
		regEx: /^[0-9]{3}$/,
	},
	description: {
		type: String,
		label: "Description",
		max: 100,
	},
	estimate: {
		type: Object,
		label: "Estimates",
	},
	"estimate.totalSales": {
		type: Number,
		label: "Total Sales",
		decimal: true,
		min: 0,
	},
	"estimate.totalSqFt": {
		type: Number,
		label: "Total Square Feet",
		decimal: true,
		min: 0,
	},
	actual: {
		type: Object,
		label: "Actual",
		optional: true,
	},
	"actual.totalSales": {
		type: Number,
		label: "Total Sales",
		decimal: true,
		min: 0,
	},
	"actual.totalSqFt": {
		type: Number,
		label: "Total Square Feet",
		decimal: true,
		min: 0,
	},
	estimatedPourCount: {
		type: Number,
		label: "Estimated Number of Pours",
		min: 0,
	},
	estimatedPieceCount: {
		type: Number,
		label: "Estimated Number of Pieces",
		min: 0,
	},
	laborEntry: {
		type: String,
		label: "Labor Entry Style",
		allowedValues: ["element", "piece"],
		autoform: {
			options: [
				{ label: "By Element", value: "element" },
				{ label: "By Piece", value: "piece" },
			],
		},
	},
};

var projectStatusAllowedVals = ["sold", "cancelled", "pending"];
var projectIdRegex = /^[0-9]{3}\.[0-9]{3}$/;

var projectSchema = {
	id: {
		type: String,
		label: "Project",
		regEx: projectIdRegex,
		index: true,
		unique: true,
	},
	description: {
		type: String,
		label: "Description",
		max: 100,
	},
	customer: {
		type: String,
		label: "Customer",
		max: 100,
		optional: true,
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
	estimatedPourCount: {
		type: Number,
		label: "Estimated Total Pours",
		min: 1,
	},
	estimatedLoads: {
		type: Object,
		label: "Estimated Loads",
	},
	"estimatedLoads.legal": {
		type: Number,
		label: "Truckloads Legal",
		min: 0,
	},
	"estimatedLoads.permit": {
		type: Number,
		label: "Truckloads Permit",
		min: 0,
	},
	"estimatedLoads.escort": {
		type: Number,
		label: "Truckloads Escort",
		min: 0,
	},

	elements: {
		type: [Object],
		label: "Project Elements",
	},

	createdAt: {
		type: Date,
		autoValue: function() {
			if (this.isInsert) {
				return new Date;
			} else if (this.isUpsert) {
				return { $setOnInsert: new Date };
			} else {
				this.unset();
			}
		},
		autoform: {
			omit: true,
		},
	},
};

AppSchema.Project = new SimpleSchema(_.extend(
	projectSchema,
	toListSchema(projectElementSchema, 'elements')));

Projects = new Meteor.Collection('projects');
Projects.attachSchema(AppSchema.Project);

var projectMessages = {};

AppSchema.Project.messages({
	"regEx id": projectMessages.id = "Project IDs should be made up of digits and periods, e.g. 123.456",
	"regEx elements.$.id": projectMessages.elementId = "Element Prefixes should be a three digit number.",
});

AppSchema.Piece = new SimpleSchema({
	controlNumber: {
		type: String,
		label: "Control Number",
		index: false,
	},
	mark: {
		type: String,
		label: "Piece Mark",
	},
	projectElementID: projectElementSchema.id,
	projectID: projectSchema.id,
});

AppSchema.Piece.messages({
	"regEx projectID": projectMessages.id,
	"regEx projectElementID": projectMessages.elementId,
});

Pieces = new Meteor.Collection('pieces');
Pieces.attachSchema(AppSchema.Piece);

AppSchema.Bed = new SimpleSchema({
	name: {
		type: String,
		label: "Name",
	},
	formLength: {
		type: String,
		label: "Form Length",
	},
	strandLength: {
		type: String,
		label: "Strand Length",
	},
	isActive: {
		type: Boolean,
		label: "Active",
		defaultValue: true,
	},
});

Beds = new Meteor.Collection('beds');
Beds.attachSchema(AppSchema.Bed);

AppSchema.ProductLine = new SimpleSchema({
	id: {
		type: String,
		label: "Product Code",
		regEx: /^[0-9]{3}$/,
		index: true,
		unique: true,
	},
	category: {
		type: String,
		label: "Category",
	},
	description: {
		type: String,
		label: "Description",
	},
	unitType: {
		type: String,
		label: "Unit of Measure",
		allowedValues: ["ft", "sqft"],
	},
	isActive: {
		type: Boolean,
		label: "Active",
		defaultValue: true,
	},
});

ProductLines = new Meteor.Collection('productLines');
ProductLines.attachSchema(AppSchema.ProductLine);

var isSuper = function (userId) {
	return userId && Roles.userIsInRole(userId, ['super']);
};

_.each([Projects, ProductLines], function(x) {
	x.allow({
	insert: isSuper,
	update: isSuper,
	remove: isSuper,
	});
});
