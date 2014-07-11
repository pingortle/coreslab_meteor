Meteor.startup(function() {
	if (Roles.getAllRoles().count() === 0) {
		Roles.createRole("super");
		Roles.createRole("basic");
	}

	if (Workflows.find().count() === 0) {
		var workflows = [
			{
				slug: "production",
				name: "Production",
			},
			{
				slug: "admin",
				name: "Admin",
				actionLinks: [
					{
						link: "/projects",
						button_label: "Browse projects..."
					},
					{
						link: "/do_something",
						button_label: "Do something!"
					},
					{
						link: "/do_something_else",
						button_label: "Do something else!"
					},
				],
			},
			{
				slug: "scheduling",
				name: "Scheduling",
			},
			{
				slug: "qc",
				name: "QC",
			},
			{
				slug: "shipping-and-erection",
				name: "Shipping/Erection",
			},
			{
				slug: "drafting-and-engineering",
				name: "D&E",
			},
			{
				slug: "finance",
				name: "Finance",
			}
		];
		_.each(workflows, function(x) {
			Roles.createRole(x.slug);
			Workflows.insert(x);
		});
	}
});
