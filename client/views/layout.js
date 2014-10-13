Template.layout.helpers({
  breadcrumbs: function () {
    return Session.get("breadcrumbs");
  },
  gravatarUrl: function () {
    var user = Meteor.user() || { emails: [] };
    var email = _.first(_.pluck(user.emails, "address")) || "user@example.com";
    return Gravatar.imageUrl(email, { size: 40, default: "mm" });
  },
});
