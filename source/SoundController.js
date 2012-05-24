enyo.kind({
  name: 'dili.SoundController',
  kind: 'Component',
  cycle: {
    'move': 0,
  },
  components: [
    {name: 'click', kind: 'Sound', src: 'audio/click.wav'},
    {name: 'end', kind: 'Sound', src: 'audio/end.wav'},
    {name: 'move0', kind: 'Sound', src: 'audio/move0.wav'},
    {name: 'move1', kind: 'Sound', src: 'audio/move1.wav'},
    {name: 'move2', kind: 'Sound', src: 'audio/move2.wav'},
    {name: 'move3', kind: 'Sound', src: 'audio/move3.wav'},
    {name: 'khcBonus0', kind: 'Sound', src: 'audio/khcBonus0.wav'},
    {name: 'khcBonus1', kind: 'Sound', src: 'audio/khcBonus1.wav'},
    {name: 'khcMove', kind: 'Sound', src: 'audio/khcMove.wav', loop: true},
    {name: 'moveLoop', kind: 'Sound', src: 'audio/moveLoop.wav', loop: true},
    {name: 'drumroll', kind: 'Sound', src: 'audio/drumroll.wav', loop: true},
    {name: 'hit', kind: 'Sound', src: 'audio/hit.wav'},
    {name: 'split', kind: 'Sound', src: 'audio/split.wav'},
  ],
  create: function () {
    this.inherited(arguments);
  },
  playCycle: function(cycleName) {
    var cycle = this.cycle[cycleName];
    this.playASound(cycleName + cycle)
    this.cycle[cycleName] = (cycle + 1) % 4;
  },
  playASound: function (soundName) {
    this.$[soundName].play();
  },
  stopASound: function (soundName) {
    this.$[soundName].stop();
  },
});

//this kind is modified from enyo 1.0
/**
A component that allows you to play sound effects or other audio resources.  This component is an abstraction of HTML 5 Audio object.

Initialize a sound component as follows:

	{kind: "Sound", src: "http://mydomain.com/media/myfile.mp3"}
	
To play a sound, do this:

	this.$.sound.play();

You can get a reference to the actual HTML 5 Audo object via <code>this.$.sound.audio</code>.
*/
enyo.kind({
	name: "enyo.Sound",
	kind: enyo.Component,
	published: {
		/** URL of the sound file to play, can be relative to the application HTML file */
		src: "",
		/** if true, load the sound file when control is created, trading more network/memory use for latency */
		preload: true,
	        //loop artributs
	        loop: false,
	},
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.srcChanged();
		this.loopChanged();
	},
	srcChanged: function() {
		var path = enyo.path.rewrite(this.src);
		if (window.PhoneGap) {
			this.media = new Media(path);
		} else {
			if(this.audio) {
			    this.audio.pause();
			}
			this.audio = new Audio();
			this.audio.src = path;
		}
		this.preloadChanged();
		//this.audioClassChanged();
	},
	preloadChanged: function() {
		//this.setAttribute("autobuffer", this.preload ? "autobuffer" : null);
		if (this.audio) {
			this.audio.setAttribute("preload", this.preload ? "auto" : "none");
		}
	},
	loopChanged: function() {
          if (this.audio) {
            this.audio.loop = this.loop;
          }
        },
	//* @public
	//* Play the sound.  If the sound is already playing, this will restart playback at the beginning.
	play: function() {
			if (!this.audio.paused) {
				this.audio.currentTime = 0;
			} else {
				this.audio.play();
			}
	},
	// stop playing the sound.
	stop: function() {
	  this.audio.currentTime = 0;
	  this.audio.pause();
        },
});
