// Publish a user's authorizations to himself.
Meteor.publish('myAuthorizations', function() {
	if (this.userId)
		return Meteor.users.find(this.userId, { fields: { authorization: 1 } });
	else
		this.ready();
});

// Publish all users' info to the super user.
Meteor.publish('managedUsers', function(userId) {
	if (Roles.userIsInRole(this.userId, ['super']))
			return Meteor.users.find(userId || {});
	else
		this.ready();
});

// Publish workflows for each individual. Super user gets all of them.
Meteor.publish('workflows', function() {
	if (this.userId) {
		if (Roles.userIsInRole(this.userId, ['super']))
			return Workflows.find();
		else
			return Workflows.find({slug: { $in: roleArray(this.userId) }});
	}
	else {
		this.ready();
	}
});

// Publish appropriate projects for authenticated users.
Meteor.publish('projects', function() {
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
		return Pieces.find();
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
