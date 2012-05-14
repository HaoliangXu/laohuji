/****
 * generate any round data of the game
 * deep objects
 * ex1. {name: 'run', target: 10,
 *        next: {name: 'xmbs', multiple: 10,
 *          next: {name: 'ending'},
 *        },
 *      }
 * ex2. {name: 'run', taget: 3,
 *        next: {name: 'sups',
 *          next: {name: 'khc', target: 6, length: 8,
 *            next: {name: 'ending'},
 *          },
 *        },
 *      }
 */
enyo.kind({
  name: 'dili.RoundGenerator',
  kind: 'Component',
  events: {
    onGenerated: '',
  },
  fact: {
    lampsProp: [
      [10, 6],
      [10, 4],
      [50, 0],
      [0, -1],
      [25, 0],
      [5, 7],
      [10, 5],
      [20, 3],
      [2, 3],
      [0, -1],
      [5, 7],
      [2, 6],
      [10, 6],
      [10, 4],
      [2, 1],
      [0, -1],
      [20, 1],
      [2, 5],
      [10, 5],
      [20, 2],
      [2, 2],
      [0, -1],
      [5, 7],
      [2, 4],
    ],
    multiples: [10, 10, 50, 0, 25, 5, 10, 20, 2, 0, 5, 2, 10, 10, 2, 0, 20, 2, 10, 20, 2, 0 ,5, 2],
    betMap: [
      [2,4],
      [14, 16],
      [19, 20],
      [7, 8],
      [1, 13, 23],
      [6, 17, 18],
      [0, 11, 12],
      [5, 10, 22],
    ],
    smallLamps: [5, 8, 10, 11, 14, 17, 20, 22, 23],
    bigLamps: [0, 1, 2, 6, 7, 12, 13, 16, 18, 19],
    supLamps: [3, 9, 15, 21],
    sups: ['khc', 'ktc', 'kdk', 'kld', 'kcb', 'kkd', 'ksh', 'kmh'],
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
      color: [4,4,4,1],
    },
    local: {},
  },
  create: function() {
    this.inherited(arguments);
    this.changeRates();
  },

  //using rates, suppose to be 0 <= rates <= 1
  //return true when result > rates
  randomRates: function(rates) {
    return Math.random() < rates;
  },

  //for same weight choice
  //seed supposed to be any integer
  randomOne: function(seeds) {
    return parseInt((Math.random() * seeds));
  },
  randomSeed: function(seed) {//for same weight choice
    return parseInt((Math.random() * seed));
  },

  //for rates that diff in weights
  //like color: {10,10,10,13} means 13/43 rates for last color
  weightRandom: function(rates) {
    var i;
    var cumulate = 0;
    var result = this.randomSeed(rates.length);
    for (i = 0; i < rates.length; i ++) {
      cumulate += rates[i];
      if (result < cumulate) {
        return i;
      }
    }
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
    data.name = 'starting';
    data.color = this.weightRandom(this.rates.color);
    if (this.randomRates(this.rates.starting[0])) {//if small
      data.target = this.fact.smallLamps[this.randomOne(9)];
      if (this.randomRates(this.rates.starting[1])) {//if xmbs
        data.next = this.xmbs(data.target, data.color);
      } else {
        data.next = this.ending();
      }
      this.doGenerated(data);
      return;
    }
    //if big( 10 ,20 points lamp)
    if (this.randomRates(this.rates.big[0])) {//if big
      data.target = this.fact.bigLamps[this.randomOne(9)];
      if (this.randomRates(this.rates.starting[1])) {//if xmbs
        data.next = this.xmbs(data.target, data.color);
      } else {
        data.next = this.ending();
      }
      this.doGenerated(data);
      return;
    }
    //if large(25 or 50 points lamp)
    if (this.randomRates(this.rates.big[1] / (1 - this.rates.big[0]))) {
      data.starting = 18 + this.randomOne(2);
      this.doGenerated(data);
      return;
    }
    //TODO sups 
  },

  xmbs: function(originalTarget, color, xmbsRate) {
    var o = {name: 'xmbs'};
    o.multiple = this.randomSeed(20);
    if (this.randomRates(xmbsRate)) {
      o.next = this.xmbs(originalTarget, color, xmbsRate);
    } else {
      o.next = this.ending();
    }
    return o;
  },

  ending: function() {
    return {name: 'ending'};
  }
});
