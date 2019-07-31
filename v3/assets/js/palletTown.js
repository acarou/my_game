var player, map, moveKeys, cursors, music,

    npc,

    debugText, showDebug, debugGraphics;

class PalletTown extends Phaser.Scene {
    constructor() {
        super({key: "PalletTown"});
    }

    create() {
        savePlayer(exit, starter, this.scene.key);


        var text = this.add.text(300, 350, '', {
            fontFamily: 'Arial',
            fontSize: 12,
            color: '#000000'
        }).setDepth(1).setScrollFactor(0);


        debugText = this.add.text(280, 200, "x 0 y 0", {
            fontFamily: 'Arial',
            fontSize: 12,
            color: '#ffff00'
        }).setDepth(1).setVisible(false).setScrollFactor(0);

        /**
         * Main
         */

        music = this.sound.add('pallet-town-sound');
        music.play();


        map = this.make.tilemap({key: 'pallet-town-map'});

        var tileset = map.addTilesetImage('Kanto_Pallet_Town_Map_bank.png', "pallet-town-tiles");

        var layer = map.createStaticLayer("World", tileset, 0, 0);

        map.setCollisionByProperty({collides: true});
        var spawnPoint = map.findObject("Objects", function (obj) {
            if (obj.name === "Exits") {
                if (obj.properties.name === exit) {
                    return obj;
                }
            }
        });
        exit = "PalletTown";


        map.zones = map.filterObjects("Objects", obj => obj.name === "Zones");

        map.sign = map.filterObjects("Objects", obj => obj.name === "Sign");

        map.letterbox = map.filterObjects("Objects", obj => obj.name === "Letterbox");

        map.exit = map.filterObjects("Objects", obj => obj.name === "Exit");


        player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'ash_walk', 1).setCollideWorldBounds(true);


        this.cameras.main.setBounds(layer.x, layer.y, layer.width, layer.height);
        this.physics.world.setBounds(layer.x, layer.y, layer.width, layer.height);
        this.cameras.main.zoom = 3;
        this.cameras.main.startFollow(player);

        this.physics.add.collider(player, layer, playerCollision);

        /**
         * Debug
         */
        debugGraphics = this.add.graphics();

        this.input.keyboard.on('keydown_C', function (event) {
            showDebug = !showDebug;

            if (showDebug) {
                debugText.setVisible(true);
            } else {
                debugText.setVisible(false);
            }
            drawDebug();
        });

        /**
         * Action
         */

        this.input.keyboard.on('keydown_W', function (event) {
            var scene = this;
            if (player.direction !== "up") {
                return false;
            }
            map.letterbox.forEach(function (letterbox) {
                if (getFaces(player, letterbox, null, 30)) {
                    text.text = letterbox.properties.text;
                    scene.scene.pause();
                }
            });

            map.sign.forEach(function (sign) {
                if (getFaces(player, sign, null, 30)) {
                    text.text = sign.properties.text;
                    scene.scene.pause();

                }
            });
            setTimeout(function () {
                text.text = "";
                scene.input.keyboard.resetKeys();
                scene.scene.resume();
            }, 2000);
        }, this);


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
        player.toggleBike = false;


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
            if (player.toggleBike) {
                player.speedRate = player.runRidePower;
            } else {
                player.speedRate = player.runPower;
                player.movement = "run";
            }
        });

        this.input.keyboard.on('keyup_SHIFT', function () {
            if (player.toggleBike) {
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
            player.toggleBike = !player.toggleBike;
            if (player.toggleBike) {

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
         * NPC
         */

        npc = this.physics.add.sprite(50, 160, 'npc').setCollideWorldBounds(true).setImmovable(true);
        npc.collide = false;

        var tween = this.tweens.add({
            targets: npc,
            x: 200,
            delay: 1000,
            duration: 3000,
            yoyo: true,
            repeat: true,
            hold: 2000,
        });

        this.physics.add.collider(player, npc, npcCollision, null, tween);
        this.physics.add.collider(npc, layer);

    }

    update(time, delta) {


        map.zones.forEach(function (zone) {
            if (choice === false && zone.properties.name === "Route1") {
                return false;
            }
            if (player.x >= zone.x && player.x < zone.x + zone.width && player.y >= zone.y && player.y < zone.y + zone.height) {
                music.stop();
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



