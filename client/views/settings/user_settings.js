Template.user_settings.events({
  'click .user-verified-indicator': function (e) {
    var isValid = $(e.currentTarget).hasClass("yes");
    var email = e.currentTarget.dataset.email;
    var action = isValid ? "disable"  : "enable";

    if (confirm("Are you sure you want to " + action + " " + email + "?" ))
      Meteor.call('setEmailVerification', email, !isValid, function (error, result) {
        if (error) {console.log(error); }
      });
  },
});

Template.user_settings.helpers({
  verificationAction: function (verified) {
    return verified ? "disable"  : "enable";
  }
});
