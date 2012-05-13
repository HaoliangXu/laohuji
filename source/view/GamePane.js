/****
 * this is the game pane kind
 * shows all visual part of the game
 */
enyo.kind({
  name: 'dili.GamePane',
  kind: 'Control',
  classes: 'gamePane',
  lampStatusArray: [],//record the current status of main lamps
  components: [
    {name: 'supPane', classes: 'supPane', components:[
    ]},
    {name: 'jpLamp', classes: 'jpLamp'}
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
  },
});
