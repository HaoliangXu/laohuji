module( 'tests for prefs', {
  setup: function() {
    this.prefs = new dili.Prefs();
  },
  teardown: function() {
    delete this.prefs;
  }
});

test( 'this.prefs', function() {
  equal( typeof(this.prefs), 'object', 'we expect this.prefs to be an enyo object');
});
test( 'this.prefs.DEBUG should be a boolean variable', function() {
  equal( typeof(this.prefs.DEBUG), 'boolean');
});
test( 'this.prefs.REMOTE should be a boolean variable' ,function() {
  equal( typeof(this.prefs.REMOTE), 'boolean');
});
test( 'prefs.LANGUAGE', function() {
  equal( typeof(this.prefs.LANGUAGE), 'string', 'should be a string');
  ok( this.prefs.LANGUAGE === 'en' || this.prefs.LANGUAGE === 'zh', 'validation value');
});
test( 'this.prefs.CARD', function() {
  equal( typeof(this.prefs.CARD), 'object', 'should be an array');
  equal( typeof(this.prefs.CARD.width), 'number', 'width property');
  ok( this.prefs.CARD.width > 100, 'width property valid');
  equal( typeof(this.prefs.CARD.height), 'number', 'height property');
  ok( this.prefs.CARD.height > 100, 'height property valid');
});
test( 'this.prefs.support', function() {
  equal( typeof(this.prefs.SUPPORT), 'object', 'should be an object');
  equal( typeof(this.prefs.SUPPORT.sound), 'boolean', 'should be a boolean');
});
test( 'prefs.settings', function() {
  equal( typeof(this.prefs.settings), 'object', 'should be an object');
  equal( typeof(this.prefs.settings.soundOn), 'boolean', 'should be a boolean');
  equal( typeof(this.prefs.settings.theme), 'string', 'should be a string');
});
test( 'prefs.changeSetting', function() {
  equal( typeof(this.prefs.changeSetting), 'function', 'should be a function');
  this.prefs.changeSetting('theme', 'fuck');
  equal( this.prefs.settings.theme, 'fuck', 'theme should be "fuck"');
});
test( 'prefs.saveSettings', function() {
  equal( typeof(this.prefs.saveSettings), 'function', 'should be a function');
});


module( 'l11n', {
  setup: function() {
    this.l11n = new dili.L11n();
  },
  teardown: function() {
    delete this.l11n;
  }
});
test( 'this.l11n should works', function() {
  equal( typeof(this.l11n), 'object', 'should be an object');
  equal( this.l11n.l( 'Slot Machine', 'zh' ), '老虎机', 'should be "老虎机"')
});


module( 'slotMachineApp', {
  setup: function() {
    this.slotMachineApp = new dili.SlotMachineApp();
  },
  teardown: function() {
    delete this.slotMachineApp;
  }
});
test( 'this.slotMachineApp should work', function() {
  equal( typeof(this.slotMachineApp), 'object', 'should be an object');
});
test( 'this.slotMachineApp should include components', function() {
  equal( typeof(this.slotMachineApp.$.slotMachine), 'object', 'should have slotMachine');
  equal( typeof(this.slotMachineApp.$.login), 'object', 'should have login');
  equal( typeof(this.slotMachineApp.$.fetcher), 'object', 'should have fetcher');
});
test( 'should have a startLogin function', function() {
  equal( typeof(this.slotMachineApp.startLogin), 'function');
});
test( 'should have a authorized function', function() {
  equal( typeof(this.slotMachineApp.authorized), 'function');
});

module( 'fetcher', {
  setup: function() {
    window.dili.prefs = new dili.Prefs();
    this.fetcher = new dili.Fetcher();
  },
  teardown: function() {
    delete window.dili.prefs;
    delete this.fetcher;
  },
});
test( 'should be an object', function() {
  equal( typeof(this.fetcher), 'object' )
});
