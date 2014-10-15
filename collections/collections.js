// Docs for simple-schema @ https://atmospherejs.com/aldeed/simple-schema
// Docs for autoform @ https://atmospherejs.com/aldeed/autoform

AppSchema = {};
AppSchema.RegEx = {};
AppSchema.Messages = {};
AppSchema.RegEx.ImperialLength = /^(?:0|[1-9][0-9]*(?:\/[1-9][0-9]*| [1-9][0-9]*\/[1-9][0-9]*)?(?:'|")|[1-9][0-9]*' [1-9][0-9]*(?:\/[1-9][0-9]*\/[1-9][0-9]*)?")$/;
AppSchema.Messages.ImperialLength = "Enter a length, like 0, 12', 12 1/2', 12' 6\", etc...";

// This should be a mapping from Collection._name to the name as displayed in the UI.
AppSchema.DisplayNames = {};
AppSchema.getDisplayName = function(collection) {
	return AppSchema.DisplayNames[collection._name];
};

var addCollectionDisplayName = function(collection, name) {
	var displayNames = AppSchema.DisplayNames;
	displayNames[collection._name] = name;
};

// This converts a schema definition into list form.
// DEPRECATED: newer versions of Simple Schema support nested schemas.
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
		label: "Action Links",
		maxCount: 10,
		optional: true,
	},
	"actionLinks.$.link": {
		type: String,
		label: "Action Link",
		max: 200,
		regEx: /^(?:\/[ \w-]+)+(?:\?[^#]*)?(?:#[\w]*)?$/,
	},
	"actionLinks.$.button_label": {
		type: String,
		label: "Button Label",
		max: 140,
	},
});

AppSchema.Workflow.messages({
	"regEx slug": "Please use only lower-case letters, numbers, and dashes.",
	"regEx actionLinks.$.link": "Invalid link. Please contact the administrator.",
});

Workflows = new Meteor.Collection('workflows');
Workflows.attachSchema(AppSchema.Workflow);
addCollectionDisplayName(Workflows, "Workflows");

var projectElementSchema = {
	id: {
		type: String,
		label: "Product Code",
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
		type: String,
		label: "Total Area (sqft)",
		regEx: AppSchema.RegEx.ImperialLength,
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
		type: String,
		label: "Total Area (sqft)",
		regEx: AppSchema.RegEx.ImperialLength,
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
var projectIdRegEx = /^[0-9]{3}\.[0-9]{3}$/;

var projectSchema = {
	id: {
		type: String,
		label: "Project Number",
		regEx: projectIdRegEx,
		index: true,
		unique: true,
	},
	description: {
		type: String,
		label: "Project Name",
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
		optional: true,
	},
	"estimatedLoads.escort": {
		type: Number,
		label: "Truckloads Escort",
		min: 0,
		optional: true,
	},

	elements: {
		type: [Object],
		label: "Project Elements",
	},

	createdAt: {
		type: Date,
		autoValue: function() {
			if (this.isInsert) {
				return new Date();
			} else if (this.isUpsert) {
				return { $setOnInsert: new Date() };
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
addCollectionDisplayName(Projects, "Projects");

var projectMessages = {};

AppSchema.Project.messages({
	"regEx id": projectMessages.id = "Project IDs should be made up of digits and periods, e.g. 123.456",
	"regEx elements.$.id": projectMessages.elementId = "Product Code should be a three digit number.",
	"regEx elements.$.estimate.totalSqFt": AppSchema.Messages.ImperialLength,
	"regEx elements.$.actual.totalSqFt": AppSchema.Messages.ImperialLength,
});

var cancelUniqueIndex = { unique: false, index: false };

AppSchema.Piece = new SimpleSchema({
	projectID: _.extend(projectSchema.id, cancelUniqueIndex),
	projectElementID: _.extend(projectElementSchema.id, cancelUniqueIndex),
	mark: {
		type: String,
		label: "Piece Mark",
	},
	controlNumber: {
		type: String,
		label: "Control Number",
		index: false,
	},
	length: {
		type: String,
		label: "Length (ft)",
		regEx: AppSchema.RegEx.ImperialLength,
	},
	width: {
		type: String,
		label: "Width (ft)",
		regEx: AppSchema.RegEx.ImperialLength,
	},
	depth: {
		type: String,
		label: "Depth (ft)",
		regEx: AppSchema.RegEx.ImperialLength,
	},
	height: {
		type: String,
		label: "Height (ft)",
		regEx: AppSchema.RegEx.ImperialLength,
	},
	weight: {
		type: String,
		label: "Weight (lbs)"
	},
	concreteVolume: {
		type: Object,
		label: "Concrete Volume (cubic yds)"
	}, 
	"concreteVolume.face": {
		type: String,
		label: "Face",
	},
	"concreteVolume.back": {
		type: String,
		label: "Back",
		optional: true,
	},
	approved: {
		type: Boolean,
		label: "Approved",
		defaultValue: true,
	},
});

AppSchema.Piece.messages({
	"regEx projectID": projectMessages.id,
	"regEx projectElementID": projectMessages.elementId,
	"regEx length": AppSchema.Messages.ImperialLength,
	"regEx width": AppSchema.Messages.ImperialLength,
	"regEx depth": AppSchema.Messages.ImperialLength,
	"regEx height": AppSchema.Messages.ImperialLength,
	"regEx weight": AppSchema.Messages.ImperialLength,
});

Pieces = new Meteor.Collection('pieces');
Pieces.attachSchema(AppSchema.Piece);
addCollectionDisplayName(Pieces, "Pieces");

AppSchema.Bed = new SimpleSchema({
	name: {
		type: String,
		label: "Name",
	},
	formLength: {
		type: String,
		label: "Form Length (ft)",
		regEx: AppSchema.RegEx.ImperialLength,
	},
	strandLength: {
		type: String,
		label: "Strand Length (ft)",
		regEx: AppSchema.RegEx.ImperialLength,
	},
	isActive: {
		type: Boolean,
		label: "Active",
		defaultValue: true,
	},
});

AppSchema.Bed.messages({
	"regEx formLength": AppSchema.Messages.ImperialLength,
	"regEx strandLength": AppSchema.Messages.ImperialLength,
});

Beds = new Meteor.Collection('beds');
Beds.attachSchema(AppSchema.Bed);
addCollectionDisplayName(Beds, "Beds");

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
addCollectionDisplayName(ProductLines, "Product Lines");
AppSchema.ProductLine.messages({
	"regEx id": "Product Code should be a three digit number."
});

var createAuthFunction = function (authorization, operation) {
	return function(userId) {
		var user = Meteor.users.findOne(userId);
		var authObj = user && user.authorization && user.authorization[authorization];
		return isSuper(userId) || (authObj && authObj[operation]);
	};
};

var collectionListing = [Workflows, Projects, ProductLines, Beds, Pieces, Meteor.users];

_.each(collectionListing, function(x) {
	var name = x._name;
	x.allow(_.reduce(["insert", "update", "remove"],
		function(acc, n) {
			return (acc[n] = createAuthFunction(name, n)) && acc;
		},
		{}));
});

var authSchemaDefinition = _.reduce(
	_.pluck(collectionListing, '_name'),
	function (acc, n) {
		acc[n] = { type: Object };
		_.each(
			_.map(["insert", "update", "remove"],
				function(y) { return n + "." + y; }),
			function(y) { acc[y] = { type: Boolean }; });
		return acc;
	},
	{});

authSchemaDefinition = _.extend(authSchemaDefinition, {
	userId: {
		type: String,
		autoform: {
			omit: true,
		}
	}
});

AppSchema.Authorization = new SimpleSchema(authSchemaDefinition);
