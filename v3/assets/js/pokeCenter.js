var player, map, moveKeys, cursors, music, NPC,

    pokeballs,

    debugText, showDebug, debugGraphics;

class PokeCenter extends Phaser.Scene {
    constructor() {
        super({key: "PokeCenter"})
    }

    create() {

        debugText = this.add.text(200, 150, "", {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffff00'
        }).setDepth(1).setScrollFactor(0).setVisible(false);

        /**
         * Main
         */

        var text = this.add.text(300, 400, '', {
            fontFamily: 'Arial',
            fontSize: 12,
            color: '#000000'
        }).setDepth(1).setScrollFactor(0);

        /*music = this.sound.add('route1-sound');
        music.play();*/

        map = this.make.tilemap({key: 'poke-center-map'});

        var tileset = map.addTilesetImage('PokeCenter_bank.png', "poke-center-tiles");

        var layer = map.createStaticLayer("World", tileset, 0, 0);

        map.setCollisionByProperty({collides: true});


        var spawnPoint;
        spawnPoint = map.findObject("Objects", function (obj) {
            if (obj.name === "Exits") {
                if (obj.properties.name === exit) {
                    exit = "PokeCenter";
                    return obj;
                }
            }
        });

        map.zones = map.filterObjects("Objects", obj => obj.name === "Zones");

        map.npc = map.filterObjects("Objects", obj => obj.type === "NPC");


        player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'ash_walk', 4).setCollideWorldBounds(true).setScale(1.65);


        this.cameras.main.setBounds(layer.x, layer.y, layer.width, layer.height);
        this.physics.world.setBounds(layer.x, layer.y, layer.width, layer.height);
        this.cameras.main.zoom = 2;
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
        player.walkPower = 1.1;
        player.runPower = 2;
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


        NPC = this.physics.add.group({
            immovable: true,
        });
        map.npc.forEach(function (npc) {
            NPC.create(npc.x, npc.y, 'npc', npc.properties.startFrame).setScale(1.65);
        });

        this.physics.add.collider(NPC, player, playerCollision);

        this.input.keyboard.on('keydown_W', function (event) {
            var scene = this;
            if (player.direction !== "up") {
                return false;
            }
            NPC.getChildren().forEach(function (npc, index) {
                /*if (player.getCenter().x >= npc.x - (npc.height / 2) && player.getCenter().x < npc.x + (npc.width/2)) {
                    console.log("faces");
                }*/
                if (index === 0) {
                    if (getFaces(player, npc, null, 50)) {
                        text.text = map.npc[index].properties.text;
                        scene.input.keyboard.resetKeys();
                        scene.scene.pause();
                        starter.forEach(function (pokemon) {
                            if (pokemon.choice === true) {
                                choice.hp = pokemon.hp;
                            }
                        });
                    }
                } else {
                    if (getFaces(player, npc, null, 20)) {
                        text.text = map.npc[index].properties.text;
                        scene.input.keyboard.resetKeys();
                        scene.scene.pause();
                    }
                }
            });

            setTimeout(function () {
                text.text = "";
                scene.scene.resume();
            }, 2000);
        }, this);


    }


    update() {
        if (player.body.speed > 0) {
            debugText.text = 'x : ' + player.getCenter().x + ' y :' + player.getCenter().y;

            map.zones.forEach(function (zone) {
                if (player.x >= zone.x && player.x < zone.x + zone.width && player.y >= zone.y && player.y < zone.y + zone.height) {
                    this.scene.start(zone.properties.name);
                }
            }, this);


            debugText.text = 'x : ' + Math.round(player.x) + ' y :' + Math.round(player.y);
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