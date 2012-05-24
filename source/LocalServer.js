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
  name: 'dili.LocalServer',
  kind: 'Component',
  events: {
    onSendData: '',
    onGotErr: '',
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
    sups: ['khc', 'kdk', 'ktc', 'kld', 'kcb', 'kkd', 'ksh', 'kmh'],
  },
  rates: {
    debug: {
      lamps: [10, 10, 50, 30, 25, 5, 10, 20, 2, 30, 5, 2, 10, 10, 2, 30, 20, 2, 10, 20, 2, 30 ,5, 2],//multiples for generator diff from the gamePane
      starting: [
        0.1,//0.8 rates for small points, elses for sup
        0.1,//0.1 rates for xmbs
        0.2,//0.2xmbs again
        0.05,//0.1 for extra run
        0.05,//0.1 for khc
      ],
      colors: [0,5,5,5,1],//should be [0,5,5,5,1] for real game
    },
    local: {},
  },
  weight:[],
  create: function() {
    this.inherited(arguments);
    this.changeRates();
  },

  receiveData: function(data) {
    switch (data.type) {
      case 'readProp':
        delete data.type;
        this.readProp();
        break;
      case 'saveProp':
        delete data.type;
        this.saveProp(data);
        break;
      case 'fetchRoundData':
        delete data.type;
        this.round(data.weight);
        break;
      default:
        delete data.type;
        this.doGotErr();
    }
  },
  sendData: function(data) {
    this.doSendData(data);
  },
  //reader users prop, like a server
  readProp: function() {
    var data = {};
    if (localStorage.getItem('bonus') === null) {
      localStorage.setItem('bonus', 0);
      localStorage.setItem('points', 0);
      localStorage.setItem('coins', 100);
    }
    data.bonus = localStorage.getItem('bonus');
    data.points = localStorage.getItem('points');
    data.coins = localStorage.getItem('coins');
    data.type = 'gotProp';
    this.sendData(data);
  },

  saveProp: function(data) {
    //TODO handle err when not saved
    //should check data here
    var i;
    for (i in data) {
      localStorage.setItem(i, data[i]);
    }
    data.type = 'propSaved';
    this.sendData(data);
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
  round: function(weight) {
    var data = {};
    this.weight = weight.slice(0);//one level deep copy for safe
    this.starting(data, this.rates.starting[3]);
    data.type = 'gotRoundData';
    this.sendData(data);
  },

  starting: function(data, againRate) {
    data.name = 'starting';
    data.next = {};
    data.color = this.weightRandom(this.rates.colors);
    data.target = this.reciprocal(this.rates.lamps);
    //data.target = 3;//test
    if (this.fact.supLamps.indexOf(data.target) === -1) {//if not sup
      if (this.randomRates(this.rates.starting[1])) {//if xmbs
        this.xmbs(data.next, data.target, data.color, this.rates.starting[2]);
      } else if (this.randomRates(this.rates.starting[4])) {
        this.khc(data.next, data.target, data.color);
      } else if (this.randomRates(againRate /= 10)) {//extra run
        this.starting(data.next);
      } else {
        this.ending(data.next);
      }
      return;
    }
    //if sups 
    this.suprise(data.next, data.target, data.color);
  },

  suprise: function(data, originalTarget, color){
    data.name = 'suprise';
    data.target = this.randomSeed(2); //TODO for test
    data.next = {};
    data.originalTarget = originalTarget;
    data.color = color;
    this[this.fact.sups[data.target]](data.next, originalTarget, color);
  },

  khc: function(data, originalTarget, color) {
    data.name = 'khc';
    data.next = {};
    data.len = this.randomSeed(12) + 1;
    data.color = color;
    data.originalTarget = originalTarget;
    data.target = this.randomSeed(24);
    this.ending(data.next);
  },

  kdk: function(data, originalTarget, color) {
    var i;
    data.name = 'kdk',
    data.next = {};
    data.colorLine = [color];
    for (i = 1; i < 24; i ++) {
      data.colorLine[i] = this.randomSeed(4) + 1;
    }
    data.color = color;
    data.originalTarget = originalTarget;
    this.ending(data.next);
  },

  xmbs: function(data, originalTarget, color, xmbsRate) {
    data.name = 'xmbs';
    data.next = {};
    data.multiple = this.randomSeed(20) + 5;
    data.target = originalTarget;
    data.originalTarget = originalTarget;
    data.color = color;
    if (this.randomRates(xmbsRate)) {
      this.xmbs(data.next, originalTarget, color, xmbsRate);
    } else {
      this.ending(data.next);
    }
  },

  ending: function(data) {
    data.name = 'ending';
  }
});
