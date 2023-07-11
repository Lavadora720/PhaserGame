var game = new Phaser.Game(480, 800, Phaser.AUTO, 'game-container', { preload: preload, create: create, update: update });

var ball;
var paddle;
var cube;
var cursors;
var paddleVelocity = 300;
var ballVelocity = 150;
var maxBallVelocity = 300; // Velocidad máxima de la pelota
var scoreText;
var highscoreText;
var timeFactor = 0.9999; // Factor de disminución de velocidad con el tiempo
var highscore = 0;
var bounceCount = 0; // Contador de rebotes de la pelota en el cubo

function preload() {
    game.load.image('paddle_left', 'img/paddle_left.png');
    game.load.image('paddle_right', 'img/paddle_right.png');
    game.load.spritesheet('ball', 'img/wobble.png', 20, 20);
    game.load.image('cube_break1', 'img/cube_break1.png');
    game.load.image('cube_break2', 'img/cube_break2.png');
    game.load.image('cube_break3', 'img/cube_break3.png');
    game.load.image('cube_break4', 'img/cube_break4.png');
    game.load.image('cube_break5', 'img/cube_break5.png');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#E6E6E6'; // Color blanco

    ball = game.add.sprite(game.world.centerX, game.world.centerY, 'ball');
    ball.anchor.setTo(0.5);
    game.physics.arcade.enable(ball);
    ball.scale.setTo(1.5);
    ball.body.velocity.set(ballVelocity, ballVelocity);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.animations.add('wobble', [0, 1, 0, 2, 0, 1, 0, 2, 0], 24); // Animación de wobble
    
    paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'paddle_left');
    paddle.anchor.set(0.5, 1);
    game.physics.arcade.enable(paddle);
    paddle.body.immovable = true;

    var cubeScale = 3; // Valor para ajustar el tamaño del cubo (2 = el doble de tamaño)
    var cubeWidth = 500; // Ancho del cubo en píxeles (tamaño original de la imagen)
    var cubeHeight = 100; // Altura del cubo en píxeles (tamaño original de la imagen)

    cube = game.add.sprite(game.world.centerX, game.world.centerY, 'cube_break1');
    cube.anchor.set(0.5);
    cube.scale.setTo(cubeScale);
    game.physics.arcade.enable(cube);
    cube.body.immovable = true;

    cursors = game.input.keyboard.createCursorKeys();

    var wKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    var aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    var sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    var dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

    wKey.onDown.add(movePaddleUp, this);
    aKey.onDown.add(movePaddleLeft, this);
    sKey.onDown.add(movePaddleDown, this);
    dKey.onDown.add(movePaddleRight, this);

    scoreText = game.add.text(16, 16, '', { fontSize: '24px', fill: '#000' });
    highscoreText = document.getElementById('highscore');
    moveCubeToRandomPosition();
}

function moveCubeToRandomPosition() {
    var randomX = game.rnd.between(cube.width / 2, game.world.width - cube.width / 2);
    var randomY = game.rnd.between(cube.height / 2, game.world.height - cube.height / 2);

    cube.position.x = randomX;
    cube.position.y = randomY;
}

function update() {
    game.physics.arcade.collide(ball, paddle, playWobbleAnimation);
    game.physics.arcade.collide(ball, cube, handleBallCubeCollision);

    paddle.body.velocity.x = 0;
    paddle.body.velocity.y = 0;

    if (cursors.up.isDown || game.input.keyboard.isDown(Phaser.Keyboard.W)) {
        paddle.body.velocity.y = -paddleVelocity;
    } else if (cursors.down.isDown || game.input.keyboard.isDown(Phaser.Keyboard.S)) {
        paddle.body.velocity.y = paddleVelocity;
    }

    if (cursors.left.isDown || game.input.keyboard.isDown(Phaser.Keyboard.A)) {
        paddle.body.velocity.x = -paddleVelocity;
        paddle.loadTexture('paddle_left');
    } else if (cursors.right.isDown || game.input.keyboard.isDown(Phaser.Keyboard.D)) {
        paddle.body.velocity.x = paddleVelocity;
        paddle.loadTexture('paddle_right');
    }

    ball.body.velocity.x *= timeFactor;
    ball.body.velocity.y *= timeFactor;

    var velocityX = ball.body.velocity.x;
    var velocityY = ball.body.velocity.y;
    var velocity = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    var speedKmph = (velocity / maxBallVelocity) * 100;

    scoreText.text = 'Velocidad: ' + speedKmph.toFixed(2) + '% Kmph';

    if (speedKmph > highscore) {
        highscore = speedKmph;
        highscoreText.innerText = highscore.toFixed(2);
    }
}

function playWobbleAnimation() {
    ball.animations.play('wobble');
}

function movePaddleUp() {
    paddle.body.velocity.y = -paddleVelocity;
}

function movePaddleLeft() {
    paddle.body.velocity.x = -paddleVelocity;
    paddle.loadTexture('paddle_left');
}

function movePaddleDown() {
    paddle.body.velocity.y = paddleVelocity;
}

function movePaddleRight() {
    paddle.body.velocity.x = paddleVelocity;
    paddle.loadTexture('paddle_right');
}

function handleBallCubeCollision(ball, cube) {
    bounceCount++;
    if (bounceCount >= 5) {
        cube.destroy();
    } else {
        cube.loadTexture('cube_break' + (bounceCount + 1));
    }
    playWobbleAnimation();
}
