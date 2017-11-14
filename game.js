var player;
var platforms;
var baddies;
var stars;
var score = 0;
var scoreText;
var restartText;
var spaceKey;
var escapeKey;

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  // Load assets
  game.load.image('sky', 'assets/sky.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/star.png');
  game.load.image('baddie', 'assets/baddie.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function create() {

  //  Enable Arcade physics
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //  Add the background sky
  game.add.sprite(0, 0, 'sky');

  setUpPlatforms();
  setUpPlayer();
  setUpStars();
  setUpBaddies();

  //  Set score text to 0
  scoreText = game.add.text(16, 16, 'score: 0', {
    fontSize: '32px',
    fill: '#000'
  });

  restartText = game.add.text(game.width - 200, 16, '[Esc] to restart', {
    fontSize: '15px',
    fill: '#000'
  });

  //  Our controls.
  cursors = game.input.keyboard.createCursorKeys();
  spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  escapeKey = game.input.keyboard.addKey(Phaser.Keyboard.ESC);
}

function update() {

  //  Collide the player, the stars and the baddies with the platforms
  var hitPlatform = game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(stars, platforms);
  game.physics.arcade.collide(baddies, platforms);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  game.physics.arcade.overlap(player, stars, collectStar, null, this);
  game.physics.arcade.overlap(player, baddies, baddieTouched, null, this);
  game.physics.arcade.overlap(baddies, stars, baddieTouchedStar, null, this)

  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;

  handleKeys(hitPlatform);
}

function handleKeys(hitPlatform) {
  if (cursors.left.isDown) {
    //  Move to the left
    player.body.velocity.x = -150;

    player.animations.play('left');
  } else if (cursors.right.isDown) {
    //  Move to the right
    player.body.velocity.x = 150;

    player.animations.play('right');
  } else {
    //  Stand still
    player.animations.stop();

    player.frame = 4;
  }

  //  Allow the player to jump if they are touching the ground.
  if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
    player.body.velocity.y = -350;
  }

  if ((scoreText.text === 'Game over ! [Space] to restart' || scoreText.text === 'Well played ! [Space] to restart') && this.spaceKey.isDown) {
    restartGame();
  }
  if (this.escapeKey.isDown) {
    restartGame()
  }
}

function restartGame() {
  // 32, game.world.height - 150
  player.body.x = 32;
  player.body.y = game.world.height - 150;
  scoreText.text = 'score: 0'
  setUpStars();
  setUpBaddies();
  player.revive();
}

function collectStar(player, star) {

  // Removes the star from the screen and from our group
  stars.remove(star);
  star.kill();

  //  Add and update the score
  score += 10;
  scoreText.text = 'Score: ' + score;

  if (stars.length === 0) {
    scoreText.text = 'Well played ! [Space] to restart';
  }

}

function baddieTouchedStar(baddie, star) {
  // Kill a star if it touches a baddie
  stars.remove(star);
  star.kill();
}

function baddieTouched(player, baddie) {
  player.kill();

  scoreText.text = 'Game over ! [Space] to restart';
}

function setUpPlatforms() {
  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = game.add.group();

  //  We will enable physics for any object that is created in this group
  platforms.enableBody = true;

  // Here we create the ground.
  var ground = platforms.create(0, game.world.height - 64, 'ground');

  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  ground.scale.setTo(2, 2);

  //  This stops it from falling away when you jump on it
  ground.body.immovable = true;

  //  Now let's create two ledges
  var ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;

  ledge = platforms.create(-150, 250, 'ground');
  ledge.body.immovable = true;
}

function setUpPlayer() {
  // The player and its settings
  player = game.add.sprite(32, game.world.height - 150, 'dude');

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. Give the little guy a slight bounce.
  player.body.bounce.y = 0.2;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  //  Our two animations, walking left and right.
  player.animations.add('left', [0, 1, 2, 3], 10, true);
  player.animations.add('right', [5, 6, 7, 8], 10, true);
}

function setUpStars() {
  // If we already have stars in place, destroy them
  if (stars) {
    stars.destroy();
  }

  //  Finally some stars to collect
  stars = game.add.group();

  //  We will enable physics for any star that is created in this group
  stars.enableBody = true;

  //  Here we'll create 12 of them evenly spaced apart
  for (var i = 0; i < 12; i++) {
    //  Create a star inside of the 'stars' group
    var star = stars.create(i * 70, 0, 'star');

    //  Let gravity do its thing
    star.body.gravity.y = 300;

    //  This just gives each star a slightly random bounce value
    star.body.bounce.y = 0.7 + Math.random() * 0.2;
  }
}

function setUpBaddies() {
  if (baddies) {
    baddies.destroy();
  }

  baddies = game.add.group();

  baddies.enableBody = true;

  for (var i = 0; i < 2; i++) {
    // Generate a random position for our baddie
    var pos = Math.floor(Math.random() * game.world.width) + 1 - 100;
    var baddie = baddies.create(pos, 0, 'baddie');

    baddie.body.gravity.y = 300;
  }
}
