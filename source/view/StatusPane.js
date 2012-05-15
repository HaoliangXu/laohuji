/****
 * this is the status pane kind
 * shows game status
 * like coins, points ,bonus, etc.
 * publick methods:{
 *  setProp(prop object)
 * }
 */
enyo.kind({
  name: 'dili.StatusPane',
  kind: 'Control',
  classes: 'statusPane',
  events: {
    onEasterEgg: '',
  },
  components: [
    {classes: 'controlBannerGroup', components:[
      {classes: 'controlBanner', content: 'Bonus'},
      {classes: 'controlBanner', content: 'Points'},
      {classes: 'controlBanner', content: 'Coins'},
    ]},
    {classes: 'controlNumberGroup', components:[
      {classes: 'controlNumber', name: 'bonusNo', content: ''},
      {classes: 'controlNumber', name: 'pointsNo', content: ''},
      {classes: 'controlNumber', name: 'coinsNo', content: '', onclick: 'easterEgg'},
    ]},
  ],

  //when data changed, 
  setProp: function(prop) {
    this.$.bonusNo.setContent(prop.bonus);
    this.$.pointsNo.setContent(prop.points);
    this.$.coinsNo.setContent(prop.coins);
  },

  easterEgg: function() {
    this.doEasterEgg();
  },
});
