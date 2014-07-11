Workflows = new Meteor.Collection('workflows');
if (Meteor.isServer)
	Workflows._ensureIndex("slug", { unique: 1 });

Projects = new Meteor.Collection('projects');
if (Meteor.isServer)
	Projects._ensureIndex("wbs", { unique: 1 });
