Template.beds.events({
  'click button.update-item': function (e) {
    var id = e.currentTarget.dataset.itemId;
    Router.go('edit_bed', {id: id});
  },
});
