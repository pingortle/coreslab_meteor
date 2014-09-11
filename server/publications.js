var roleArray = function(userId) {
	var roles = Roles.getRolesForUser(this.userId) || [];
	return roles.map(function(x) {
		return x.name;
	});
}

Meteor.publish('managedUsers', function() {
	if (Roles.userIsInRole(this.userId, ['super']))
			return Meteor.users.find();
	else
		this.ready();
});

Meteor.publish('workflows', function(allowed) {
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
	if (this.userId)
		return Projects.find();
});

Meteor.publish('productLines', function() {
	if (this.userId)
		return ProductLines.find({isActive: true});
});
