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
		return Router.current().path.indexOf(escape(route)) === 0 ? "active" : "";
	}
});
/******************************************************************************/

// This helper combines a slug with a base URL. It is designed to be used for
// the href attribute on links.
UI.registerHelper('SlugRoute', function (root, slug) {
	return root + "/" + slug;
});
