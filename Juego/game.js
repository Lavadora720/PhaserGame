        var game = new Phaser.Game(600, 600, Phaser.AUTO, 'game-container', { preload: preload, create: create, update: update });
    
        var ball;
        var player1;
        var player2;
        var playing = false;
        var startButton;
        var cursors;
        var player1Movement;
        var player2Movement;
    
        function preload() {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            game.stage.backgroundColor = '#eee';
            game.load.image('paddle', 'img/paddle.png');
            game.load.spritesheet('ball', 'img/wobble.png', 20, 20);
            game.load.spritesheet('button', 'img/button.png', 120, 40);
        }
    
        function create() {
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.physics.arcade.checkCollision.down = true;
            
            ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, 'ball');
            ball.animations.add('wobble', [0, 1, 0, 2, 0, 1, 0, 2, 0], 24);
            ball.anchor.set(0.5);
            game.physics.enable(ball, Phaser.Physics.ARCADE);
            ball.body.collideWorldBounds = true;
            ball.body.bounce.set(0.7);
            ball.checkWorldBounds = true;
            ball.events.onOutOfBounds.add(ballLeaveScreen, this);
    
            player1 = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'paddle');
            player1.anchor.set(0.5, 1);
            game.physics.enable(player1, Phaser.Physics.ARCADE);
            player1.body.immovable = true;
            player1.body.collideWorldBounds = true;
    
            player2 = game.add.sprite(game.world.width * 0.5, 5, 'paddle');
            player2.anchor.set(0.5, 0);
            game.physics.enable(player2, Phaser.Physics.ARCADE);
            player2.body.immovable = true;
            player2.body.collideWorldBounds = true;
    
            startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, 'button', startGame, this, 1, 0, 2);
            startButton.anchor.set(0.5);
    
            cursors = game.input.keyboard.createCursorKeys();
            game.input.keyboard.addKeyCapture([Phaser.Keyboard.W, Phaser.Keyboard.A, Phaser.Keyboard.S, Phaser.Keyboard.D]);
    
            player1Movement = {
                left: game.input.keyboard.addKey(Phaser.Keyboard.A),
                right: game.input.keyboard.addKey(Phaser.Keyboard.D),
                up: game.input.keyboard.addKey(Phaser.Keyboard.W),
                down: game.input.keyboard.addKey(Phaser.Keyboard.S)
            };
    
            player2Movement = {
                left: game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
                right: game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
                up: game.input.keyboard.addKey(Phaser.Keyboard.UP),
                down: game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
            };
        }
    
        function update() {
            game.physics.arcade.collide(ball, player1, ballHitPaddle);
            game.physics.arcade.collide(ball, player2, ballHitPaddle);
    
            if (playing) {
                handlePlayerMovement(player1, player1Movement);
                handlePlayerMovement(player2, player2Movement);
            }
        }
    
        function handlePlayerMovement(player, movement) {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
    
            if (movement.left.isDown) {
                player.body.velocity.x = -300;
            } else if (movement.right.isDown) {
                player.body.velocity.x = 300;
            }
    
            if (movement.up.isDown) {
                player.body.velocity.y = -300;
            } else if (movement.down.isDown) {
                player.body.velocity.y = 300;
            }
        }
    
        function ballLeaveScreen() {
            // ... Código anterior de la función ballLeaveScreen ...
        }
    
        function ballHitPaddle(ball, paddle) {
            ball.animations.play('wobble');
            var diffX = ball.x - paddle.x;
            var diffY = ball.y - paddle.y;
    
            // Ajusta la velocidad horizontal de la pelota en función de la posición del impacto en el paddle
            ball.body.velocity.x = 2 * diffX + ball.body.velocity.x;
    
            // Ajusta la velocidad vertical de la pelota en función de la posición del impacto en el paddle
            ball.body.velocity.y = 2 * diffY + ball.body.velocity.y;
        }
    
        function startGame() {
            startButton.destroy();
            ball.body.velocity.set(150, -150);
            playing = true;
        }
