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
    scene: [Preload, PalletTown, HeroHouse, HeroHouse2F, OakHouse ,Route1, Fight, ViridianCity]
};
var game = new Phaser.Game(config);