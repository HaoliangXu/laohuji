/****
 * controls all about login logic and view
 */
enyo.kind({
  name: 'dili.Login',
  kind: 'Control',
  publishied: {
  },
  events: {
    onAuthorized: '',
  },
  components: [
    {kind: 'Popup', showing: false, components: [
      {content: 'user name'},
      {kind: 'Input'},
      {kind: 'Button'},
    ]},
  ],
});
