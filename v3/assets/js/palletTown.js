var player, moveKeys, cursors, map, pokeball;

var debugText, showDebug, debugGraphics;

var toggleBike;

class PalletTown extends Phaser.Scene {
    constructor() {
        super({key: "PalletTown"});
    }

    preload() {
        this.load.image('pallet-town-tiles', 'assets/images/Pallet_tiles.png');
        this.load.tilemapCSV('pallet-map', 'assets/images/Pallet_map.csv');
        this.load.image('pokeball', 'assets/images/pokeball.png');
        this.load.spritesheet('ash_walk', 'assets/images/ash/walk.png', {frameWidth: 15, frameHeight: 19});
        this.load.spritesheet('ash_run', 'assets/images/ash/run.png', {frameWidth: 16, frameHeight: 19});
        this.load.spritesheet('ash_ride', 'assets/images/ash/ride.png', {frameWidth: 20, frameHeight: 22});
        this.load.audio('pallet-town-sound', 'assets/sounds/PalletTown.mp3');

    }

    create() {

        debugText = this.add.text(600, 50, "", {fontFamily: 'Arial', fontSize: 24, color: '#ffff00'});

        /**
         * Main
         */

        var music = this.sound.add('pallet-town-sound');
        music.play();

        map = this.make.tilemap({key: 'pallet-map', tileWidth: 16, tileHeight: 16});

        var tileset = map.addTilesetImage('pallet-town-tiles');
        var layer = map.createStaticLayer(0, tileset, 0, 0);

        map.setCollisionBetween(0, 5);
        map.setCollisionBetween(7, 13);
        map.setCollisionBetween(16, 19);
        map.setCollisionBetween(38, 40);
        map.setCollisionBetween(43, 45);
        map.setCollisionBetween(48, 52);
        map.setCollisionBetween(54, 59);
        map.setCollisionBetween(68, 71);
        map.setCollisionBetween(75, 86);
        map.setCollisionBetween(89, 95);
        map.setCollisionBetween(108, 108);
        map.setCollisionBetween(115, 117);
        map.setCollisionBetween(119, 120);
        map.setCollisionBetween(124, 126);
        map.setCollisionBetween(138, 142);
        map.setCollisionBetween(144, 144);


        //this.add.image(0,0,'pallet-town').setOrigin(0);
        player = this.physics.add.sprite(200, 200, 'ash_walk', 1).setCollideWorldBounds(true);
        this.cameras.main.setBounds(0, 0, 544, 432);
        this.physics.world.setBounds(0, 0, 544, 432);
        this.cameras.main.zoom = 3;
        this.cameras.main.startFollow(player);

        this.physics.add.collider(player, layer);

        /**
         * pokeball
         */
        pokeball = this.physics.add.group();

        this.physics.add.collider(player, pokeball);

        /**
         * Debug
         */
        debugGraphics = this.add.graphics();

        this.input.keyboard.on('keydown_C', function (event) {
            showDebug = !showDebug;
            drawDebug();
        });

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

    update(time, delta) {

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

function drawDebug() {
    debugGraphics.clear();

    if (showDebug) {
        // Pass in null for any of the style options to disable drawing that component
        map.renderDebug(debugGraphics, {
            tileColor: null, // Non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
        });
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