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

var game = new Phaser.Game(768, 600, Phaser.AUTO, 'game');

var PhaserGame = function () {

    this.bmd = null;

    this.alien = null;

    this.mode = 2;

    this.points1 = {
        'x': [ 0, 128, 256, 384, 512, 640, 768],
        'y': [ 240, 240, 240, 240, 240, 240, 240]
    };

    this.points2 = {
      'x': [ 768],
      'y': [ 240, 240, 240, 240, 240, 240, 240]
    };

    this.pi = 0;
    this.path1 = [];
    this.path2 = [];

};

PhaserGame.prototype = {

    init: function () {

        this.game.renderer.renderSession.roundPixels = true;
        this.stage.backgroundColor = '#204090';

    },

    preload: function () {

        //  We need this because the assets are on Amazon S3
        //  Remove the next 2 lines if running locally
        this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue008/';
        this.load.crossOrigin = 'anonymous';

        this.load.image('alien', 'assets/ufo.png');
        this.load.bitmapFont('shmupfont', 'assets/shmupfont.png', 'assets/shmupfont.xml');

        //  Note: Graphics are not for use in any commercial project

    },

    create: function () {

        this.bmd = this.add.bitmapData(this.game.width, this.game.height);
        this.bmd.addToWorld();

        this.alien = this.add.sprite(0, 0, 'alien');
        this.alien.anchor.set(0.5);

        var py = this.points1.y;

        for (var i = 0; i < py.length; i++)
        {
            py[i] = this.rnd.between(32, 432);
        }

        this.hint = this.add.bitmapText(8, 444, 'shmupfont', "Linear", 24);

        this.input.onDown.add(this.changeMode, this);

        this.interpolation(this.points1, this.path1);

        this.random_new_points();

        this.interpolation(this.points2, this.path2);

        this.plot(this.path1);

    },

    random_new_points: function () {
      if(this.points2.x.length > 1 || this.points2.y.length > 1)
      {
        this.points2.x = [768];
        this.points2.y = [];
        this.points2.y[0] = this.path1[this.path1.length - 1].y;
      }
      else
      {
        this.points2.y[0] = this.points1.y[this.points1.y.length - 1];
      }

      for (var i = 1; i < this.points1.y.length; i++)
      {
          this.points2.y.push(this.rnd.between(32, 432));
      }

    },

    changeMode: function () {

        this.mode++;

        if (this.mode === 3)
        {
            this.mode = 0;
        }

        if (this.mode === 0)
        {
            this.hint.text = "Linear";
        }
        else if (this.mode === 1)
        {
            this.hint.text = "Bezier";
        }
        else if (this.mode === 2)
        {
            this.hint.text = "Catmull Rom";
        }

        this.plot();

    },

    interpolation: function(points, path)
    {

      var x = 1 / game.width;

      for (var i = 0; i <= 1; i += x)
      {
          if (this.mode === 0)
          {
              var px = this.math.linearInterpolation(points.x, i);
              var py = this.math.linearInterpolation(points.y, i);
          }
          else if (this.mode === 1)
          {
              var px = this.math.bezierInterpolation(points.x, i);
              var py = this.math.bezierInterpolation(points.y, i);
          }
          else if (this.mode === 2)
          {
              var px = this.math.catmullRomInterpolation(points.x, i);
              var py = this.math.catmullRomInterpolation(points.y, i);
          }
          path.push( { x: px, y: py });
      }

      // for (var i = 0; i <= 1; i += x)
      // {
      //       var px = this.math.catmullRomInterpolation(points.x, i);
      //       var py = this.math.catmullRomInterpolation(points.y, i);
      //
      //     path.push( { x: px, y: py });
      // }
    },

    plot: function (path) {

        for (var i = 0; i < this.path1.length ; i++)
        {
          this.bmd.rect(path[i].x, path[i].y, 3, 3, 'rgba(255, 255, 255, 1)');
        }

        // for (var p = 0; p < this.points1.x.length; p++)
        // {
        //     this.bmd.rect(this.points1.x[p]-3, this.points1.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
        // }

    },

    change_points_value: function() {

      for(var i = 0; i < this.path1.length; i++)
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

    update: function () {

        // this.alien.x = this.path[this.pi].x;
        // this.alien.y = this.path[this.pi].y;
        // //
        // this.pi ++;
        //
        //
        // if (this.pi >= this.path.length)
        // {
        //     this.pi = 0;
        // }
        this.bmd.clear();
        this.change_points_value();
        if(this.path2.length == 0)
        {
          this.random_new_points();

          this.interpolation(this.points2, this.path2);
        }
        this.plot(this.path1);


    }

};

game.state.add('Game', PhaserGame, true);
