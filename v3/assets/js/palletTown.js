var player, map, pokeball, moveKeys, cursors,

 npc,

 debugText, showDebug, debugGraphics;

class PalletTown extends Phaser.Scene {
    constructor() {
        super({key: "PalletTown"});
    }

    preload() {

        this.load.image('pallet-town-tiles', 'assets/images/background/Kanto_Pallet_Town_Map_bank.png');
        this.load.tilemapTiledJSON('pallet-town-map', 'assets/images/background/Kanto_Pallet_Town_Map_map.json');
        this.load.image('pokeball', 'assets/images/pokeball.png');

        this.load.audio('pallet-town-sound', 'assets/sounds/PalletTown.mp3');


        this.load.spritesheet('ash_walk', 'assets/images/ash/walk.png', {frameWidth: 15, frameHeight: 19});
        this.load.spritesheet('ash_run', 'assets/images/ash/run.png', {frameWidth: 16, frameHeight: 19});
        this.load.spritesheet('ash_ride', 'assets/images/ash/ride.png', {frameWidth: 20, frameHeight: 22});

        this.load.spritesheet('npc', 'assets/images/npc/NPCs.png', {frameWidth: 20, frameHeight: 23});

    }

    create() {

        var text = this.add.text(300, 350, '', { fontFamily: 'Arial', fontSize: 12, color: '#000000' }).setDepth(1).setScrollFactor(0);


        debugText = this.add.text(280, 200, "x 0 y 0", {fontFamily: 'Arial', fontSize: 12, color: '#ffff00'}).setDepth(1).setVisible(false).setScrollFactor(0);

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

        map.route1 = map.findObject("Objects", obj => obj.name === "Route 1");
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
            if ( player.direction !== "up") {
                return false;
            }
            map.letterbox.forEach(function (letterbox) {
                if (player.x >= letterbox.x && player.x < letterbox.x +20 && player.y >= letterbox.y && player.y < letterbox.y+30) {
                    text.text = letterbox.properties[0].value;
                    player.setActive(false).setMaxVelocity(0,0);
                }
            });

            map.sign.forEach(function (sign) {
                if (player.x >= sign.x && player.x < sign.x +20 && player.y >= sign.y && player.y < sign.y+30) {
                    text.text = sign.properties[0].value;
                    player.setActive(false).setMaxVelocity(0,0);
                }
            });



            setTimeout(function () {
                text.text = "";
                player.setActive(true).setMaxVelocity(999,999);
            },2000)


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


        debugText.text = 'x : '+Math.round(player.x)+' y :'+Math.round(player.y);
        if (player.x >= map.route1.x && player.x < map.route1.x + map.route1.width && player.y >= map.route1.y && player.y < map.route1.y + map.route1.height) {
            this.scene.start('Route1');
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

function findPlayer() {

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

function npcCollision() {
    playerCollision();
    this.pause();
    if (npc.collide === false) {
        var pn = this;
        npc.collide = true;
        setTimeout(function () {
            pn.resume();
            npc.collide = false;
        },1000)
    }
}

function playerCollision() {
    player.anims.stop();
}