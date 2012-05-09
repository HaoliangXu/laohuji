/****
 * this is the main game view kind
 * include game pane, status pane and a control pane
 */
enyo.kind({
  name: 'dili.SlotMachine',
  kind: 'Control',
  classes: 'slotMachine',
  prop: [
  ],
  components: [
    {name: 'gamePane', kind: 'dili.GamePane'},
    {name: 'statusPane', kind: 'dili.StatusPane'},
    {name: 'controlPane', kind: 'dili.ControlPane'},
    {
      name: 'fetcher',
      kind: 'dili.Fetcher',
      onGotData: 'handleData',
      onGotRoundData: 'handleRoundData',
    },
  ],
  create: function() {
    this.inherited(arguments);
    this.setupMethod();
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
    data.forEach(function(e, i, a) {
      a[i] = parseInt(e, 10);
    });
    this.$.statusPane.setProp(data);
  },

  //handle round data
  handleRoundData: function(inSender, roundData) {
    this.$.gamePane.start(roundData);
  },
});
