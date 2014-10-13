Template.user_authorization_settings.events({
  'change input[type="checkbox"][data-schema-key]': function (e, t) {
    var values = AutoForm.getFormValues('authorizationForm');
    var ckbox = e.target;
    Meteor.call('setUserAuthorization', values.insertDoc, function (error, result) {
      if (error)
      {
        $(ckbox).prop('checked', !ckbox.checked);
      }
    });
  }
});

Template.user_authorization_settings.username = function() {
  if (this.username) return this.username;

  var emailObj = _.first(this.emails);
  return emailObj && emailObj.address;
};

Template.user_authorization_settings.authSchema = function() {
  return AppSchema.Authorization;
};

Template.user_authorization_settings.subDoc = function(obj, key) {
  return obj + "." + key;
};

Template.user_authorization_settings.authTypes = function(baseName) {
  return _.map(["insert", "update", "remove"],
    function(x) { return { fieldName: baseName + "." + x }; });
};

Template.user_authorization_settings.rendered = function() {
  var theTemplate = this;
  theTemplate.autorun(function() {
    var data = Blaze.getCurrentData();
    if (data)
    {
      var authObj = data.authorization;

      if (!authObj)
        return;

      var checkboxes = theTemplate.$('input[type="checkbox"][data-schema-key]');
      _.each(checkboxes, function(x) {
        var keys = x.dataset.schemaKey.split(".");
        var isChecked = authObj[keys[0]] && authObj[keys[0]][keys[1]];
        $(x).prop("checked", isChecked);
      });
    }
  });
};
