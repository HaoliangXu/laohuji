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
    "Slot Machine": 'Slot Machie',
  },
  zh: {
    "Slot Machine": '老虎机',
  },
  
  //* @public
  //method to translate any word which is going to be shown
  l: function( inValue, inLang ) {
    inLang = inLang ? inLang : this.lang;
    return this[inLang][inValue];
  },
});
