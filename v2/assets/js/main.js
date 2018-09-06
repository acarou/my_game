var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 640,
    height: 512,
    physics: {
        default: 'arcade',
    },
    scene: [ Maps1]
};

var game = new Phaser.Game(config);