// Docs @ http://docs.meteor.com/#accounts_onlogin
Accounts.onLogin(function(attempt) {
	if (Meteor.users.find().count() === 1 && !Roles.userIsInRole(attempt.user._id, ["super"]))
		Roles.addUsersToRoles(attempt.user._id, ["super"]);
	else if (!Roles.userIsInRole(attempt.user._id, ["basic"]))
		Roles.addUsersToRoles(attempt.user._id, ["basic"]);
});

// Docs @ http://docs.meteor.com/#accounts_validateloginattempt
Accounts.validateLoginAttempt(function(attempt) {
  if (attempt.user && !_.some(
      attempt.user.emails,
      function(email) { return email.verified; }))
    throw new Meteor.Error(403, 'Email address not verified.');

  return true;
});
