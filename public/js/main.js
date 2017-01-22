var game = new Phaser.Game(1000, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('bg', 'assets/bg.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('bomb', 'assets/bomb.png', 200, 500, 3)
    game.load.spritesheet('player', 'assets/player.png', 100, 87, 16);
    game.load.spritesheet('box', 'assets/box.png', 180, 500, 5);

}

var player;
var platforms;
var cursors;

var bombs;
var score = 0;
var scoreText;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    bg = game.add.sprite(0, 0, 'bg');
    box = game.add.sprite(game.world.width - 180, 0, 'box');
    box.animations.add('play', [0, 1, 2, 4, 5], 20, true);
    box.animations.play('play');


    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    // var ground = platforms.create(0, game.world.height - 64, 'ground');
    //
    // //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    // ground.scale.setTo(2, 2);
    //
    // //  This stops it from falling away when you jump on it
    // ground.body.immovable = true;


    // The player and its settings
    player = game.add.sprite(game.world.width - 180, game.world.height / 2, 'player');
    player.scale.setTo(0.7)

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7], 10, true);
    player.animations.add('right', [8, 9, 10, 11, 12, 13, 14, 15], 10, true);

    //  Finally some bombs to collect
    bombs = game.add.group();

    //  We will enable physics for any bomb that is created in this group
    bombs.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 1000; i++)
    {
        //  Create a bomb inside of the 'bombs' group
        var bomb = bombs.create(game.world.randomX, game.world.randomY - game.world.height * (i % 100 + 1), 'bomb');
        bomb.animations.add('play', [0, 1, 2], 15, true);
        bomb.animations.play('play');
        //  Let gravity do its thing
        bomb.body.velocity.y = 200;
        bomb.anchor.setTo(0.5)
        bomb.scale.setTo(0.1)
    }

    //  The score
    scoreText = game.add.text(16, 16, 'Dont touch the meteors', { fontSize: '32px', fill: '#FFF' });

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    //  Collide the player and the bombs with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(bombs, platforms);

    //  Checks to see if the player overlaps with any of the bombs, if he does call the collectStar function
    game.physics.arcade.overlap(player, bombs, collectBomb, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = -50;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -300;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 250;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.play('left');
    }

}

function collectBomb (player, bomb) {

    // Removes the bomb from the screen
    player.kill();

    //  Add and update the score
    scoreText.text = 'You Lost. Refresh page to start again';

}
