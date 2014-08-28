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

UI.registerHelper('SlugRoute', function (root, slug) {
	return root + "/" + slug;
});
