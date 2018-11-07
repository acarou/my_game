var map, pokeball, moveKeys, cursors,

    npc,

    debugText, showDebug, debugGraphics;

class PalletTown extends Phaser.Scene {
    constructor() {
        super({key: "PalletTown"});
    }

    preload() {


    }

    create() {

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

        var music = this.sound.add('pallet-town-sound');
        music.play();


        map = this.make.tilemap({key: 'pallet-town-map'});

        var tileset = map.addTilesetImage('Kanto_Pallet_Town_Map_bank.png', "pallet-town-tiles");

        var layer = map.createStaticLayer("World", tileset, 0, 0);

        map.setCollisionByProperty({collides: true});
        var spawnPoint;
        if (first === true) {
            spawnPoint = map.findObject("Objects", obj => obj.name === "First Spawn Point");
            first = false;
        } else {
            spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
        }

        map.zones = map.filterObjects("Objects", obj => obj.name === "Zones");

        map.sign = map.filterObjects("Objects", obj => obj.name === "Sign");

        map.letterbox = map.filterObjects("Objects", obj => obj.name === "Letterbox");


        player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'ash_walk', 1).setCollideWorldBounds(true);


        this.cameras.main.setBounds(0, 0, 384, 320);
        this.physics.world.setBounds(0, 0, 384, 320);
        this.cameras.main.zoom = 3;
        this.cameras.main.startFollow(player);

        this.physics.add.collider(player, layer, playerCollision);
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
            if (player.direction !== "up") {
                return false;
            }
            map.letterbox.forEach(function (letterbox) {
                if (player.x >= letterbox.x && player.x < letterbox.x + 20 && player.y >= letterbox.y && player.y < letterbox.y + 30) {
                    text.text = letterbox.properties.text;
                    player.setActive(false).setMaxVelocity(0, 0);
                }
            });

            map.sign.forEach(function (sign) {
                if (player.x >= sign.x && player.x < sign.x + 20 && player.y >= sign.y && player.y < sign.y + 30) {
                    text.text = sign.properties.text;
                    player.setActive(false).setMaxVelocity(0, 0);

                }
            });
            setTimeout(function () {
                text.text = "";
                player.setActive(true).setMaxVelocity(999, 999);
            }, 2000)


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



