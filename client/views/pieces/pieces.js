Template.pieces.events({
  'click button.update-item': function (e) {
    var id = e.currentTarget.dataset.itemId;
    var piece = Pieces.findOne(id);

    Router.go('edit_piece', {
      id: id,
      projectId: piece.projectID,
      element: piece.projectElementID
    });
  },
});
