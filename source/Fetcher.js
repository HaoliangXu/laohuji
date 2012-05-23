/****
 * Fetcher is a role to connect server or generate local data
 * Public method
 *  readProp
 *  saveProp
 *  fetchRoundData
 * all data transportation use event model for ajax
 * all data transportation call sendData all called by receiveData
 *
 */
enyo.kind({
  name: 'dili.Fetcher',
  kind: 'Component',
  published: {
    username: '',
  },
  events: {
    onGotProp: '',
    onGotRoundData: '',
    onGotErr: '',
    onPropSaved: '',
  },
  create: function() {
    this.inherited( arguments );
    this.setupMethods();
  },

  //setup methods by replacing methods by thier child, depends on prefs
  setupMethods: function () {
    if (window.dili.prefs.DEBUG === true) {
      this.createComponent({
        name: 'server',
        kind: 'dili.LocalServer',
        onGotErr: 'handleErr',
        //all data through this methods below
        onSendData: 'receiveData',
      });
      this.sendData = this.sendData.debug;
    } else {
    }
  },

//* @public

  //get data,will be replaced by its child, depends on prefs
  readProp: function() {
    var data = {};
    data.type = 'readProp';
    this.sendData(data);
  },

  //save data, will be replaced
  saveProp: function(data) {
    var d = {};
    var i;
    for (i in data) {
      d[i] = data[i];
    }
    d.type = 'saveProp';
    this.sendData(d);
  },

  //fetch round data, for a round of game, to be replaced
  fetchRoundData: function(weight) {
    var data = {};
    data.type = 'fetchRoundData';
    data.weight = weight;
    this.sendData(data);
  },

  //all data send to here
  sendData: {
    debug: function(data) {
      this.$.server.receiveData(data);
    }
  },
  receiveData: function(inSender, data) {
    switch (data.type) {
      case 'gotRoundData':
        delete data.type;
        this.doGotRoundData(data);
        break;
      case 'propSaved':
        delete data.type;
        this.doPropSaved();
        break;
      case 'gotProp':
        delete data.type;
        this.doGotProp(data);
        break;
      case 'error':
        delete data.type;
        this.doGotErr(data.e);
        break;
    }
  },
});
