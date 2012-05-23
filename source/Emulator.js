/****
 * this kind is for the emulator in gamePane
 * every time gamePane want to change lamps, emulate the change
 * return the result to gamePane to show it
 * offset controls the real position of each lamp
 * 0 for white color stored as a token
 * all think in clockwise
 */
enyo.kind({
  name: 'dili.Emulator',
  kind: 'Component',
  fixed: [],//all fixed lamps here, not to change in a while, schema: [{},{},{}]
  offset: 0,
  lamps: [],
  //TODO pointer not sure for emulator
  published: {
    pointer: {lamp: 3, color: 1},
  },
  init: function(index, color) {
    this.fixed = [];
    this.lamps = [];
    this.offset = index || 0;
    this.prependLamp(color || 1);
  },

  //add a lamp to the end of the line, clockwise
  appendLamp: function(color) {
    if (this.lamps.length === 24) return false;
    this.lamps.unshift(color);
    this.offset = (this.offset + 23) % 24;
    return true;
  },

  prependLamp: function(color) {
    if (this.lamps.length === 24) return false;
    this.lamps.push(color);
    return true;
  },

  removeLamp: function(order, howMany) {
    this.lamps.splice(order, howMany);
  },

  move: function() {
    this.offset = (this.offset + 1) % 24;
  },

  back: function() {
    this.offset = (this.offset + 23) % 24;
  },
  //change a lamp color. order is the this.lamps color not the real lamp color
  changeLampColor: function(order, color) {
    this.lamps[order] = color;
  },

  //get the current lamps status array
  getLampsArray: function() {
    var i;
    var lampsArray = this.lamps.slice();//clone this.lamps because it changes
    var os = this.offset;
    while (24 - lampsArray.length) {
      lampsArray.push(0);
    }
    while (os --) {
      lampsArray.unshift(lampsArray.pop());
    }
    for (i in this.fixed) {
      if (lampsArray[this.fixed[i].index] !== 0) continue;
      lampsArray = this.fixed[i].color;
    }
    return lampsArray;
  },

  addFixed: function(index, color) {
    this.fixed.push({'index': index, 'color': color});
  },
  clearFixed: function() {
    this.fixed = [];
  },
  removeFixed: function(index) {
    var i;
    for (i in this.fixed) {
      if (this.fixed[i].index !== index) return;
      this.fixed.splice(index, 1);
    }
  },
});
