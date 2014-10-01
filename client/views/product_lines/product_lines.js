Template.product_lines.events({
  'click button.update-item': function (e) {
    var id = e.currentTarget.dataset.itemId;
    Router.go('edit_product_line', {id: id});
  },
  'click button.remove-item': function (e) {
    var id = e.currentTarget.dataset.itemId;
    ProductLines.remove(id);
  },
});
