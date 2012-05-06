/****
 * Fetcher is a role to connect server or generate local data
 */
enyo.kind({
  name: 'dili.Fetcher',
  kind: 'Component',
  published: {
    player: '',
  },
  create: function() {
    this.inherited( arguments );
    this.setupMethods();
  },

  //setup methods by replacing methods by thier child, depends on prefs
  setupMethods: function () {
    if ( window.dili.prefs.DEBUG === true ) {
    } else {
    }
  },
});
