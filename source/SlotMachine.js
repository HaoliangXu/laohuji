/****
 * this is the main game view kind
 * include game pane, status pane and a control pane
 */
enyo.kind({
  name: 'dili.SlotMachine',
  kind: 'Control',
  classes: 'slotMachine',
  published: {
    //game status, waiting, running, fetching
    gameStatus: "waiting",
    //users properties, bonus points coins
    //every change shows on statusPane
    prop: {
      bonus: 0,
      points: 0,
      coins: 0,
    },

    //help to show last bets before rebet
    //good for rebet same points
    alreadyBet: false,

    weight: [0,0,0,0,0,0,0,0,0,0,0,0],//how much all items user bet
  },
  components: [
    {
      name: 'gamePane',
      kind: 'dili.GamePane',
      onShowFinished: 'handleShowFinish',
      onAddBonus: 'handleAddBonus',
      onRequestNarrator: 'handleNarratorRequest',
      onRequestSound: 'handleSoundRequest',
    },
    {
      name: 'statusPane',
      kind: 'dili.StatusPane',
      onEasterEgg: 'triggerEasterEgg'
    },
    {
      name: 'controlPane',
      kind: 'dili.ControlPane',
      onButtonClicked: 'handleButtonClick'
    },
    {
      name: 'fetcher',
      kind: 'dili.Fetcher',
      onGotProp: 'handleGotProp',
      onGotRoundData: 'handleRoundData',
      onGotErr: 'handleGotErr',
    },
    {
      name: 'narrator',
    },
    {
      name: 'soundController',
      kind: 'dili.SoundController',
    },
  ],
  create: function() {
    this.inherited(arguments);
    this.setupMethod();
    //initial weight
  },

  //setup method,
  setupMethod: function() {
    if (window.dili.prefs.DEBUG === true) {
      this.initial = this.initial.debug;
    } else {
      if (window.dili.prefs.REMOTE === true) {
      } else {
      }
    }
  },

  //initial works, set username, fetch starting data
  initial: {
    debug: function(id) {
      var data = {};
      this.$.fetcher.setUsername(id);
      this.gameStatus = 'fetching';
      this.$.fetcher.readProp();
      //TODO better event in newest Enyo
      this.handleKeyPress();
      window.addEventListener("keypress", this.handleKeyPress.bind(this));
    }
  },

  //handle data
  handleGotProp: function(inSender, data) {
    var i;
    this.gameStatus = 'waiting';
    for (i in data) {
      data[i] = parseInt(data[i], 10);
    }
    this.setProp(data);
  },
  propChanged: function() {
    this.$.statusPane.setProp(this.prop);
  },

  //handle round data
  handleRoundData: function(inSender, roundData) {
    roundData.weight = this.weight;
    this.alreadyBet = false;
    this.gameStatus = 'running';
    this.$.gamePane.start(roundData);
  },
  handleButtonClick: function(inSender, inEvent){
    if (this.gameStatus != 'waiting') return;
    var index = inEvent.index;
    var i;
    var pointsNeeded = 0;
    var prop = {points: this.prop.points, bonus: this.prop.bonus, coins: this.prop.coins};
    //if bonus are not cleaned, clean it
    if (prop.bonus > 0) {
      prop.points += prop.bonus;
      prop.bonus = 0;
      this.setProp(prop);
      return;
    }

    //start button clicked
    if (index == 0) {
      //did user bet? if yes, start game
      if (this.alreadyBet) {
        inSender.disableAll(true);
        this.gameStatus = 'fetching';
        //TODO need to save weight and prop here for data accuracy
        this.$.fetcher.fetchRoundData(this.weight);
        return;
      }

      //now, no bet, see if possible to bet as last round
      for (i = 0; i < 12; i ++) {
        pointsNeeded += this.weight[i];
      }
      if (pointsNeeded > 0 && prop.points >= pointsNeeded) {//if enough points
        //change controlpane to show last bet
        prop.points -= pointsNeeded;
        this.setProp(prop);
        for (i = 0; i < 12; i ++) {
          inSender.setValue(i + 4, this.weight[i]);
        }
        //then start game
        inSender.disableAll(true);
        this.gameStatus = 'fetching';
        this.$.fetcher.fetchRoundData(this.weight);
      }
      //not enough points, fail to start
      return;
    } 
    //insert button clicked
    if (index == 1) {
      if (prop.coins) {
        prop.points += window.dili.prefs.COINTOPOINTRATE;
        prop.coins --;
        this.setProp(prop);
      }
      return;
    }
    //outsert button
    if (index == 2) {
      if (prop.points >= window.dili.prefs.COINTOPOINTRATE) {
        prop.points -= window.dili.prefs.COINTOPOINTRATE;
        prop.coins ++;
        this.setProp(prop);
      }
      return;
    }
    //items clicked
    if (4 <= index && index <= 11) {
      if (!this.alreadyBet) {
        this.weight = [0,0,0,0,0,0,0,0,0,0,0,0];
        this.alreadyBet = true;
      }
      if (prop.points > 0 && this.weight[index - 4] < 99) {
        this.$.soundController.playASound('click');
        this.weight[index - 4] ++;
        inSender.setValue(index, this.weight[index - 4]);
        prop.points --;
        this.setProp(prop);
      }
      return;
    }
    //color clicked
    if (12 <= index) {
      if (!this.alreadyBet) {
        this.weight = [0,0,0,0,0,0,0,0,0,0,0,0];
        this.alreadyBet = true;
      }
      if (prop.points > 9 && this.weight[index - 4] < 90) {
        this.weight[index - 4] += 10;
        inSender.setValue(index, this.weight[index - 4]);
        prop.points -= 10;
        this.setProp(prop);
      }
      return;
    }
  },
  //handle key press, call handle click seperately
  handleKeyPress: function() {
    this.handleKeyPress = function(inEvent) {
      var a = window.dili.prefs.settings.keyMap[inEvent.charCode];
      if (typeof a === 'number') {
        a = {index: a};
        this.handleButtonClick(this.$.controlPane, a);
      }
    }
  },

  //handle show in game Pane finished
  handleShowFinish: function(inSender) {
    var i;
    this.$.fetcher.saveProp(this.prop);
    this.alreadyBet = false;
    this.$.controlPane.disableAll(false);
    for (i = 4; i < 16; i ++) {
      this.$.controlPane.setValue(i, 0);
    }
    this.gameStatus = 'waiting';
    this.$.soundController.playASound('end');
  },
  handleAddBonus: function(inSender, inData) {
    var a = {};
    a.coins = this.prop.coins;
    a.points = this.prop.points;
    a.bonus = this.prop.bonus + inData.bonus;
    this.setProp(a);
  },

  handleGotErr: function() {
    window.alert('Err');
  },
  triggerEasterEgg: function() {
    if (this.gameStatus != 'waiting') return;
    var a = window.prompt('Please type the number of coins you want:', this.prop.coins);
    if ( a > this.prop.coins) {
      window.alert('Gotcha!!');
      return;
    }
    var b = {};
    b.coins = a;
    b.points = this.prop.points;
    b.bonus = this.prop.bonus;
    this.$.statusPane.setProp(b);
  },

  handleNarratorRequest: function (inSender, inMsg) {
  },

  handleSoundRequest: function (inSender, inSound) {
    if (inSound.type === 'cycle') {
      this.$.soundController.playCycle(inSound.name);
      return
    }
    if (inSound.type === 'stop') {
      this.$.soundController.stopASound(inSound.name);
      return;
    }
    this.$.soundController.playASound(inSound.name);
  },
});
