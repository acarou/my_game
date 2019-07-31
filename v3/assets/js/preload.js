var
    exit = "SpawnPoint",
    choice = false;
var starter = [
    {name: "Bulbizarre", choice: false, frame: 0, attack: 5, hp: 50, maxHP: 50},
    {name: "Salaméche", choice: false, frame: 85, attack: 10, hp: 40, maxHP: 40},
    {name: "Carapuce", choice: false, frame: 118, attack: 15, hp: 30, maxHP: 30},
];

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

        //Hero
        this.load.image('pallet-town-hero-1F-tiles', 'assets/images/background/PalletTown/Interiors/Hero/1F_bank.png');
        this.load.tilemapTiledJSON('pallet-town-hero-1F-map', 'assets/images/background/PalletTown/Interiors/Hero/1F_map.json');

        this.load.image('pallet-town-hero-2F-tiles', 'assets/images/background/PalletTown/Interiors/Hero/2F_bank.png');
        this.load.tilemapTiledJSON('pallet-town-hero-2F-map', 'assets/images/background/PalletTown/Interiors/Hero/2F_map.json');

        //Rival
        this.load.image('pallet-town-rival-1F-tiles', 'assets/images/background/PalletTown/Interiors/Rival/1F_bank.png');
        this.load.tilemapTiledJSON('pallet-town-rival-1F-map', 'assets/images/background/PalletTown/Interiors/Rival/1F_map.json');

        //OAK
        this.load.image('pallet-town-oak-1F-tiles', 'assets/images/background/PalletTown/Interiors/OAK/1F_bank.png');
        this.load.tilemapTiledJSON('pallet-town-oak-1F-map', 'assets/images/background/PalletTown/Interiors/OAK/1F_map.json');


        this.load.audio('pallet-town-sound', 'assets/sounds/PalletTown.mp3');

        /**
         * Viridian City
         */

        this.load.image('viridian-city-tiles', 'assets/images/background/ViridianCity/ViridianCity_bank.png');
        this.load.tilemapTiledJSON('viridian-city-map', 'assets/images/background/ViridianCity/ViridianCity_map.json');

        this.load.audio('viridian-city-sound', 'assets/sounds/ViridianCity.mp3');

        /** Interior **/

        //PokeCenter

        this.load.image('poke-center-tiles', 'assets/images/background/PokeCenter/PokeCenter_bank.png');
        this.load.tilemapTiledJSON('poke-center-map', 'assets/images/background/PokeCenter/PokeCenter_map.json');

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
        this.load.spritesheet('pokemons', 'assets/images/pokemon/16x10.png', {frameWidth: 64, frameHeight: 64});
        this.load.spritesheet('pokemonsBack', 'assets/images/pokemon/back/16x10.png', {
            frameWidth: 64,
            frameHeight: 64
        });

        this.load.audio('battle', 'assets/sounds/Battle.mp3');


        /**
         * Route1
         */
        this.load.image('route1-tiles', 'assets/images/background/Kanto_Route_1_Map_bank.png');
        this.load.tilemapTiledJSON('route1-map', 'assets/images/background/Kanto_Route_1_Map_map.json');
        this.load.audio('route1-sound', 'assets/sounds/Route1.mp3');

        /**
         * Fight
         */
        this.load.spritesheet('fight', 'assets/images/background/fight.png', {frameWidth: 259, frameHeight: 147})

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

        let info = loadPlayer();
        if (info) {
            console.log(info.scene);
            exit = info.exit;
            starter = info.starter;
            choice = info.choice;
            console.log(info.starter);
            this.scene.start(info.scene)
        } else {
            this.scene.start("HeroHouse2F");
        }
    }
}

function drawDebug() {
    debugGraphics.clear();

    if (showDebug) {
        debugText.setVisible(true);
        // Pass in null for any of the style options to disable drawing that component
        map.renderDebug(debugGraphics, {
            tileColor: null, // Non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 200), // Colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Colliding face edges
        });
    } else {
        debugText.setVisible(false);
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

function getFaces(ObjectA, ObjectB, XMargin = 0, YBottomMargin = 0) {
    var CenterA = ObjectA.getCenter();
    var CenterB = typeof ObjectB.getCenter === 'function' ? ObjectB.getCenter() : {
        x: ObjectB.x + (ObjectB.width / 2),
        y: ObjectB.y + (ObjectB.height / 2)
    };

    if (CenterA.x >= (CenterB.x - (ObjectB.width / 2)) - XMargin && CenterA.x <= (CenterB.x + (ObjectB.width / 2)) + 4 + XMargin) {
        if (CenterA.y >= CenterB.y - (ObjectB.height / 2) && CenterA.y < CenterB.y + (ObjectB.height / 2 + YBottomMargin)) {
            return true;
        }
    }
}

function savePlayer(exit, starter, scene) {
    /**
     * Spawn point , starter
     */

    localStorage.setItem('spawnPoint', exit);
    localStorage.setItem('starter', JSON.stringify(starter));
    localStorage.setItem('scene', scene);
    localStorage.setItem('choice', choice);

}

function loadPlayer() {
    let info = [];

    if (localStorage.getItem('spawnPoint') && localStorage.getItem('starter') && localStorage.getItem('scene')) {
        info.exit = localStorage.getItem('spawnPoint');
        info.starter = JSON.parse(localStorage.getItem('starter'));
        info.scene = localStorage.getItem('scene');
        info.choice = localStorage.getItem('choice');
        return info;
    } else {
        return false;
    }

}