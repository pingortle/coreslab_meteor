Accounts.config({
	// forbidClientAccountCreation: true,
	sendVerificationEmail: true,
	restrictCreationByEmailDomain: function(email) {
		return _.contains(["compsysar.com", "coreslabar.com"], email.split("@").pop());
	},
});
