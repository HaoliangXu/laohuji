/****
 * Fetcher is a role to connect server or generate local data
 */
enyo.kind({
  name: 'dili.Fetcher',
  kind: 'Component',
  published: {
    username: '',
  },
  events: {
    onGotData: '',
    onGotRoundData: '',
  },
  create: function() {
    this.inherited( arguments );
    this.setupMethods();
  },

  //setup methods by replacing methods by thier child, depends on prefs
  setupMethods: function () {
    if (window.dili.prefs.DEBUG === true) {
      this.createComponent({
        name: 'generator',
        kind: 'dili.RoundGenerator',
        onGenerated: 'handleGenerated',
      });
      this.fetchData = this.fetchData.debug;
      this.saveData = this.saveData.debug;
      this.fetchRoundData = this.fetchRoundData.debug;
    } else {
    }
  },

//* @public

  //get data,will be replaced by its child, depends on prefs
  fetchData: {
    debug: function() {
      var data = {};
      data.bonus = localStorage.getItem('bonus');
      data.points = localStorage.getItem('points');
      data.coins = localStorage.getItem('coins');
      this.doGotData(data);
    },
  },

  //save data, will be replaced
  saveData: {
    debug: function(data) {
      var i;
      for (i in data) {
        localStorage.setItem(i, data[i]);
      }
    },
  },

  //fetch round data, for a round of game, to be replaced
  fetchRoundData: {
    debug: function() {
      this.$.generator.round();
    },
  },
  handleGenerated: function(inSender, roundData) {
    this.doGotRoundData(roundData);
  },
});
