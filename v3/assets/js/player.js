var player, moveKeys, cursors;

var toggleBike;

class Player extends Phaser.Scene {
    constructor() {
        super({
            key: "Player",
            active: true
        })
    }

    preload() {
        this.load.spritesheet('ash_walk', 'assets/images/ash/walk.png', {frameWidth: 15, frameHeight: 19});
        this.load.spritesheet('ash_run', 'assets/images/ash/run.png', {frameWidth: 16, frameHeight: 19});
        this.load.spritesheet('ash_ride', 'assets/images/ash/ride.png', {frameWidth: 20, frameHeight: 22});
    }

    create() {
        player = this.physics.add.sprite(200, 200, 'ash_walk', 1).setCollideWorldBounds(true);

        /**
         * Player define
         */
        player.walkPower = 0.8;
        player.runPower = 1.3;
        player.walkRidePower = 1.5;
        player.runRidePower = 2;
        player.speedRate = player.walkPower;
        player.movement = "walk";
        player.direction = "down";

        /**
         * MOVE
         */
        cursors = this.input.keyboard.createCursorKeys();


        moveKeys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.Z,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.Q,
            'right': Phaser.Input.Keyboard.KeyCodes.D
        });

        /**
         * RUN
         */

        this.input.keyboard.on('keydown_SHIFT', function () {
            if (toggleBike) {
                player.speedRate = player.runRidePower;
            } else {
                player.speedRate = player.runPower;
                player.movement = "run";
            }
        });

        this.input.keyboard.on('keyup_SHIFT', function () {
            if (toggleBike) {
                player.speedRate = player.walkRidePower;

            } else {
                player.speedRate = player.walkPower;
                player.movement = "walk";
            }
        });

        /**
         * BIKE
         */

        this.input.keyboard.on('keydown_B', function () {
            toggleBike = !toggleBike;
            if (toggleBike) {
                console.log('toto');

                player.movement = "ride";
                player.speedRate = player.walkRidePower;
                playAnim(player, player.direction, player.movement);
            } else {
                player.movement = "walk";
                player.speedRate = player.walkPower;
                playAnim(player, player.direction, player.movement);
            }
        });

        /**
         * ANIMATION
         */

        /** ash_walk */
        createAnim(this, 'ash_walk', 'down_walk', 8, 0, 2);
        createAnim(this, 'ash_walk', 'up_walk', 8, 3, 5);
        createAnim(this, 'ash_walk', 'right_walk', 8, 6, 8);
        createAnim(this, 'ash_walk', 'left_walk', 8, 9, 11);

        /** ash_run */

        createAnim(this, 'ash_run', 'down_run', 10, 0, 3);
        createAnim(this, 'ash_run', 'up_run', 10, 4, 7);
        createAnim(this, 'ash_run', 'right_run', 10, 8, 11);
        createAnim(this, 'ash_run', 'left_run', 10, 12, 15);

        /** ride */
        createAnim(this, 'ash_ride', 'down_ride', 10, 0, 2);
        createAnim(this, 'ash_ride', 'up_ride', 10, 3, 5);
        createAnim(this, 'ash_ride', 'right_ride', 10, 6, 8);
        createAnim(this, 'ash_ride', 'left_ride', 10, 9, 11);

    }

    update() {

        player.body.setVelocity(0);

        // Horizontal movement
        if (cursors.left.isDown) {
            player.body.setVelocityX(-80 * player.speedRate);
            playAnim(player, "left", player.movement);

        }
        else if (cursors.right.isDown) {
            player.body.setVelocityX(80 * player.speedRate);
            playAnim(player, "right", player.movement);
        }

        // Vertical movement
        else if (cursors.up.isDown) {
            player.body.setVelocityY(-80 * player.speedRate);
            playAnim(player, "up", player.movement);

        }
        else if (cursors.down.isDown) {
            player.body.setVelocityY(80 * player.speedRate);
            playAnim(player, "down", player.movement);
        } else {
            player.anims.stop();
        }

    }
}

function playAnim(target, direction, name) {
    target.anims.play(direction + "_" + name, true);
    player.direction = direction;
}

function createAnim(scope, spriteName, keyName, frameRate = 10, start, end) {
    scope.anims.create({
        key: keyName,
        frames: scope.anims.generateFrameNumbers(spriteName, {start: start, end: end}),
        frameRate: frameRate,
        repeat: -1,
    });
}