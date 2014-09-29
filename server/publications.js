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

// Publish appropriate product lines for authenticated users.
// Pass a filter object describing which product lines are published.
// Filter options:
//   allowInactive (Boolean): Publish inactive as well as active?
Meteor.publish('productLines', function(filter) {
	filter = filter || {};
	var options = { sort: { id: 1 } };
	var selector = filter.allowInactive ? {} : { isActive: true };

	if (this.userId)
		return ProductLines.find(selector, options);
});

// Publish appropriate beds for authenticated users.
// Pass a filter object describing which bes are published.
// Filter options:
//   allowInactive (Boolean): Publish inactive as well as active?
Meteor.publish('beds', function(filter) {
	filter = filter || {};
	var options = { sort: { id: 1 } };
	var selector = filter.allowInactive ? {} : { isActive: true };

	if (this.userId)
		return Beds.find(selector, options);
});
