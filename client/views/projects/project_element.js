Template.project_element.events({
  'click button.update-item': function (e) {
    var id = e.currentTarget.dataset.itemId;
    var piece = Pieces.findOne(id);

    Router.go('edit_piece', {
      id: id,
      projectId: piece.projectID,
      element: piece.projectElementID
    });
  },
  'click button.remove-item': function (e) {
    var id = e.currentTarget.dataset.itemId;
    Pieces.remove(id);
  },
});
