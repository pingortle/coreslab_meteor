// This collection of helpers is designed to "activate" UI elements based on the
// current URL. (Depends on the IronRouter package...)
/******************************************************************************/
UI.registerHelper('CurrentNavActive', function (route) {
	if (Router.current()) {
		return Router.current().path === escape(route) ? "active" : "";
	}
});

UI.registerHelper('CurrentSlugActive', function (slug) {
	if (Router.current()) {
		return Router.current().path.split("/").pop() === escape(slug) ? "active" : "";
	}
});

UI.registerHelper('CurrentNavRootActive', function (route) {
	if (Router.current()) {
		var root = "/" + _.first(_.compact(Router.current().path.split('/')));
		return root === escape(route) ? "active" : "";
	}
});
/******************************************************************************/

// This helper combines a slug with a base URL. It is designed to be used for
// the href attribute on links.
UI.registerHelper('SlugRoute', function (root, slug) {
	return root + "/" + slug;
});

// This helper takes a collection, either passed in directly or by its name,
// and the type of permission, or types separated by spaces.
// It only returns true if any of the permissions are in effect or you are
// the super user.
UI.registerHelper('HasPermission', function (collectionParam, type) {
	if (isSuper(Meteor.userId())) return true;

	var auth = null;
	if (Meteor.user()) {
		auth = Meteor.user().authorization;
	}

	// No authorizations === no permissions
	if (!auth) return false;

	var collectionAuth = auth[collectionParam] ||
		auth[collectionParam._name] ||
		auth[window[collectionParam]._name];

	var types = type.split(' ');

	return _.some(types, function(t) {
		return collectionAuth[t];
	});
});

// This helper tells whether a given user (or current user, if none is supplied)
// is the super user.
UI.registerHelper('IsSuper', function (userId) {
	return isSuper(userId || Meteor.userId());
});

// This helper hands out gravatar urls for a given user.
UI.registerHelper('GravatarUrl', function (user) {
	user = user || Meteor.user() || { emails: [] };
  var email = _.first(_.pluck(user.emails, "address")) || "user@example.com";
  return Gravatar.imageUrl(email, { size: 40, default: "identicon" });
});
