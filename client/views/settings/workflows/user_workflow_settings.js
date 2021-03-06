var sortBySlug = { sort: {slug: 1} };

Template.user_workflow_settings.helpers({
  workflows: function (userId) {
    return Workflows.find({}, sortBySlug);
  },
  doesOwnWorkflow: function (userId, slug) {
    return Roles.userIsInRole(userId, [slug]) || isSuper(userId);
  },
  username: function(user) {
    if (user.username) return user.username;

    var emailObj = user && _.first(user.emails);
    return user && user.username || emailObj && emailObj.address;
  },
});

Template.user_workflow_settings.events({
  'click .workflow-item': function (e, t) {
    var slug = e.target.dataset.slug;
    Status.saving();
    if (Roles.userIsInRole(t.data.user._id, [slug])) {
      Meteor.call('removeUserFromRole', t.data.user._id, slug, function (error, result) {
        if (error) {
          Status.error(error);
        } else {
          Status.complete();
        }
      });
    } else {
      Meteor.call('addUserToRole', t.data.user._id, slug, function (error, result) {
        if (error) {
          Status.error(error);
        } else {
          Status.complete();
        }
      });
    }
  },
});
