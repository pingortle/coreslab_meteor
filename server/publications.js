Meteor.publish('workflows', function(allowed) {
	return Workflows.find();
});
