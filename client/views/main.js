// Docs @ http://docs.meteor.com/#meteor_startup
Meteor.startup(function () {
  Meteor.subscribe('myAuthorizations');
})

// FWIW, this makes the UI snappier on mobile devices.
window.addEventListener('load', function() {
	FastClick.attach(document.body);
}, false);
