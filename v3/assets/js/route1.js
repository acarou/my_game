var map;


class Route1 extends Phaser.Scene {
    constructor() {
        super({ key: "Route1"});
    }

    preload() {
        this.load.image('tiles', 'assets/images/background/Kanto_Route_1_Map_bank.png');
        this.load.tilemapTiledJSON('map', 'assets/images/background/Kanto_Route_1_Map_map.json');

    }

    create() {

        map = this.make.tilemap({key: 'map'});

        var tileset = map.addTilesetImage('Kanto_Route_1_Map_bank.png', "tiles");

        var layer = map.createStaticLayer("World", tileset, 0, 0);

        map.setCollisionByProperty({collides: true});


    }

    update() {

    }
}