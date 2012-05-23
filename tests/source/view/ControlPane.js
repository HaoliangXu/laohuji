/****
 * this is the control pane kind
 * shows controls
 * like start, add points, etc.
 */
enyo.kind({
  name: 'dili.ControlPane',
  kind: 'Control',
  classes: 'controlPane',
  justFinishLastGame: false,
  weight: [],
  events: {
    onButtonClicked: '',
  },
  components: [
  ],
  create: function() {
    this.inherited(arguments);

    //generate all buttons
    var i, oi;
    var o = [];
    for (i = 0; i < 16; i ++) {
      oi = {name: 'button' + i, classes: 'button b' + i, content: '00', onclick: 'handleClick'};
      o.push(oi);
      this.weight[i] = 0;
    }
    var c = ['x2', 'x2', 'x2', 'x10'];
    for (i = 12; i < 16; i ++) {
      o[i].components = [
        {classes: 'colorMultiple', content: c[i - 12]},
        {name:'color' + i, classes: 'colorValue', content: '00'}
      ];
    }
    this.createComponents(o);
    this.$.button0.setContent('start');
    this.$.button1.setContent('insert');
    this.$.button2.setContent('coinout');

    //initial weight[]
  },

  //set the value of any button which has number
  setValue: function (inKey, inValue) {
    inValue = inValue >= 10 ? '' + inValue : '0' + inValue;
    if (inKey < 12) {
      this.$['button' + inKey].setContent(inValue);
      return;
    }
    this.$['color' + inKey].setContent(inValue);
  },

  handleClick: function(inSender) {
    var index = parseInt(inSender.name.slice(6), 10);
    index = {'index': index};//wrap data in an object for enyo 2.0 b2
    this.doButtonClicked(index);
  },
  disableAll: function(inTrueToDisable) {
    var i;
    for (i = 0; i < 16; i ++) {
      this.disableButton(i, inTrueToDisable);
    }
  },
  disableButton: function(buttonIndex, inTrueToDisable) {
    this.$['button' + buttonIndex].addRemoveClass('disable', inTrueToDisable);
  },
  flashButton: function(buttonIndex, count) {
    var i;
    var timePoint = 0;
    var indexButton = this.$['button' + buttonIndex];
    var flashOn = function(inTrueToFlash) {indexButton.addRemoveClass('flash', inTrueToFlash)};
    count = count ? count : 1 ;
    for (i = 0; i < count; i ++ ) {
      setTimeout(function(){flashOn(true); }, timePoint);
      timePoint += 500;
      setTimeout(function(){flashOn(false)}, timePoint);
      timePoint += 500;
    }
  },
});
