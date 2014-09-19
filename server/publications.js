Meteor.publish('myAuthorizations', function() {
	if (this.userId)
		return Meteor.users.find(this.userId, { fields: { authorization: 1 } });
	else
		this.ready();
});

Meteor.publish('managedUsers', function(userId) {
	if (Roles.userIsInRole(this.userId, ['super']))
			return Meteor.users.find(userId || {});
	else
		this.ready();
});

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

Meteor.publish('projects', function() {
	var options = { sort: { id: 1 } };

	if (this.userId)
		return Projects.find({}, options);
});

Meteor.publish('productLines', function() {
	var options = { sort: { id: 1 } };

	if (this.userId)
		return ProductLines.find({ isActive: true }, options);
});
