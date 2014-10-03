// Super user can change users.
// TODO: Decide if this is a good thing...?
Meteor.users.allow({
	update: function (userId, doc, fields, modifier) {
		return userId && Roles.userIsInRole(userId, ['super']);
	}
});

// Docs @ http://docs.meteor.com/#meteor_methods
Meteor.methods({
	setUserAuthorization: function(doc) {
		if (!this.userId || !Roles.userIsInRole(this.userId, ['super']))
			throw new Meteor.Error(403, 'Error 403: Not authorized');

		// Important server-side check for security and data integrity
		check(doc, AppSchema.Authorization);

		var authDoc = _.omit(doc, ['userId']);

		Meteor.users.update(doc.userId, { $set: { authorization: authDoc } });
	},
	addUserToRole: function(userId, role) {
		if (!this.userId || !Roles.userIsInRole(this.userId, ['super']))
			throw new Meteor.Error(403, 'Error 403: Not authorized');

		Roles.addUsersToRoles(userId, [role]);
	},
	removeUserFromRole: function(userId, role) {
		if (!this.userId || !Roles.userIsInRole(this.userId, ['super']))
			throw new Meteor.Error(403, 'Error 403: Not authorized');

		Roles.removeUsersFromRoles(userId, [role]);
	},
	setEmailVerification: function(email, shouldBeVerified) {
		var user = Meteor.users.findOne(this.userId);
		var auth = user.authorization &&
			user.authorization.users &&
			user.authorization.users.update;
		if (!user || !auth && !Roles.userIsInRole(this.userId, ['super']))
			throw new Meteor.Error(403, 'Not authorized');

		check(email, String);
		check(shouldBeVerified, Boolean);

		Meteor.users.update(
			{"emails.address": email },
			{ $set: { "emails.$.verified": shouldBeVerified } });
	},
});

// Docs @ http://docs.meteor.com/#meteor_startup
Meteor.startup(function() {
	if (Roles.getAllRoles().count() === 0) {
		Roles.createRole("super");
		Roles.createRole("basic");
	}

	// Seed the DB with fake info.
	// TODO: Delete/replace this stuff before going into production.
	if (Workflows.find().count() === 0) {
		var workflows = [
			{
				slug: "production",
				name: "Production",
			},
			{
				slug: "admin",
				name: "Admin",
				actionLinks: [
					{
						link: "/projects",
						button_label: "Browse projects..."
					},
				],
			},
			{
				slug: "scheduling",
				name: "Scheduling",
			},
			{
				slug: "qc",
				name: "QC",
			},
			{
				slug: "shipping-and-erection",
				name: "Shipping/Erection",
			},
			{
				slug: "drafting-and-engineering",
				name: "D&E",
			},
			{
				slug: "finance",
				name: "Finance",
			}
		];
		_.each(workflows, function(x) {
			Roles.createRole(x.slug);
			Workflows.insert(x);
		});
	}
});
