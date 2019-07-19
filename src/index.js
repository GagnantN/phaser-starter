import 'phaser';
import assets from 'img/breakout.png';
import breakjson from 'img/breakout.json';
import sky from 'img/sky.png';

// This is the entry point of your game.

var Breakout = new Phaser.Class({

  Extends: Phaser.Scene,

  initialize:

  function Breakout ()
  {
      Phaser.Scene.call(this, { key: 'breakout' });


      this.brickColor;

      this.brickButtom;

      this.paddle;
      this.ball;

  },

  preload: function ()
  {
      this.load.atlas('assets', assets, breakjson);
      this.load.image('sky', sky);



  },

  create: function ()
  {
      this.add.image(400, 300, 'sky');

      //  Enable world bounds, but disable the floor
      this.physics.world.setBoundsCollision(true, true, true, false);

      //  Create bricks
      this.brickColor = this.physics.add.staticGroup({
          key: 'assets', frame: [ 'brick_blue.png', 'brick_red.png', 'brick_green.png', 'brick_yellow.png'],
          frameQuantity: 8,
          gridAlign: { width: 8, height: 6, cellWidth: 96, cellHeight: 32, x: 100, y: 100 },
      });



      // Create brick Buttom
      this.brickButtom = this.physics.add.staticGroup({
          key: 'assets', frame: ['brick_purple.png'],
          frameQuantity: 1,
          gridAlign: { width: 10, height: 6, cellWidth: 64, cellHeight: 32, x: 112, y: 350 }
      });



      this.ball = this.physics.add.image(400, 500,'assets', 'ball.png').setCollideWorldBounds(true).setBounce(1);
      this.ball.setData('onPaddle', true);

      this.paddle = this.physics.add.image(400, 550, 'assets', 'paddle.png').setImmovable();

      //  Our colliders
      this.physics.add.collider(this.ball, this.brickColor, this.hitBrick, null, this);
      this.physics.add.collider(this.ball, this.brickButtom, this.hitBrickButtom, null, this);
      this.physics.add.collider(this.ball, this.paddle, this.hitPaddle, null, this);

      //  Input events
      this.input.on('pointermove', function (pointer) {

          //  Keep the paddle within the game
          this.paddle.x = Phaser.Math.Clamp(pointer.x, 25, 775);

          if (this.ball.getData('onPaddle'))
          {
              this.ball.x = this.paddle.x;
          }

      }, this);

      this.input.on('pointerup', function (pointer) {

          if (this.ball.getData('onPaddle'))
          {
              this.ball.setVelocity(-75, -300);
              this.ball.setData('onPaddle', false);
          }

      }, this);
},

  hitBrick: function (ball, brick)
  {
      brick.disableBody(true, true);

      if (this.brickColor.countActive() === 0)
      {
          this.resetLevel();
      }
  },

  hitBrickButtom: function (ball, brickButtom)
  {
      brickButtom.disableBody(true, true);

      if (this.brickButtom.countActive() === 0)
      {
          window.open( "https://www.youtube.com/", 'no-repeat') ;

          //pause
          var button = this.scene.pause();

          if (button === true){

              var helloButton = this.add.text(400, 300, 'PLAY!', { fill: 'blue' });
              helloButton.setInteractive();
          
              helloButton.on('pointerover', () => { this.scene.start(); });
              
          }
      }
  },

  resetBall: function ()
  {
      this.ball.setVelocity(0);
      this.ball.setPosition(this.paddle.x, 500);
      this.ball.setData('onPaddle', true);
  },

  resetLevel: function ()
  {
      this.resetBall();

      this.brickColor.children.each(function (brick) {

          brick.enableBody(false, 0, 0, true, true);

          window.open( "https://www.google.fr/", 'no-repeat') ;

      });
  },

  hitPaddle: function (ball, paddle)
  {
      var diff = 0;

      if (ball.x < paddle.x)
      {
          //  Ball is on the left-hand side of the paddle
          diff = paddle.x - ball.x;
          ball.setVelocityX(-10 * diff);
      }
      else if (ball.x > paddle.x)
      {
          //  Ball is on the right-hand side of the paddle
          diff = ball.x -paddle.x;
          ball.setVelocityX(10 * diff);
      }
      else
      {
          //  Ball is perfectly in the middle
          //  Add a little random X to stop it bouncing straight up!
          ball.setVelocityX(2 + Math.random() * 8);
      }
  },

  update: function ()
  {
      if (this.ball.y > 600)
      {
          this.resetBall();
      }
  }

});

var config = {
  type: Phaser.WEBGL,
  width: 800,
  height: 600,
  parent: 'phaser-example',
  scene: [ Breakout ],
  physics: {
      default: 'arcade'
  }
};

var game = new Phaser.Game(config);