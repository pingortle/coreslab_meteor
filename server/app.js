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

	if (Projects.find().count() === 0) {
		var projects = [
			{
				id: "010.017",
				description: "Southwest PowerPool Ops Center/Parking Garage",
				customer: "Jimmy Dean Baked Beans Inc.",
				status: "sold",
				estimatedPourCount: 10,
				estimatedLoads: {
					legal: 1,
					permit: 2,
					escort: 3,
				},
			},
			{
				id: "012.002",
				description: "Valley View Gym",
				status: "sold",
				estimatedPourCount: 10,
				estimatedLoads: {
					legal: 1,
					permit: 2,
					escort: 3,
				},
			},
			{
				id: "012.018",
				description: "Calico Rock Addition",
				status: "sold",
				estimatedPourCount: 4,
				estimatedLoads: {
					legal: 1,
					permit: 1,
					escort: 1,
				},
			},
			{
				id: "012.014",
				description: "Brookland High School Addition",
				status: "sold",
				estimatedPourCount: 90,
				estimatedLoads: {
					legal: 0,
					permit: 0,
					escort: 0,
				},
			},
		];
		_.each(projects, function(x) {
			Projects.insert(x);
		});
	}
});
