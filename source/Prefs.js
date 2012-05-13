enyo.kind({
  name: 'dili.Prefs',
  kind: enyo.Component,
  published: {
    LANGUAGE: '',//language of the system
    DEBUG: true,//debug mode or no, diff actions in whole app for diff mode
    REMOTE: false,//data source, data from remote server or local generator
    CARD: {},//window size
    SUPPORT: {},//browser of device supported features, e.g., sound
    COINTOPOINTRATE: 100,
    settings: {//all user changeable settings here
      soundOn: false,//soundOn or off
      theme: 'debug'//the theme for the game
    },
  },

  //all initial works, determine all published data
  constructor: function() {
    this.inherited( arguments );
    this.detectCardSize();
    this.detectSupport();
    this.setupMethods();
    this.detectLanguage();
  },

  //set different behaviors depends on diff status in prefs
  setupMethods: function() {
    if ( this.DEBUG === true ) {
      this.saveSettings = this.saveSettings.debug;
    } else {
      if ( this.REMOTE === false ) {
        this.saveSettings = this.saveSettings.local;
      } else {
        this.saveSettings = this.saveSettingsRemote;
      }
    }
  },

  //detect language
  detectLanguage: function() {
    var lang = window.navigator.language;
    lang = lang.substr(0,2);
    this.LANGUAGE = lang;
  },

  //detect which features the device support
  detectSupport: function() {
    //TODO really detection needed
    this.SUPPORT.sound = false;
    this.settings.soundOn = false;
  },

  //
  //* @public

  //for change settings
  changeSetting: function( inKey, inValue ) {//both must be string
    this.settings[inKey] = inValue;
  },

  //for detect window size
  detectCardSize: function() {
    var myWidth = 0, myHeight = 0;
    if( typeof( window.innerWidth ) == 'number' ) {
      //Non-IE
      myWidth = window.innerWidth;
      myHeight = window.innerHeight;
    } else if ( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
      //IE 6+ in 'standards compliant mode'
      myWidth = document.documentElement.clientWidth;
      myHeight = document.documentElement.clientHeight;
    } else if ( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
      //IE 4 compatible
      myWidth = document.body.clientWidth;
      myHeight = document.body.clientHeight;
    } else {
      //failed to detect
      this.error("can not detect window size");
    }
    this.CARD.width = myWidth;
    this.CARD.height = myHeight;
  },

  //save all settings, refer to this.REMOTE, save them in server or locally
  saveSettings: {//this will replaced by its child in constructor
    debug: function() {
    },
    local: function() {
    },
    remote: function() {
    },
  },
});
