Meteor.publish('workflows', function(allowed) {
	if (this.userId)
		return Workflows.find();
	else
		this.ready();
});

Meteor.publish('managedUsers', function() {
	if (this.userId)
		return Meteor.users.find();
	else
		this.ready();
});
