var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: 0,
            debug: false,
        }
    },
    scene: [Preload, PalletTown, HeroHouse ,Route1]
};
var game = new Phaser.Game(config);