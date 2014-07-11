Accounts.onLogin(function(attempt) {
	if (Meteor.users.find().count() === 1 && !Roles.userIsInRole(attempt.user._id, ["super"]))
		Roles.addUsersToRoles(attempt.user._id, ["super"]);
	else if (!Roles.userIsInRole(attempt.user._id, ["basic"]))
		Roles.addUsersToRoles(attempt.user._id, ["basic"]);
});
