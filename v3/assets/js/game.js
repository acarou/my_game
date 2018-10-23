var player,moveKeys, cursors, map;

var debugText, showDebug, debugGraphics;

class Game extends Phaser.Scene {
    constructor() {
        super({key: "Game"});
    }

    preload() {
        this.load.image('pallet-town-tiles', 'assets/images/Pallet_tiles.png');
        this.load.tilemapCSV('pallet-map', 'assets/images/Pallet_map.csv');
        this.load.spritesheet('ash', 'assets/images/ash/walk.png', { frameWidth: 15, frameHeight: 19})

    }

    create() {

        debugText = this.add.text(600,50,"",{ fontFamily: 'Arial', fontSize: 24, color: '#ffff00' });

        /**
         * Main
         */

        map = this.make.tilemap( { key: 'pallet-map', tileWidth: 16, tileHeight: 16});

        var tileset = map.addTilesetImage('pallet-town-tiles');
        var layer = map.createStaticLayer(0, tileset, 0, 0);

        map.setCollisionBetween(0,5);
        map.setCollisionBetween(7,13);
        map.setCollisionBetween(16,19);
        map.setCollisionBetween(38,40);
        map.setCollisionBetween(43,45);
        map.setCollisionBetween(48,52);
        map.setCollisionBetween(54,59);
        map.setCollisionBetween(68,71);
        map.setCollisionBetween(75, 86);
        map.setCollisionBetween(89, 95);
        map.setCollisionBetween(108,108);
        map.setCollisionBetween(115,117);
        map.setCollisionBetween(119,120);
        map.setCollisionBetween(124,126);
        map.setCollisionBetween(138,142);
        map.setCollisionBetween(144,144);


        //this.add.image(0,0,'pallet-town').setOrigin(0);
        player = this.physics.add.sprite(200, 200, 'ash', 1).setCollideWorldBounds(true);
        this.cameras.main.setBounds(0, 0, 544, 432);
        this.physics.world.setBounds(0, 0, 544, 432);
        this.cameras.main.zoom = 3;
        this.cameras.main.startFollow(player);

        this.physics.add.collider(player, layer);

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
        player.speedRate = player.walkPower;

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
            player.speedRate = player.runPower;
        });

        this.input.keyboard.on('keyup_SHIFT', function () {
           player.speedRate = player.walkPower;
        });

        /**
         * ANIMATION
         */
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('ash', { start:9, end: 11}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('ash', { start: 6, end: 8}),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('ash', { start: 3, end: 5}),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('ash', { start: 0, end: 2}),
            frameRate: 10,
            repeat: -1,
        });
    }

    update(time, delta) {

        player.body.setVelocity(0);

        // Horizontal movement
        if (cursors.left.isDown)
        {
            player.body.setVelocityX(-80 * player.speedRate);
        }
        else if (cursors.right.isDown)
        {
            player.body.setVelocityX(80 * player.speedRate);
        }

        // Vertical movement
        else if (cursors.up.isDown)
        {
            player.body.setVelocityY(-80 * player.speedRate);
        }
        else if (cursors.down.isDown)
        {
            player.body.setVelocityY(80 * player.speedRate);
        }

        if (cursors.left.isDown) {
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            player.anims.play('right', true);
        }
        else if (cursors.up.isDown) {
            player.anims.play('up', true);
        }
        else if (cursors.down.isDown) {
            player.anims.play('down', true);
        }
        else {
            player.anims.stop();
        }

    }
}

function drawDebug ()
{
    debugGraphics.clear();

    if (showDebug)
    {
        // Pass in null for any of the style options to disable drawing that component
        map.renderDebug(debugGraphics, {
            tileColor: null, // Non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
        });
    }

}