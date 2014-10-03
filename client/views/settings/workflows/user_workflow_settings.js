var userWorkflows = null;

var sortBySlug = { sort: {slug: 1} };

Template.user_workflow_settings.helpers({
  userWorkflows: userWorkflows = function (userId) {
    return isSuper(userId) ? Workflows.find({}, sortBySlug) : Workflows.find({slug: { $in: roleArray(userId) }}, sortBySlug);
  },
  nonUserWorkflows: function (userId) {
    return isSuper(userId) ? [] : Workflows.find({slug: { $nin: roleArray(userId) }}, sortBySlug);
  }
});

Template.user_workflow_settings.events({
  'change select#addWorkflowToUser': function (e, t) {
    var slug = e.target.value;
    Meteor.call('addUserToRole', t.data.user._id, slug, function (error, result) {
      if (error)
        console.log(error);
    });
  },
  'click button.remove-workflow': function (e, t) {
    var slug = e.target.dataset.slug;
    Meteor.call('removeUserFromRole', t.data.user._id, slug, function (error, result) {
      if (error)
        console.log(error);
    });
  }
});
