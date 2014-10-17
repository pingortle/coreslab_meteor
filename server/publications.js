// Publish a user's authorizations to himself.
Meteor.publish('myAuthorizations', function() {
	if (this.userId)
		return Meteor.users.find(this.userId, { fields: { authorization: 1 } });
	else
		this.ready();
});

// Publish all users' info to the super user.
Meteor.publish('managedUsers', function(userId) {
	var user = Meteor.users.findOne(this.userId);
	var isAuthorized =
		user &&
		user.authorization &&
		user.authorization.users &&
		_.some(_.values(user.authorization.users));
	if (Roles.userIsInRole(this.userId, ['super']) || isAuthorized)
			return Meteor.users.find(
				userId || {},
				{
					sort: { createdAt: -1 },
					fields: { services: 0 },
				});
	else
		this.ready();
});

// Publish workflows for each individual. Super user gets all of them.
Meteor.publish('workflows', function() {
	if (this.userId) {
		if (Roles.userIsInRole(this.userId, ['super']))
			return Workflows.find({}, { sort: { slug: 1 } });
		else
			return Workflows.find({slug: { $in: roleArray(this.userId) }}, { sort: { slug: 1 } });
	}
	else {
		this.ready();
	}
});

// Publish appropriate projects for authenticated users.
Meteor.publish('projects', function(filter) {
	filter = filter || {};

	if (filter.singleId)
		return Projects.find({ _id: filter.singleId });

	var options = { sort: { id: 1 } };

	if (this.userId)
		return Projects.find({}, options);
});

// Publish appropriate pieces for authenticated users.
Meteor.publish('pieces', function(filter) {
	filter = filter || {};

	if (filter.singleId)
		return Pieces.find({ _id: filter.singleId });

	if (this.userId)
		return Pieces.find({}, { sort: {id: 1} });
});

// Publish collections with common filter options.
_.each([ProductLines, Beds],

	// Pass a filter object describing which items are published.
	// Filter options:
	//   allowInactive (Boolean): Publish inactive as well as active?
	function(collection) {
		Meteor.publish(collection._name, function(filter) {
			if (!this.userId)
				return null;

			filter = filter || {};

			if (filter.singleId)
				return collection.find({ _id: filter.singleId });

			var options = { sort: { id: 1 } };
			var selector = filter.allowInactive ? {} : { isActive: true };

			return collection.find(selector, options);
		});
	});
