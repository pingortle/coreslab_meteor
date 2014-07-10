UI.registerHelper('CurrentNavActive', function (route) {
	if (Router.current()) {
		return Router.current().path === escape(route) ? "active" : "";
	}
});

UI.registerHelper('CurrentNavRootActive', function (route) {
	if (Router.current()) {
		return Router.current().path.indexOf(escape(route)) === 0 ? "active" : "";
	}
});
