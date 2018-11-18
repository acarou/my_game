var player, map, moveKeys, cursors, music;

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

        var text = this.add.text(300, 350, '', {
            fontFamily: 'Arial',
            fontSize: 12,
            color: '#000000'
        }).setDepth(1).setScrollFactor(0);

        music = this.sound.add('route1-sound');
        music.play();

        map = this.make.tilemap({key: 'route1-map'});

        var tileset = map.addTilesetImage('Kanto_Route_1_Map_bank.png', "route1-tiles");

        var layer = map.createStaticLayer("World", tileset, 0, 0);

        map.setCollisionByProperty({collides: true});


        var spawnPoint = map.findObject("Objects", function (obj) {
            if (obj.name === "Exits") {
                if (obj.properties.name === exit) {
                    exit = "Route1";
                    return obj;
                }
            }
        });

        map.zones = map.filterObjects("Objects", obj => obj.name === "Zones");

        map.jumps = map.filterObjects("Objects", obj => obj.name === "Jumps");

        map.grasses = map.filterObjects("Objects", obj => obj.name === "Grasses");

        map.sign = map.filterObjects("Objects", obj => obj.name === "Sign");


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

                player.movement = "ride";
                player.speedRate = player.walkRidePower;
                playAnim(player, player.direction, player.movement);
            } else {
                player.movement = "walk";
                player.speedRate = player.walkPower;
                playAnim(player, player.direction, player.movement);
            }
        });

        this.input.keyboard.on('keydown_W', function (event) {
            var scene = this;
            if (player.direction !== "up") {
                return false;
            }

            map.sign.forEach(function (sign) {
                if (player.x >= sign.x && player.x < sign.x + 20 && player.y >= sign.y && player.y < sign.y + 30) {
                    text.text = sign.properties.text;
                    scene.scene.pause();

                }
            });
            setTimeout(function () {
                text.text = "";
                scene.scene.resume();
            }, 2000);
        }, this);
    }

    update(time, delta) {


        if (player.body.speed > 0) {
            map.zones.forEach(function (zone) {
                if (player.x >= zone.x && player.x < zone.x + zone.width && player.y >= zone.y && player.y < zone.y + zone.height) {
                    music.stop();
                    this.scene.start(zone.properties.name);
                }
            }, this);

            map.grasses.forEach(function (grass) {
                if (player.x >= grass.x && player.x < grass.x + grass.width && player.y >= grass.y && player.y < grass.y + grass.height) {
                    if (Math.floor(Math.random() * 100) + 1 === 50) {
                        fight(this);
                    }
                    return true;
                }

            }, this);


            if (player.direction === "down") {

                map.jumps.forEach(function (jump) {
                    if (player.x >= jump.x && player.x < jump.x + jump.width && player.y >= jump.y - 1 && player.y < jump.y + jump.height) {
                        player.y = player.y + 20;
                        return true;
                    }
                });
            }
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


function fight(world) {
    music.stop();
    world.input.keyboard.resetKeys();
    world.scene.pause();
    world.scene.run("Fight");


}