var
    first = true;
    exit = false;

class Preload extends Phaser.Scene {
    constructor() {
        super({key: "Preload"})
    }

    preload() {
        /**
         * Pallet Town
         */
        this.load.image('pallet-town-tiles', 'assets/images/background/PalletTown/Kanto_Pallet_Town_Map_bank.png');
        this.load.tilemapTiledJSON('pallet-town-map', 'assets/images/background/PalletTown/Kanto_Pallet_Town_Map_map.json');

        /** intérior **/

       this.load.image('pallet-town-1F-tiles', 'assets/images/background/PalletTown/Interiors/Hero/1F_bank.png');
        this.load.tilemapTiledJSON('pallet-town-1F-map', 'assets/images/background/PalletTown/Interiors/Hero/1F_map.json');

        this.load.image('pallet-town-2F-tiles', 'assets/images/background/PalletTown/Interiors/Hero/2F_bank.png');
        //this.load.tilemapTiledJSON('pallet-town-2F-map', 'assets/images/background/PalletTown/Interiors/Hero/2F_map.json');



        this.load.audio('pallet-town-sound', 'assets/sounds/PalletTown.mp3');

        /**
         * Player
         */
        this.load.spritesheet('ash_walk', 'assets/images/ash/walk.png', {frameWidth: 15, frameHeight: 19});
        this.load.spritesheet('ash_run', 'assets/images/ash/run.png', {frameWidth: 16, frameHeight: 19});
        this.load.spritesheet('ash_ride', 'assets/images/ash/ride.png', {frameWidth: 20, frameHeight: 22});

        /**
         * Other
         */
        this.load.spritesheet('npc', 'assets/images/npc/NPCs.png', {frameWidth: 20, frameHeight: 23});
        this.load.image('pokeball', 'assets/images/pokeball.png');

        /**
         * Route1
         */
        this.load.image('route1-tiles', 'assets/images/background/Kanto_Route_1_Map_bank.png');
        this.load.tilemapTiledJSON('route1-map', 'assets/images/background/Kanto_Route_1_Map_map.json');
        this.load.audio('route1-sound', 'assets/sounds/Route1.mp3')

    }

    create() {
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

        this.scene.start("PalletTown")
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

function npcCollision() {
    playerCollision();
    this.pause();
    if (npc.collide === false) {
        var pn = this;
        npc.collide = true;
        setTimeout(function () {
            pn.resume();
            npc.collide = false;
        }, 1000)
    }
}

function playerCollision() {
    player.anims.stop();
}