Meteor.startup(function () {
	if (Workflows.find().count() == 0) {
		Workflows.insert({
			slug: "production",
			name: "Production",
		});
		Workflows.insert({
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
		});
		Workflows.insert({
			slug: "scheduling",
			name: "Scheduling",
		});
		Workflows.insert({
			slug: "qc",
			name: "QC",
		});
		Workflows.insert({
			slug: "shipping-and-erection",
			name: "Shipping/Erection",
		});
		Workflows.insert({
			slug: "drafting-and-engineering",
			name: "D&E",
		});
		Workflows.insert({
			slug: "finance",
			name: "Finance",
		});
	}
});
