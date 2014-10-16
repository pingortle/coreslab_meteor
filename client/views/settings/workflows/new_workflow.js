var routeNameToDisplay = function(name) {
  return name.split("_").join(" ");
};

var removeWords = function(str, words) {
  return _.reduce(words, function(memo, word) {
    return memo.replace(word, "");
  }, str);
};

var containsAny = function(it, these) {
  return _.some(these, function(x) { return it.indexOf(x) > -1; });
};

Template.afObjectField_action_links.helpers({
  routes: function () {
    var res = _.chain(Router.routes)
      .filter(function (x) {
          return x.keys.length === 0 && !containsAny(x.name, ["home", "settings", "workflow"]);
        })
      .map(function (x) {
          return { label: routeNameToDisplay(x.name), value: x.options.path };
        })
      .sortBy(function (x) {
        return removeWords(x.label, ["new "]);
      }).value();

    return [{ label: "Please select a link...", value: "" }].concat(res);
  },
  linkField: function(element) {
    return (element || this.atts.name) + ".link";
  },
});
