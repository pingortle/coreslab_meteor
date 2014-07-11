Workflows = new Meteor.Collection('workflows');

if (Meteor.isServer)
	Workflows._ensureIndex("slug", { unique: 1 });
