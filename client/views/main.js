Meteor.startup(function () {
  Meteor.subscribe('myAuthorizations');
})

window.addEventListener('load', function() {
	FastClick.attach(document.body);
}, false);
