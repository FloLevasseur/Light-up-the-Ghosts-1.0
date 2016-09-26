var game = new Phaser.Game(640, 800);

var TitleScreen = function () {};
var Gameplay = function () {};
var titleText = null;

game.constants = {
   
   GAMEPLAYTIMER: 24000,
   SCORETIMER: 26000,
   HOURS: ['Midnight', '01:00 am', '02:00 am', '03:00 am',
           '04:00 am', '05:00 am', '06:00 am']
};

var WebFontConfig = {
   
   //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
       
      families: ['Creepster', 'Chela One']
    }
};



TitleScreen.prototype = {
   
   
   
   preload: function () {
      
      //  We load the Google WebFont Loader script
      this.load.script('webfont',
                       '//ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
      
      this.game.load.path = 'graphics/';
      
      this.load.spritesheet('ghost', 'ghost02.png', 32, 32);
      this.game.load.image('whiteDisc', 'disc_white.png');
      this.game.load.image('playAgainButton', 'button_play-again.png');
      this.game.load.image('startButton', 'button_start.png');
      this.game.load.image('letsGoButton', 'button_lets-go.png');
      
      this.game.load.path = 'sounds/';
      
      this.load.audio('touch01', 'touch01.wav');
      this.load.audio('touch02', 'touch02.wav');
      this.load.audio('touch03', 'touch03.wav');
      this.load.audio('frenchPride', 'rooster.ogg');
   },
   
   
   
   create: function () {
      
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.pageAlignHorizontally = true;
      
      //  We set a delay before creating text using Google Web Fonts,
      //  if we don't the browser cannot render the text the first time it's created
      this.time.events.add(Phaser.Timer.SECOND, this.displayTitleScreen, this);
   },
   
   
   
   displayTitleScreen: function () {      
      
      this.titleText = this.add.text(this.world.centerX,
                                     this.world.centerY - 150,
                                     'LIGHT UP\nTHE');
      this.titleText.anchor.setTo(0.5);
      this.titleText.font = 'Creepster';
      this.titleText.fontSize = 96;
      this.titleText.fill = '#d2e2eb';
      
      this.titleText02 = this.add.text(this.world.centerX + 120,
                                     this.world.centerY - 80,
                                     'GHOSTS');
      this.titleText02.anchor.setTo(0.5);
      this.titleText02.font = 'Creepster';
      this.titleText02.fontSize = 96;
      this.titleText02.fill = '#d2e2eb';
      
      var myTween = this.add.tween(this.titleText02).to({y: this.world.centerY - 110},
                                                        1000,
                                                        "Sine.easeOut",
                                                        true,
                                                        0,
                                                        -1,
                                                        true);
      
      this.creditsText = this.add.text(this.world.centerX,
                                      this.world.height - 2,
                                      '2016 Florent LEVASSEUR');
      this.creditsText.anchor.set(0.5, 1);
      this.creditsText.font = 'Chela One';
      this.creditsText.fontSize = 32;
      this.creditsText.fill = '#117cb4';
      
      this.versionText = this.add.text(this.world.width - 2,
                                      this.world.height - 2,
                                      'v1.0');
      this.versionText.anchor.setTo(1);
      this.versionText.font = 'Chela One';
      this.versionText.fontSize = 24;
      this.versionText.fill = '#d2e2eb';

      
      
      this.introButton = game.add.button(this.world.centerX,
                               this.world.height - 150,
                               'startButton',
                               this.intro,
                               this);
      this.introButton.anchor.set(0.5);      
   },
   
   
   
   intro: function () {
      
      this.introButton.destroy();
      this.titleText.destroy();
      this.titleText02.destroy();
      this.creditsText.destroy();
      this.versionText.destroy();
      
      this.introText = this.add.text(this.world.centerX,
                                    this.world.centerY - 100,
                                     "Enough of those ghosts !" +
                                    "\nThis night, we kick them out." +
                                    "\nLet's chase them with " +
                                    "\nour fearsome flashlight : " +
                                    "\ntap or click on all of them " + 
                                    "\nbefore the Sun gets up."
                                    );
      this.introText.anchor.setTo(0.5);
      this.introText.font = 'Chela One';
      this.introText.fontSize = 32;
      this.introText.fill = '#d2e2eb';
      
      
      
      this.gameplayButton = game.add.button(this.world.centerX,
                               this.world.height - 150,
                               'letsGoButton',
                               this.start,
                               this);
      this.gameplayButton.anchor.set(0.5);
   },
   
   
   
   start: function() {
      
      this.state.start('Gameplay');   
   }
};



Gameplay.prototype = {
   
   
   
   create: function () {
      
      this.stage.backgroundColor = 0x130c00;
      
      this.score = 0;
      this.bestScore = 0;
      
      if (localStorage.getItem('hi-score')) {
         
         this.bestScore = localStorage.getItem('hi-score');      
      }
      
      this.target = this.add.sprite(300, 300, 'ghost');
      this.target.scale.set(2);
      this.target.smoothed = false;
      this.target.frame = 0;
      this.target.alpha = 0.9;
      this.target.inputEnabled = true;
      this.isClicked = false;
      this.target.events.onInputDown.add(this.clickedIt, this);
      
      this.tremorRect = new Phaser.Rectangle(this.target.x, this.target.y, 6, 3);      
      
      this.light = this.add.sprite(-200, 0, 'whiteDisc');
      this.light.anchor.set(0.5);
      this.light.alpha = 0.7;      
      
      
      
      this.timer01 = this.time.create(false);
      this.timer01.add(game.constants.GAMEPLAYTIMER, this.timeUp, this);
      this.timer01.start();
      
      this.timer02 = this.time.create(false);
      this.timer02.add(game.constants.SCORETIMER, this.scoreDisplay, this);
      this.timer02.start();
      
      
      
      this.scoreText = this.add.text(this.world.centerX,
                                      2,
                                      '0');
      this.scoreText.anchor.setTo(0.5, 0);
      this.scoreText.font = 'Chela One';
      this.scoreText.fontSize = 32;
      this.scoreText.fill = '#d2e2eb';
      
      this.timeText = this.add.text(2,
                                    2,
                                    '');      
      this.timeText.font = 'Chela One';
      this.timeText.fontSize = 32;
      this.timeText.fill = '#117cb4';
      
      
      
      this.ghostSounds = [];
      this.ghostSounds.push(this.add.audio('touch01'));
      this.ghostSounds.push(this.add.audio('touch02'));
      this.ghostSounds.push(this.add.audio('touch03'));
      
      this.rooster = this.add.audio('frenchPride');
   },
   
   
   
   update: function () {
      
      this.tremorRect.random(this.target);
      
      if (this.timeText.visible) {
         
         var index = Math.floor(this.timer01.seconds / 4);
      
         this.timeText.text = game.constants.HOURS[index];
         this.scoreText.text = this.score;
      }
   },
   
   
   
   clickedIt: function (sprite, pointer) {
      
      if (!sprite.isClicked) {
         
         sprite.frame = 1;
         sprite.isClicked = true;
         this.score ++;
         
         this.light.x = pointer.x;
         this.light.y = pointer.y;
         
         var rdNb = this.rnd.integerInRange(0, 2);
         this.ghostSounds[rdNb].play();

         var myTween = this.add.tween(sprite).to({ alpha: 0 }, 400, "Linear", true);

         myTween.onComplete.add(function () {

            var x = this.rnd.between(0, this.game.width - this.target.width);
            var y = this.rnd.between(0, this.game.height - this.target.height);
            sprite.x = x;
            sprite.y = y;         
            this.tremorRect.x = x;
            this.tremorRect.y = y;

            var newScale = this.rnd.between(1.4, 2.6);
            sprite.scale.set(newScale);
            sprite.alpha = 1;
            sprite.frame = 0;
            sprite.isClicked = false;

         }, this);
      }
   },
   
   
   
   timeUp: function () {
      
      this.target.inputEnabled = false;
      this.target.visible = false;
      
      this.light.visible = false;
      
      this.timeText.visible = false;
      this.scoreText.x = this.world.centerX;
      this.scoreText.y = this.world.centerY - 100;
      
      this.rooster.play();
      
      this.scoreText.text = "Dawn is here !";
      this.scoreText.fill = '#f4cf82';
   },
   
   
   
   scoreDisplay: function () {
      
      this.scoreText.y = this.world.centerY - 100;
      this.scoreText.fill = '#d2e2eb';
      
      if (this.score > this.bestScore) {
         
         this.scoreText.text = "Your score is " + this.score +
                              ". \n\nIt's a new record !";
         this.bestScore = this.score;
         localStorage.setItem('hi-score', this.bestScore);
         
      } else if (this.score < this.bestScore) {
         
         this.scoreText.text = "Your score is " + this.score +
                              ".  \n\nYour best one is " + this.bestScore + ".";
      } else {
         
         this.scoreText.text = "Your score is " + this.score +
                              ",\n\nalready your best one.";
      }
      
      var button = game.add.button(this.world.centerX,
                               this.world.height - 200,
                               'playAgainButton',
                               this.playAgain,
                               this);
      button.anchor.set(0.5);      
   },
   
   
   
   playAgain: function () {
      
      this.state.restart();
   }
};

game.state.add('Gameplay', Gameplay);
game.state.add('TitleScreen', TitleScreen, true);