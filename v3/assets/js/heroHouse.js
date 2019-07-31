var player, map, moveKeys, cursors, music,

    npc,

    debugText, showDebug, debugGraphics;

class HeroHouse extends Phaser.Scene {
    constructor() {
        super({key: "HeroHouse"})
    }

    create() {
        savePlayer(exit, starter, this.scene.key);
        debugText = this.add.text(600, 50, "", {fontFamily: 'Arial', fontSize: 24, color: '#ffff00'});

        /**
         * Main
         */

        /*music = this.sound.add('route1-sound');
        music.play();*/

        map = this.make.tilemap({key: 'pallet-town-hero-1F-map'});

        var tileset = map.addTilesetImage('1F_bank.png', "pallet-town-hero-1F-tiles");

        var layer = map.createStaticLayer("World", tileset, 0, 0);

        map.setCollisionByProperty({collides: true});


        var spawnPoint;
        spawnPoint = map.findObject("Objects", function (obj) {
            if (obj.name === "Exits") {
                if (obj.properties.name === exit) {
                    exit = "Hero";
                    return obj;
                }
            }
        });

        map.zones = map.filterObjects("Objects", obj => obj.name === "Zones");


        player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'ash_walk', 4).setCollideWorldBounds(true);


        this.cameras.main.setBounds(layer.x, layer.y, layer.width, layer.height);
        this.physics.world.setBounds(layer.x, layer.y, layer.width, layer.height);
        this.cameras.main.zoom = 4.165;

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
        player.direction = "up";
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


        this.input.keyboard.on('keydown_W', function (event) {
            var scene = this;
            if (player.direction !== "up") {
                return false;
            }

            setTimeout(function () {
                text.text = "";
                scene.scene.resume();
            }, 2000);
        }, this);
    }


    update() {

        map.zones.forEach(function (zone) {
            if (player.x >= zone.x && player.x < zone.x + zone.width && player.y >= zone.y && player.y < zone.y + zone.height) {
                this.scene.start(zone.properties.name);
            }
        }, this);


        debugText.text = 'x : ' + Math.round(player.x) + ' y :' + Math.round(player.y);

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