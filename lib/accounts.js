// Docs @ http://docs.meteor.com/#accounts_config
Accounts.config({
	// forbidClientAccountCreation: true,
	sendVerificationEmail: true,
	restrictCreationByEmailDomain: function(email) {
		return _.contains(["compsysar.com", "coreslab.com"], email.split("@").pop());
	},
});

var checkPrivilege = function(userId, collection, type) {
  var user = Meteor.users.findOne(userId);
  var auth = user.authorization;
  return auth[collection] && auth[collection][type];
};

Meteor.methods({
  adminCreateUser: function(doc) {
    if (!this.userId ||
      !(Roles.userIsInRole(this.userId, ['super'] ||
          checkPrivilege(this.userId, 'users', 'insert'))))
      throw new Meteor.Error(403, 'Error 403: Not authorized');

    check(doc, AppSchema.NewUser);

    if (Meteor.isServer) {
      var newId = Accounts.createUser({
        username: doc.username,
        email: doc.email,
        profile: { name: doc.fullName }
      });

      Accounts.sendEnrollmentEmail(newId);
    }
  },
});
