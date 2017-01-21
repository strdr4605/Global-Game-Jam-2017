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

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

var PhaserGame = function () {

    this.bmd = null;

    this.alien = null;

    this.point = null;

    this.mode = 2;

    this.points1 = {
        'x': [ 0, 128, 256, 384, 512, 608, 800],
        'y': [ 240, 240, 240, 240, 240, 240, 130]
    };

    this.points2 = {
      'x' : [800],
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
        //  Note: Graphics are not for use in any commercial project

    },

    create: function () {



        this.bmd = this.add.bitmapData(this.game.width, this.game.height);
        this.bmd.addToWorld();

        this.alien = this.add.sprite(0, 0, 'alien');
        this.alien.anchor.set(0.5);

        this.point = this.game.make.sprite(0,0,'point');
        this.bmd.draw(this.point,100,100);

        var py = this.points1.y;

        for (var i = 0; i < py.length; i++)
        {
            py[i] = this.rnd.between(32, 432);
        }

        this.hint = this.add.bitmapText(8, 444, 'shmupfont', "Wave Hero", 24);


        this.interpolation(this.points1, this.path1);

        this.random_new_points();

        this.interpolation(this.points2, this.path2);

        this.plot(this.path1);

    },

    random_new_points: function () {
      if(this.points2.x.length > 1 || this.points2.y.length > 1)
      {
        this.points2.x = [800];
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
          this.points2.x.push(this.rnd.between(850, 1600));
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

    plot_new_graph: function() {

        for(var i = 0; i < this.path.length - 1 ; i ++)
        {
          this.bmd.rect(this.path[i].x, this.path[i].y, 1, 1, 'rgba(255, 255, 255, 1)');
        }

        for (var p = 0; p < this.points.x.length; p++)
        {
            this.bmd.rect(this.points.x[p]-3, this.points.y[p]-3, 6, 6, 'rgba(255, 0, 0, 1)');
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
