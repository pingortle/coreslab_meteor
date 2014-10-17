Template.user_settings.events({
  'click .user-verified-indicator': function (e) {
    var isValid = $(e.currentTarget).hasClass("verified");
    var email = e.currentTarget.dataset.email;
    var action = isValid ? "disable"  : "enable";

    if (confirm("Are you sure you want to " + action + " " + email + "?" ))
      Meteor.call('setEmailVerification', email, !isValid, function (error, result) {
        if (error) {console.log(error); }
      });
  },
  'click .toggle-admin-privileges': function (e) {
    Status.saving();
    var userId = e.target.dataset.userId;
    if (isSuper(userId)) {
      if (Meteor.users.find({roles: "super"}).count() <= 1) {
        Status.error({ reason: "There must be at least one administrator." });
      } else {
        Meteor.call('removeUserFromRole', userId, "super", function (error, result) {
          if (error) {
            Status.error(error);
          } else {
            Status.complete();
          }
        });
      }
    } else {
      Meteor.call('addUserToRole', userId, "super", function (error, result) {
        if (error) {
          Status.error(error);
        } else {
          Status.complete();
        }
      });
    }
  },
});

Template.user_settings.helpers({
  verificationAction: function (verified) {
    return verified ? "disable"  : "enable";
  }
});
