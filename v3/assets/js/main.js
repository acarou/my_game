var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: 0,
            debug: true,
        }
    },
    scene: [Preload, PalletTown, HeroHouse, HeroHouse2F, RivalHouse, OakHouse ,Route1, Fight, PokeCenter, ViridianCity]
};
var game = new Phaser.Game(config);