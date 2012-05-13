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
    /*
    var a = window.prompt('请输入您想要的Coin数：', this.prop[2]);
    if ( a > this.prop[2]) {
      window.alert('SB,这你也信');
      return;
    }
    this.$.coinsNo.setContent(a);
    */
  },
});
