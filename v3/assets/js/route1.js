var map, moveKeys, cursors;

var toggleBike;

var debugText, showDebug, debugGraphics;


class Route1 extends Phaser.Scene {
    constructor() {
        super({key: "Route1"});
    }

    create() {
        debugText = this.add.text(600, 50, "", {fontFamily: 'Arial', fontSize: 24, color: '#ffff00'});

        /**
         * Main
         */

        var music = this.sound.add('pallet-town-sound');
        music.play();

        map = this.make.tilemap({key: 'route1-map'});

        var tileset = map.addTilesetImage('Kanto_Route_1_Map_bank.png', "route1-tiles");

        var layer = map.createStaticLayer("World", tileset, 0, 0);

        map.setCollisionByProperty({collides: true});


        var spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");

        map.palletTown = map.findObject("Objects", obj => obj.name === "Pallet Town");
        map.viridianCity = map.findObject("Objects", obj => obj.name === "Viridian City");


        player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'ash_walk', 1).setCollideWorldBounds(true);


        this.cameras.main.setBounds(0, 0, 384, 640);
        this.physics.world.setBounds(0, 0, 384, 640);
        this.cameras.main.zoom = 3;
        this.cameras.main.startFollow(player);

        this.physics.add.collider(player, layer, playerCollision);

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
        toggleBike = false;

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


    }

    update() {

        if (player.x >= map.palletTown.x && player.x < map.palletTown.x + map.palletTown.width && player.y >= map.palletTown.y && player.y < map.palletTown.y + map.palletTown.height) {
            this.scene.start('PalletTown');
        }

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