Template.settings.events({
  'click #changeName': function (e) {
    var input = $('input[name="name"]');
    Meteor.users.update(Meteor.userId(), { $set: { "profile.name": input.val() }});
  }
});
