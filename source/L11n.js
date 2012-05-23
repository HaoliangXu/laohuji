enyo.kind({
  name: 'dili.L11n',
  kind: enyo.Component,
  published: {
    lang: '',//recieved lang settings
  },
  constructor: function() {
    this.inherited( arguments );
  },
  en: {
    "Slot Machine": 'Slot Machine',
  },
  zh: {
    "Slot Machine": '老虎机',
  },
  act: {
    'xmbs': {
    },
    'khc': {
    },
    'kdk': {
    },
    'run': {
      start: 'LOCK & ROLL',
      extra: 'Extra Run',
    },
    'end': {
      lose: '',
      win: '',
    },
  },
  status: {
  },
  
  //* @public
  //method to translate any word which is going to be shown
  l: function( inValue, inLang ) {
    inLang = inLang ? inLang : this.lang;
    return this[inLang][inValue];
  },

  //for narrator msg
  //act for different actions, differents status in actions
  //return a msg
  n: function (act, status) {
  },
});
