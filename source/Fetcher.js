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
      this.createComponent({name: 'generator', kind: 'dili.RoundGenerator'});
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
      var data = [];
      data[0] = localStorage.getItem('bonus');
      data[1] = localStorage.getItem('points');
      data[2] = localStorage.getItem('coins');
      this.doGotData(data);
    },
  },

  //save data, will be replaced
  saveData: {
    debug: function(inBonus, inPoints, inCoins) {
      localStorage.setItem('bonus', inBonus);
      localStorage.setItem('points', inPoints);
      localStorage.setItem('coins', inCoins);
    },
  },

  //fetch round data, for a round of game, to be replaced
  fetchRoundData: {
    debug: function() {
      var roundData = this.$.generator.round();
      this.doGotRoundData(roundData);
    },
  },
});
