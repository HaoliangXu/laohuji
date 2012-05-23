/****
 * main js, include header footer and main view and login popup
 *
 */
enyo.kind({
  name: 'dili.SlotMachineApp',
  kind: 'Control',
  classes: 'enyo-unselectable app',
  components: [
    {
      name: 'slotMachine',
      kind: 'dili.SlotMachine',
    },
    {
      name: 'login',
      kind: 'dili.Login',
      onAuthorized: 'authorized',
    },
  ],
  constructor: function() {
    this.inherited(arguments);
    window.dili.l11n = new dili.L11n();
    window.dili.prefs = new dili.Prefs();
  },
  create: function() {
    this.inherited(arguments);
    this.setupMethods();
    this.startLogin();
  },

  //setup Methods, depends on prefs, different behavior
  setupMethods: function() {
    if (window.dili.prefs.DEBUG === true) {
      this.startLogin = this.startLogin.debug;
    } else {
      if (window.dili.prefs.REMOTE === true) {
        this.startLogin = this.startLogin.remote;
      } else {
        this.startLogin = this.startLogin.local;
      }
    }
  },

  //when log in successful, trigger this, set user profiles get into the game
  authorized: function(id) {
    this.$.slotMachine.initial(id);
  },

//* @public

  //login methods in an object, will be replaces by its child by setupMethods
  startLogin: {
    local: function() {
    },
    remote: function() {
    },
    debug: function() {
      //authorized directly
      this.authorized('guest');
    },
  },
});
