// Major HACK!!!!!
Template.home.rendered = function () {
  console.log("FIXME: This is a nastily hackish redirect hack. Hack hack hack...");
  Router.go('/workflows');
};
