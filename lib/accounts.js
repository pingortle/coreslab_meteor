// Docs @ http://docs.meteor.com/#accounts_config
Accounts.config({
	// forbidClientAccountCreation: true,
	sendVerificationEmail: true,
	restrictCreationByEmailDomain: function(email) {
		return _.contains(["compsysar.com", "coreslab.com"], email.split("@").pop());
	},
});
