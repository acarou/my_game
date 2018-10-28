var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade:  {
            gravity: 0,
            debug: true,
        }
    },
    scene: [  PalletTown  ]
};

var game = new Phaser.Game(config);