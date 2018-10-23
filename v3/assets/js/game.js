var player,moveKeys, cursors, debugText, map;

class Game extends Phaser.Scene {
    constructor() {
        super({key: "Game"});
    }

    preload() {
        this.load.image('pallet-town', 'assets/images/background/Pallet.gif');
        this.load.spritesheet('ash', 'assets/images/ash/walk.png', { frameWidth: 15, frameHeight: 19})

    }

    create() {
        this.add.image(0,0,'pallet-town').setOrigin(0);
        player = this.physics.add.sprite(200, 200, 'ash', 1).setCollideWorldBounds(true);
        this.cameras.main.setBounds(0, 0, 544, 432);
        this.physics.world.setBounds(0, 0, 544, 432);
        this.cameras.main.zoom = 3;
        this.cameras.main.startFollow(player);

        player.speedRate = 0.5;






        moveKeys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.Z,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.Q,
            'right': Phaser.Input.Keyboard.KeyCodes.D
        });

        this.input.on('keydown_A', function () {
            player.speedRate = 2;
        });

        cursors = this.input.keyboard.createCursorKeys();

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('ash', { start:9, end: 11}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('ash', { start: 6, end: 8}),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('ash', { start: 3, end: 5}),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('ash', { start: 0, end: 2}),
            frameRate: 10,
            repeat: -1,
        });
    }

    update(time, delta) {
        player.body.setVelocity(0);

        // Horizontal movement
        if (cursors.left.isDown)
        {
            player.body.setVelocityX(-80 * player.speedRate);
        }
        else if (cursors.right.isDown)
        {
            player.body.setVelocityX(80 * player.speedRate);
        }

        // Vertical movement
        if (cursors.up.isDown)
        {
            player.body.setVelocityY(-80 * player.speedRate);
        }
        else if (cursors.down.isDown)
        {
            player.body.setVelocityY(80 * player.speedRate);
        }

        if (cursors.left.isDown) {
            player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
            player.anims.play('right', true);
        }
        else if (cursors.up.isDown) {
            player.anims.play('up', true);
        }
        else if (cursors.down.isDown) {
            player.anims.play('down', true);
        }
        else {
            player.anims.stop();
        }

    }


}