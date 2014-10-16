Template.settings.events({
  'click #changeName': function (e) {
    var input = $('input[name="name"]');
    Status.saving();
    Meteor.users.update(
      Meteor.userId(),
      { $set: { "profile.name": input.val() }},
      function(err) {
        if (err) {
          Status.error(err);
        } else {
          Status.complete();
        }
      });
  }
});
