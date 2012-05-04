/****
 * this is the main game view kind
 * include game pane, status pane and a control pane
 */
enyo.kind({
   name: 'SlotMachine',
   kind: 'Control',
   components: [
      {name: 'gamePane', kind: 'GamePane'},
      {name: 'statusPane', kind: 'StatusPane'},
      {name: 'controlPane', kind: 'ControlPane'},
   ],
});

/****
 * this is the game pane kind
 * shows all visual part of the game
 */
enyo.kind({
   name: 'GamePane',
   kind: 'Control',
   components: [
   ],
});

/****
 * this is the status pane kind
 * shows game status
 * like coins, points ,bonus, etc.
 */
enyo.kind({
   name: 'StatusPane',
   kind: 'Control',
   components: [
   ],
});

/****
 * this is the control pane kind
 * shows controls
 * like start, add points, etc.
 */
enyo.kind({
   name: 'ControlPane',
   kind: 'Control',
   components: [
   ],
});
