var sortBySlug = { sort: {slug: 1} };

Template.user_workflow_settings.helpers({
  workflows: function (userId) {
    return Workflows.find({}, sortBySlug);
  },
  doesOwnWorkflow: function (userId, slug) {
    return Roles.userIsInRole(userId, [slug]);
  },
  username: function(user) {
    var emailObj = user && _.first(user.emails);
    return user && user.username || emailObj && emailObj.address;
  },
});

Template.user_workflow_settings.events({
  'click .workflow-item': function (e, t) {
    var slug = e.target.dataset.slug;
    if (Roles.userIsInRole(t.data.user._id, [slug])) {
      Meteor.call('removeUserFromRole', t.data.user._id, slug, function (error, result) {
        if (error) console.log(error);
      });
    } else {
      Meteor.call('addUserToRole', t.data.user._id, slug, function (error, result) {
        if (error) console.log(error);
      });
    }
  },
});
