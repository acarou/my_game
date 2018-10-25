var player, moveKeys, cursors, map, pokeball;

var debugText, showDebug, debugGraphics;

var toggleBike;

class Game extends Phaser.Scene {
    constructor() {
        super({key: "Game"});
    }

    preload() {
        this.load.image('pallet-town-tiles', 'assets/images/Pallet_tiles.png');
        this.load.tilemapCSV('pallet-map', 'assets/images/Pallet_map.csv');
        this.load.image('pokeball', 'assets/images/pokeball.png');
        this.load.spritesheet('ash_walk', 'assets/images/ash/walk.png', {frameWidth: 15, frameHeight: 19});
        this.load.spritesheet('ash_run', 'assets/images/ash/run.png', {frameWidth: 16, frameHeight: 19});
        this.load.spritesheet('ash_ride', 'assets/images/ash/ride.png', {frameWidth: 20, frameHeight: 22});

    }

    create() {

        debugText = this.add.text(600, 50, "", {fontFamily: 'Arial', fontSize: 24, color: '#ffff00'});

        /**
         * Main
         */

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
            } else {
                player.movement = "walk";
                player.speedRate = player.walkPower;
            }
        });

        /**
         * ANIMATION
         */

        /** ash_walk */
        this.anims.create({
            key: 'down_walk',
            frames: this.anims.generateFrameNumbers('ash_walk', {start: 0, end: 2}),
            frameRate: 8,
            repeat: -1,
        });

        this.anims.create({
            key: 'up_walk',
            frames: this.anims.generateFrameNumbers('ash_walk', {start: 3, end: 5}),
            frameRate: 8,
            repeat: -1,
        });

        this.anims.create({
            key: 'right_walk',
            frames: this.anims.generateFrameNumbers('ash_walk', {start: 6, end: 8}),
            frameRate: 8,
            repeat: -1,
        });

        this.anims.create({
            key: 'left_walk',
            frames: this.anims.generateFrameNumbers('ash_walk', {start: 9, end: 11}),
            frameRate: 8,
            repeat: -1
        });

        /** ash_run */
        this.anims.create({
            key: 'down_run',
            frames: this.anims.generateFrameNumbers('ash_run', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'up_run',
            frames: this.anims.generateFrameNumbers('ash_run', {start: 4, end: 7}),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'right_run',
            frames: this.anims.generateFrameNumbers('ash_run', {start: 8, end: 11}),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'left_run',
            frames: this.anims.generateFrameNumbers('ash_run', {start: 12, end: 15}),
            frameRate: 10,
            repeat: -1,
        });

        /** ride */
        this.anims.create({
            key: 'down_ride',
            frames: this.anims.generateFrameNumbers('ash_ride', {start: 0, end: 2}),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'up_ride',
            frames: this.anims.generateFrameNumbers('ash_ride', {start: 3, end: 5}),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'right_ride',
            frames: this.anims.generateFrameNumbers('ash_ride', {start: 6, end: 8}),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'left_ride',
            frames: this.anims.generateFrameNumbers('ash_ride', {start: 9, end: 11}),
            frameRate: 10,
            repeat: -1,
        });

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
}