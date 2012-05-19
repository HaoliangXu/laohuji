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
    bigLamps: [0, 1, 6, 7, 12, 13, 16, 18, 19],
    largeLamps: [2, 4],
    supLamps: [3, 9, 15, 21],
    sups: ['khc', 'ktc', 'kdk', 'kld', 'kcb', 'kkd', 'ksh', 'kmh'],
  },
  rates: {
    debug: {
      lamps: [10, 10, 50, 40, 25, 5, 10, 20, 2, 40, 5, 2, 10, 10, 2, 40, 20, 2, 10, 20, 2, 40 ,5, 2],//multiples for generator diff from the gamePane
      starting: [
        0.8,//0.9 rates for small points, elses for big
        0.1,//0.1 rates for xmbs
      ],
      big: [
        0.7,//for 10 to 20 points, 0.8
        0.1,//for 25 to 50 points, 0.1
        0.2,//for sups, 0.1
      ],
      colors: [0,5,5,5,1],//should be [0,5,5,5,1] for real game
    },
    local: {},
  },
  create: function() {
    this.inherited(arguments);
    this.changeRates();
  },

  //using rates, suppose to be 0 <= rates <= 1
  //return true when result > rate
  randomRates: function(rate) {
    return Math.random() < rate;
  },

  //for same weight choice
  //seed supposed to be any integer greater than 0
  //result should in [0, seeds)
  randomSeed: function(seed) {
    return parseInt((Math.random() * seed));
  },

  normalDistribution: function(high) {
    return parseInt((Math.random() + Math.random())  / 2 * high);
  },

  //for rates that diff in weights
  //like color: {10,10,10,13} means 13/43 rates for last color
  weightRandom: function(rates) {
    var i;
    var cumulate = 0;
    for (i in rates) {
      cumulate += rates[i];
    }
    var result = this.randomSeed(cumulate);
    for (i = 0; i < rates.length; i ++) {
      if ((result -= rates[i]) < 0) {
        return i;
      }
    }
  },

  reciprocal: function(rates) {//0 is NOT allowed
    var i;
    var cumulate = 0;
    for (i in rates) {
      cumulate += 1 / rates[i];
    }
    var result = Math.random() * cumulate;
    for (i = 0; i < rates.length; i ++) {
      if ((result -= 1 / rates[i]) < 0) {
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
  
  //test rates
  test: function() {
    var a = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for (var i = 0; i < 1000000; i ++) {
      a[this.reciprocal(this.rates.multiples)] ++;
    }
    var r = 0;
    for (i = 0; i < 24; i ++) {
      r += a[i];
    }
    for (i = 0; i < 24; i ++) {
      a[i] /= r;
    }
    this.log(a);
  },

  //generate a round then return
  round: function() {
    var data = {};
    data.name = 'starting';
    data.color = this.weightRandom(this.rates.colors);
    data.target = this.reciprocal(this.rates.lamps);
    //this.test();
    if (this.fact.supLamps.indexOf(data.target) === -1) {//if small
      if (this.randomRates(this.rates.starting[1])) {//if xmbs
        data.next = this.xmbs(data.target, data.color, 0.3);
      } else {
        data.next = this.ending();
      }
      this.doGenerated(data);
      return;
    }
    /*
    //if big( 10 ,20 points lamp)
    if (data.target in this.fact.bigLamps) {//if big
      data.target = this.fact.bigLamps[this.randomSeed(9)];
      if (this.randomRates(this.rates.starting[1])) {//if xmbs
        data.next = this.xmbs(data.target, data.color, 0.1);
      } else {
        data.next = this.ending();
      }
      this.doGenerated(data);
      return;
    }
    //if large(25 or 50 points lamp)
    if (this.randomRates(this.rates.big[1] / (1 - this.rates.big[0]))) {
      data.target = this.fact.largeLamps[this.randomSeed(2)];
      data.next = this.ending();
      this.doGenerated(data);
      return;
    }
    */
    //TODO sups 
    data.target = this.fact.supLamps[this.randomSeed(4)];
    data.next = this.khc(data.target, data.color);
    this.doGenerated(data);
  },

  khc: function(originalTarget, color) {
    var o = {name: 'khc'};
    o.len = this.randomSeed(12) + 1;
    o.color = color;
    o.originalTarget = originalTarget;
    o.target = this.randomSeed(24);
    o.next = this.ending();
    return o;
  },

  xmbs: function(originalTarget, color, xmbsRate) {
    var o = {name: 'xmbs'};
    o.multiple = this.randomSeed(20) + 5;
    o.target = originalTarget;
    o.color = color;
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
