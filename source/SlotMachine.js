/****
 * this is the main game view kind
 * include game pane, status pane and a control pane
 */
enyo.kind({
  name: 'dili.SlotMachine',
  kind: 'Control',
  classes: 'slotMachine',
  published: {
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

    weight: [],//how much all items user bet
  },
  components: [
    {
      name: 'gamePane',
      kind: 'dili.GamePane',
      showFinished: 'handleShowFinish',
    },
    {name: 'statusPane', kind: 'dili.StatusPane'},
    {name: 'controlPane', kind: 'dili.ControlPane', onButtonClicked: 'handleButtonClick'},
    {
      name: 'fetcher',
      kind: 'dili.Fetcher',
      onGotData: 'handleData',
      onGotRoundData: 'handleRoundData',
      onFetchFailed: 'handleFetchFailed',
    },
  ],
  create: function() {
    var i = 12;
    this.inherited(arguments);
    this.setupMethod();
    //initial weight
    while (i--) {
      this.weight[i] = 0;
    }
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
      this.$.fetcher.setUsername(id);
      this.$.fetcher.saveData(0, 0, 100);
      this.$.fetcher.fetchData();
    }
  },

  //handle data
  handleData: function(inSender, data) {
    var i;
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
    this.$.gamePane.start(roundData);
  },
  handleButtonClick: function(inSender, index){
    this.log(index);
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
      this.log(this.alreadyBet);
      //did user bet? if yes, start game
      if (this.alreadyBet) {
        this.log('1');
        this.$.fetcher.fetchRoundData();
        this.log('2');
        this.$.controlPane.disableAll(true);
        this.log('3');
        return;
      }

      //now, no bet, see if possible to bet as last round
      for (i = 0; i < 12; i ++) {
        pointsNeeded += this.weight[i];
      }
      if (prop.points >= pointsNeeded) {//if enough points
        //change controlpane to show last bet
        for (i = 0; i < 12; i ++) {
          this.$.controlPane.setValue(i + 4, this.weight[i]);
        }
        //then start game
        this.$.fetcher.fetchRoundData();
        this.$.controlPane.disableAll(true);
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
      if (prop.points > window.dili.prefs.COINTOPOINTRATE) {
        prop.points -= window.dili.prefs.COINTOPOINTRATE;
        prop.coins ++;
        this.setProp(prop);
      }
      return;
    }
    //items clicked
    if (4 <= index && index <= 11) {
      if (prop.points > 0 && this.weight[index - 4] < 99) {
        this.weight[index - 4] ++;
        this.$.controlPane.setValue(index, this.weight[index - 4]);
        prop.points --;
        this.setProp(prop);
        this.alreadyBet = true;
      }
      return;
    }
    //color clicked
    if (12 <= index) {
      if (prop.points > 9 && this.weight[index - 4] < 90) {
        this.weight[index - 4] += 10;
        this.$.controlPane.setValue(index, this.weight[index - 4]);
        prop.points -= 10;
        this.setProp(prop);
        this.alreadyBet = true;
      }
      return;
    }
  },

  //handle show in game Pane finished
  handleShowFinish: function() {
    this.alreadyBet = false;
    this.$.controlPane.disableAll(false);
  },
  handleFetchFailed: function() {
    window.alert('fetch data failed, restart game');
  },
});
