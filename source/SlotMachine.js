/****
 * this is the main game view kind
 * include game pane, status pane and a control pane
 */
enyo.kind({
  name: 'dili.SlotMachine',
  kind: 'Control',
  components: [
    {name: 'gamePane', kind: 'dili.GamePane'},
    {name: 'statusPane', kind: 'dili.StatusPane'},
    {name: 'controlPane', kind: 'dili.ControlPane'},
  ],
  initial: function() {
  },
});
