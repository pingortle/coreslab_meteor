Template.afObjectField_action_links.helpers({
  routes: function () {
    var res =
    _.map(
      _.sortBy(_.filter(Router.routes, function (x) {
        return x.keys.length === 0;
      }), function (x) { return x.name; }),
      function (x) { return { label: x.name, value: x.options.path }; });
    console.log(res);
    return [{ label: "Please select a link...", value: "" }].concat(res);
  },
  linkField: function(element) {
    console.log(this);
    return (element || this.atts.name) + ".link";
  },
});
