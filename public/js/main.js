// var game = new Phaser.Game(screen.width, screen.height, Phaser.AUTO);
//
// var GameState = {
//   preload: function() {
//     game.load.image('logo', 'images/phaser.png');
//   },
//   create: function() {
//     var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
//     logo.anchor.setTo(0.5, 0.5);
//   },
//   update: function() {
//
//   }
// };
//
// game.state.add('GameState', GameState);
// game.state.start('GameState');

var game = new Phaser.Game(1024, 600, Phaser.AUTO, 'game');

var PhaserGame = function () {

    this.bmd = null;

    this.alien = null;

    this.point = null;

    this.backround = null;

    this.audio = null;

    this.player = null;

    this.box = null;

    this.cursors = null;


    this.bombs = null;
    this.stars = null;
    this.score = 0;
    this.scoreText = null;

    this.mode = 2;

    this.points1 = {
        'x': [ 0, 128, 256, 384, 512, 740, 868],
        'y': [ 240, 240, 240, 240, 240, 240, 130]
    };

    this.points2 = {
      'x' : [868],
      'y' : []
    };

    this.pi = 0;
    this.path1 = [];
    this.path2 = [];

};

PhaserGame.prototype = {

    init: function () {

        this.game.renderer.renderSession.roundPixels = true;
        this.stage.backgroundColor = 'rgba(0, 0, 0, 1)';

    },

    preload: function () {

        this.load.image('alien', 'images/ufo.png');
        this.load.bitmapFont('shmupfont', 'images/shmupfont.png', 'images/shmupfont.xml');
        this.load.image('point','images/point.png');
        this.load.image('background','images/background.png');
        this.load.spritesheet('player','images/player.png',100,87,16);
        this.load.spritesheet('box','images/box.png',180, 500, 5);
        this.load.audio('music','images/Hydrogen.mp3');
        this.load.image('star', 'images/star.png');
        this.load.spritesheet('bomb', 'images/bomb.png', 200, 500, 3)
        //  Note: Graphics are not for use in any commercial project

    },

    create: function () {



        this.bmd = this.add.bitmapData(this.game.width, this.game.height);
        this.bmd.addToWorld();

        this.physics.startSystem(Phaser.Physics.ARCADE);

        //this.alien = this.add.sprite(0, 0, 'alien');
        //this.alien.anchor.set(0.5);

        this.point = this.game.make.sprite(0,0,'point');
        //this.bmd.draw(this.point,100,100);

        this.background = this.make.sprite(0,0,'background');

        this.box = this.add.sprite(850, 100, 'box');

        this.box.animations.add('play', [0, 1, 2], 10, true);

        this.box.animations.play('play');

        this.audio = this.add.audio('music');

        this.audio.play();

        var py = this.points1.y;

        for (var i = 0; i < py.length; i++)
        {
            py[i] = this.rnd.between(150, 500);
        }

        this.hint = this.add.bitmapText(8, 550, 'shmupfont', "Wave Hero", 24);


        this.interpolation(this.points1, this.path1);

        this.random_new_points();

        this.interpolation(this.points2, this.path2);

        this.plot(this.path1);

        this.player = this.game.add.sprite(this.path1[this.path1.length - 1].x, this.path1[this.path1.length - 1].y, 'player');

        this.player.scale.setTo(0.7)

        this.physics.arcade.enable(this.player);

        this.player.body.collideWorldBounds = true;

        this.player.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);

        this.player.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);

        this.cursors = this.input.keyboard.createCursorKeys();

        //  Create stars
        this.stars = game.add.group();
        this.stars.enableBody = true;
        //  Here we'll create 10 of them evenly spaced apart
        for (var i = 0; i < 1000; i++)
        {
            //  Create a star inside of the 'stars' group
            var star = this.stars.create(game.world.randomX, game.world.randomY - game.world.height*(i%100 + 1), 'star');
            star.animations.add('play', [0, 1, 2], 15, true);
            star.animations.play('play');
            //  Let gravity do its thing
            star.body.velocity.y = 150;
            star.anchor.setTo(0.5)
        }


        //  Finally some bombs to collect
        this.bombs = game.add.group();

        //  We will enable physics for any bomb that is created in this group
        this.bombs.enableBody = true;

        //  Here we'll create 10 of them evenly spaced apart
        for (var i = 0; i < 7; i++)
        {
            //  Create a bomb inside of the 'bombs' group
            var bomb = this.bombs.create(game.world.randomX, game.world.randomY - game.world.height, 'bomb');
            bomb.animations.add('play', [0, 1, 2], 15, true);
            bomb.animations.play('play');
            //  Let gravity do its thing
            bomb.body.velocity.y = 200;
            bomb.anchor.setTo(0.5)
            bomb.scale.setTo(0.1)
        }

        //  The score
        this.statusText = game.add.text(16, 16, 'Collect stars and don\'t touch meteors', { fontSize: '32px', fill: '#FFF' });

        this.scoreText = game.add.text(800, 550, 'Score: 0', { fontSize: '32px', fill: '#FFF' });

    },

    random_new_points: function () {
      if(this.points2.x.length > 1 || this.points2.y.length > 1)
      {
        this.points2.x = [600];
        this.points2.y = [];
        this.points2.y[0] = this.path1[this.path1.length - 1].y;
      }
      else
      {
        this.points2.y[0] = this.points1.y[this.points1.y.length - 1];
      }

      for (var i = 1; i < this.points1.y.length; i++)
      {
          this.points2.y.push(this.rnd.between(150, 500));
          this.points2.x.push(this.rnd.between(868, 1736));
      }

    },


    interpolation: function(points, path)
    {

      var x = 1 / game.width;

      for (var i = 0; i <= 1; i += x)
      {
            var px = this.math.catmullRomInterpolation(points.x, i);
            var py = this.math.catmullRomInterpolation(points.y, i);

          path.push( { x: px, y: py });


      }
    },

    plot: function (path) {

      this.bmd.draw(this.background,0,0);


        for (var i = 0; i < this.path1.length ; i ++)
        {
          // this.bmd.rect(path[i].x, path[i].y, 1, 1, 'rgba(255, 255, 255, 1)');
          this.bmd.draw(this.point,path[i].x,path[i].y,10,20);

        }

        // for (var p = 0; p < this.points1.x.length; p++)
        // {
        //     this.bmd.rect(this.points1.x[p]-3, this.points1.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
        // }

    },

    new_point_interpolation: function () {

      var x = 1 / game.width;
      this.path[this.path.length - 1].x = this.math.catmullRomInterpolation(this.points.x, 0);
      this.path[this.path.length - 1].y = this.math.catmullRomInterpolation(this.points.y, 0);

    },

    change_points_value: function() {

      for(var i = 0; i < this.path1.length; i ++)
      {
        if(i != this.path1.length - 1)
        {
          this.path1[i].y = this.path1[i + 1].y;
        }
        else
        {
          this.path1[i].y = this.path2[0].y;
          this.path2.shift();
        }
      }

    },

    player_move: function()
    {
      for(var i = 0; i < this.path1.length - 1; i++)
      {
        if(this.player.body.position.x == this.path1[i].x)
        {
          var index = i;
        }
      }
      //this.player.body.velocity.x = -50;

      var increment = 10;

      if (this.cursors.left.isDown && index - increment >= 0)
      {
        //  Move to the left
        this.player.body.position.x = this.path1[index - increment].x;
        this.player.body.position.y = this.path1[index - increment].y;

        this.player.animations.play('left');
      }
      else if (this.cursors.right.isDown && index + increment <= this.path1.length - 1)
      {
        //  Move to the right
        this.player.body.position.x = this.path1[index + increment].x;
        this.player.body.position.y = this.path1[index + increment].y;
        this.player.animations.play('right');
      }
      else
      {
        //  Stand still
        this.player_onWave();
        this.player.animations.play('left');
      }

    },

    player_onWave: function()
    {
      for(var i = 0; i < this.path1.length - 1; i++)
      {
        if(this.player.body.position.y == this.path1[i].y)
        {
          this.player.body.position.x = this.path1[i].x;
        }
      }
    },

    update: function () {

        // this.alien.x = this.path[this.pi].x;
        // this.alien.y = this.path[this.pi].y;
        //
        // this.pi ++;
        //
        //
        // if (this.pi >= this.path.length)
        // {
        //     this.pi = 0;
        //     this.bmd.clear();
        // }
        //this.player.body.velocity.x = -50;
        this.physics.arcade.overlap(this.player, this.bombs, this.collectBomb, null, this);

        this.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);

        this.bmd.clear();
        this.change_points_value();
        this.player_move();
        if(this.path2.length == 0)
        {
          this.random_new_points();

          this.interpolation(this.points2, this.path2);
        }
        for(i=0; i<7; i++){
        if(this.bombs.children[i].position.y > 600)
        {
            this.bombs.children[i].position.y = 0
            this.bombs.children[i].position.x = game.world.randomX
          }
        }
        this.plot(this.path1);



    },

    collectBomb: function (player, bomb) {

          // Removes the bomb from the screen
          player.kill();

          //  Add and update the score
          this.statusText.text = 'You Lost. Refresh page to start again';

      },

    collectStar: function (player, star) {

          // Removes the star from the screen
          star.kill();

          this.score++;
          //  Add and update the score
          this.scoreText.text = 'Score: ' + this.score;

      }

};

game.state.add('Game', PhaserGame, true);
