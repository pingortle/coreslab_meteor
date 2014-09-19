var userWorkflows = null;

Template.user_workflow_settings.helpers({
  userWorkflows: userWorkflows = function (userId) {
    return isSuper(userId) ? Workflows.find() : Workflows.find({slug: { $in: roleArray(userId) }});
  },
  nonUserWorkflows: function (userId) {
    return isSuper(userId) ? [] : Workflows.find({slug: { $nin: roleArray(userId) }});
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
