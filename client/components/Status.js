Status = {
  saving: function() {
    Session.set('sAlert', {
      condition: 'yellow',
      message: "Saving...",
      timeout: 1500,
      effect: 'stackslide',
      position: 'let-bottom',
    });
  },
  complete: function() {
    Session.set('sAlert', {
      condition: 'green',
      message: "Complete!",
      timeout: 1500,
      effect: 'stackslide',
      position: 'let-bottom',
    });
  },
  error: function(err) {
    Session.set('sAlert', {
      condition: 'red',
      message: "Error: " + err.reason,
      timeout: 'no',
      effect: 'stackslide',
      position: 'let-bottom',
    });
  },
  message: function(message) {
    Session.set('sAlert', {
      condition: 'blue',
      message: message,
      timeout: 'no',
      effect: 'stackslide',
      position: 'let-bottom',
    });
  },
};
