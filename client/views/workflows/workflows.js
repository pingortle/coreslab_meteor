Template.workflows_listing.events({
  'click button.update-item': function (e) {
    var id = e.currentTarget.dataset.itemId;
    Router.go('edit_workflow', {id: id});
  },
});
