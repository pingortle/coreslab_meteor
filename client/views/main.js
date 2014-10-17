// Docs @ http://docs.meteor.com/#meteor_startup
Meteor.startup(function () {
  Meteor.subscribe('myAuthorizations');
});

AutoForm.addHooks(null, {
  onSubmit: function() {
    Status.saving();
  },
  onSuccess: function() {
    Status.complete();
  },
  onError: function(operation, error) {
    Status.error(error || {reason: "There was a problem with the " + operation + "."});
  }
});

// FWIW, this makes the UI snappier on mobile devices.
window.addEventListener('load', function() {
	FastClick.attach(document.body);
}, false);
