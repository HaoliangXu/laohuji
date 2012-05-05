module( 'tests for prefs', {
  setup: function() {
    prefs = new dili.Prefs();
  },
  teardown: function() {
    //delete prefs;
  }
});

test( 'prefs', function() {
  equal( typeof(prefs), 'object', 'we expect this.prefs to be an enyo object');
});
test( 'this.prefs.DEBUG should be a boolean variable', function() {
  equal( typeof(prefs.DEBUG), 'boolean');
});
test( 'this.prefs.REMOTE should be a boolean variable' ,function() {
  equal( typeof(prefs.REMOTE), 'boolean');
});


module( 'l11n', {
  setup: function() {
  },
  teardown: function() {
  }
});

