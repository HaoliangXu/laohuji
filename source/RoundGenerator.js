/****
 * generate any round data of the game
 * deep array
 */
enyo.kind({
  name: 'dili.RoundGenerator',
  kind: 'Component',
  events: {
    onGenerated: '',
  },
  rates: {
    debug: {
      starting: [
        0.8,//0.8 rates for small points, elses for big
        0.2,//0.2 rates for xmbs
      ],
      big: [
        0.8,//for 10 to 20 points
        0.2,//for 25 to 50 points, else for sups, now 0 for sups for debug
      ],
      sups: [
      ],
    },
    local: {},
  },
  create: function() {
    this.inherited(arguments);
    this.changeRates();
  },
  randomRates: function(rates) {//using rates
    return Math.random() < rates;
  },
  randomOne: function(seeds) {//for same weight choice
    return parseInt((Math.random() * seeds));
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
    var data = {};
    if (this.randomRates(this.rates.starting[0])) {//if small
      data.starting = this.randomOne(9);//0,1,2,3 etc for smalls
      data.xmbs = [];
      while(this.randomRates(this.rates.starting[1])) {//if xmbs recurs
        data.xmbs.push(this.randomOne(25) + 5);
      }
      this.doGenerated(data);
      return;
    }
    //if not small
    if (this.randomRates(this.rates.big[0])) {//if big
      data.starting = 9 + this.randomOne(9);//9 , 10 ,11 ,etc, for bigs
      data.xmbs = [];
      while(this.randomRates(this.rates.starting[1])) {//if xmbs recurs
        data.xmbs.push(this.randomOne(25) + 5);
      }
      this.doGenerated(data);
      return;
    }
    if (this.randomRates(this.rates.big[1] / (1 - this.rates.big[0]))) {
      data.starting = 18 + this.randomOne(2);
      this.doGenerated(data);
      return;
    }
  },
});
