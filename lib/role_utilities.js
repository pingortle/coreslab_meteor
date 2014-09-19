roleArray = function(userId) {
  return Roles.getRolesForUser(userId) || [];
};

isSuper = function (userId) {
  return userId && Roles.userIsInRole(userId, ['super']);
};
