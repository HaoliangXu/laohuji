/****
 * this is the status pane kind
 * shows game status
 * like coins, points ,bonus, etc.
 */
enyo.kind({
  name: 'dili.StatusPane',
  kind: 'Control',
  classes: 'statusPane',
  components: [
    {classes: 'controlBannerGroup', components:[
      {classes: 'controlBanner', content: 'Bonus'},
      {classes: 'controlBanner', content: 'Points'},
      {classes: 'controlBanner', content: 'Coins'},
    ]},
    {classes: 'controlNumberGroup', components:[
      {classes: 'controlNumber', name: 'bonusNo', content: ''},
      {classes: 'controlNumber', name: 'pointsNo', content: ''},
      {classes: 'controlNumber', name: 'coinsNo', content: ''},
    ]},
  ],
  published: {
    prop: '',
  },

  //when data changed, 
  propChanged: function() {
    this.$.bonusNo.setContent(this.prop[0]);
    this.$.pointsNo.setContent(this.prop[1]);
    this.$.coinsNo.setContent(this.prop[2]);
  },
});
