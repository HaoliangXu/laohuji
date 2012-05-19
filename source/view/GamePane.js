/****
 * this is the game pane kind
 * shows all visual part of the game
 */
enyo.kind({
  name: 'dili.GamePane',
  kind: 'Control',
  classes: 'gamePane',
  lampStatusArray: [],//record the current status of main lamps
  pointer: {lamp: 3, color: 1},//lamp number and color number
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
    colorMultiples: [0, 2, 2, 2, 10],
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

  weight: [],
  events: {
    onShowFinished:'',
    onAddBonus: '',
  },
  components: [
    {name: 'supPane', classes: 'supPane', components:[
    ]},
    {name: 'jpLamp', classes: 'jpLamp', content: '00'},
    {name: 'emulator', kind: 'dili.Emulator'},
  ],
  create: function() {
    this.inherited(arguments);

    //generate all lamps
    var i, oi;
    var o = [];
    for (i = 0; i < 24; i ++) {
      this.lampStatusArray[i] = -1;//initial lampStatusArray btw
      oi = {name: 'lamp' + i, classes: 'lamp l' + i};
      o.push(oi);
    }
    this.createComponents(o);
    o = [];
    for (i = 0; i < 8; i ++) {
      oi = {name: 'supLamp' + i, classes: 'supLamp sl' + i};
      o.push(oi);
    }
    this.$.supPane.createComponents(o, {owner: this});

    this.setLamps([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
  },
  Lamp : function(inLamp, inColor) {
    this.lamp = inLamp;
    this.color = inColor;
    this.setColor = function(inColor) {
      this.color = inColor;
    };
  },

  //set main lamps, depend on the inArray
  //the basic controller
  //all other controller call this
  setLamps: function(inArray) {
    var i, temp;
    for (i = 0; i < 24; i ++) {
      temp = this.lampStatusArray[i];
      if (temp != inArray[i]) {
        this.setLamp(i, inArray[i], temp);
      }
    }
  },

  //set a lamp, only called by this.setLamps
  setLamp: function(i, inStatus, inOldStatus) {
    var temp = this.$['lamp' + i];
    temp.addClass('color' + inStatus);
    temp.removeClass('color' + inOldStatus);
    this.lampStatusArray[i] = inStatus;
  },

  start: function(roundData) {
    this.log(roundData);
    this.weight = roundData.weight;
    //delete roundData.weight;// not nessesary
    this.launchProcessor(roundData);
  },

  launchProcessor: function(roundData) {
    if (!roundData.name) {
      this.error('roundData error');
      return false;
    }

    this[roundData.name](roundData);
  },

  //generate random number, same rates
  //result:  0 <= result < num 
  randomSeed: function(num) {
    return parseInt(Math.random() * num, 10);
  },

  //these are processors
  starting: function(roundData) {
    //bonus calc
    var bonus = 0;
    var multiple = this.fact.lampsProp[roundData.target][0];
    var weight = this.weight[this.fact.lampsProp[roundData.target][1]];
    var colorMultiple = this.fact.colorMultiples[roundData.color];
    var colorWeight = this.weight[roundData.color + 7];
    if (weight) {
      bonus += multiple * weight;
    }
    bonus += colorMultiple * colorWeight;
    bonus = {bonus: bonus};

    var i, move, distance, bonus;
    var time = 0;
    this.$.emulator.init(this.pointer.lamp, this.pointer.color);
    this.setLamps(this.$.emulator.getLampsArray());
    var jpNum = this.jpNum.bind(this);
    move = function(color) {
      this.$.emulator.changeLampColor(0, color);
      this.$.emulator.move();
      this.setLamps(this.$.emulator.getLampsArray());
    }.bind(this);
    i = 95 - this.pointer.lamp + roundData.target;
    while (i --) {
      time += 50;
      //this.log((roundData.target - i + 96)%24);
      setTimeout(jpNum, time, this.fact.multiples[(roundData.target - i + 96)%24]);
      setTimeout(move, time, this.randomSeed(4) + 1);
    }
    time += 50;
    setTimeout(move, time, roundData.color);
    time += 100;
    setTimeout((function(){
      var data = {target: roundData.target, color: roundData.color};
      this.doAddBonus(bonus);
      this.launchProcessor(roundData.next);
    }).bind(this), time);
    this.pointer.lamp = roundData.target;
    this.pointer.color = roundData.color;
  },

  jpNum: function(num) {
    if (num < 10) num = '0' + num;
    this.$.jpLamp.setContent(num);
  },

  xmbs: function(roundData) {
    //bonus calc
    var bonus = 0;
    var weight = this.weight[this.fact.lampsProp[roundData.target][1]];
    if (weight) {
      bonus += roundData.multiple * weight;
    }
    bonus = {bonus: bonus};

    var i = 23;
    var time = 200;
    var jpNum = this.jpNum.bind(this);
    var flashIn = function() {
      this.$.emulator.prependLamp(roundData.color);
      this.setLamps(this.$.emulator.getLampsArray());
    }.bind(this);
    var flashOut = function() {
      this.$.emulator.removeLamp(0, 1);
      this.setLamps(this.$.emulator.getLampsArray());
    }.bind(this);
    while (i --) {
      setTimeout(flashIn, time += 50);
    }
    time += 400;
    i = 23;
    while (i --) {
      setTimeout(flashOut, time += 50);
    }
    time += 800;
    i = 22;
    while (i --) {
      setTimeout(jpNum, time, this.randomSeed(30));
      setTimeout(flashOut, time += 40);
      setTimeout(flashIn, time += 40);
    }
      setTimeout(jpNum, time, roundData.multiple);
    setTimeout((function(){
      this.launchProcessor(roundData.next);
      this.doAddBonus(bonus);
    }).bind(this), time + 100);
  },

  khc: function(roundData) {
    var expand = function() {
      this.$.emulator.prependLamp(roundData.color);
      this.setLamps(this.$.emulator.getLampsArray());
    }.bind(this);
    var move = function() {
      this.$.emulator.move();
      this.setLamps(this.$.emulator.getLampsArray());
    }.bind(this);
    var turnOff = function() {
      this.$.emulator.changeLampColor(j, 0);
      this.setLamps(this.$.emulator.getLampsArray());
    }.bind(this);
    var turnOn = function() {
      //add bonus every lamp
      var bonus = 0;
      var currentTarget = (roundData.target - (len - j) + 24) % 24;
      var multiple = this.fact.lampsProp[currentTarget][0];
      var weight = this.weight[this.fact.lampsProp[currentTarget][1]];
      if (weight) {
        bonus += multiple * weight;
      }
      bonus = {bonus: bonus};
      this.doAddBonus(bonus);

      this.$.emulator.changeLampColor(j, roundData.color);
      this.setLamps(this.$.emulator.getLampsArray());
      j -- 
    }.bind(this);
    var i, j;
    var time = 500;
    var len = roundData.len - 1;//plus the original target
    i = len;
    while (i --) {
      setTimeout(expand, time += 700);
    }
    time += 1000;
    i = 96 - len - this.pointer.lamp + roundData.target;
    while (i --) {
      setTimeout(move, time += 100);
    }
    time += 1000;
    i = roundData.len;
    j = len;
    while (i --) {
      setTimeout(turnOff, time += 700);
      setTimeout(turnOn, time += 300);
    }
    setTimeout((function(){
      this.launchProcessor(roundData.next);
    }).bind(this), time + 100);
  },
  ending: function() {
    this.doShowFinished();
  },
});
