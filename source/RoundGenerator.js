/****
 * generate any round data of the game
 * deep array
 */
enyo.kind({
  name: 'dili.RoundGenerator',
  kind: 'Component',
  rates: {
    debug: [
    ],
    local: [
    ],
  },
  create: function() {
    this.inherited(arguments);
    this.changeRates();
  },

  changeRates: function() {
    if (window.dili.prefs.DEBUG === true) {
      this.rates = this.rates.debug;
    } else {
      this.rates = this.rates.local;
    }
  },
  
  //generate a round then return
  round: function() {
    return 100;
  },
});
