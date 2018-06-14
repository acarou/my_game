var axe = 0;
var wood = 0
var woodPerAction = 1;

class Maps1 extends Phaser.Scene {
	constructor() {
        super({ key: "Maps1" });
	}

	preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('woodIcon', 'assets/images/wood.png');
		this.load.spritesheet('skeleton','assets/images/skeleton.png', { frameWidth: 32, frameHeight: 48});
        this.load.spritesheet('bullets', 'assets/images/fire.png', { frameWidth: 21, frameHeight: 18 });
        this.load.spritesheet('axes', 'assets/images/axe.png', { frameWidth: 128, frameHeight: 128, endFrame: 50 });

        
	}

    create() {
        this.impact.world.setBounds(75, 15, 650, 485);
        //this.cameras.main.setBounds(0,0, 715, 500);
        this.add.image(80, 20, 'background').setOrigin(0);
        this.add.image(10, 510, 'woodIcon').setOrigin(0).setDisplaySize(63, 46.25);


        this.axes = this.textures.get('axes').getFrameNames();
        var y = 175;
        for (var i = 0; i < 6; i++) {
            var axes = this.add.image(y, 550, 'axes', Phaser.Math.RND.pick(this.axes,true)).setDisplaySize(64, 64).setInteractive();

            this.input.setDraggable(axes);
            y+= 50

        }

        this.skeleton = this.impact.add.sprite(200, 200, 'skeleton').setMaxVelocity(1000).setActiveCollision();

		this.cursors = this.input.keyboard.createCursorKeys();

		this.debugText = this.add.text(10,485,'x: y :', { fontSize: '12px', fill: '#fff' }).setVisible(false);

        this.inventory = this.add.text(90, 520, '', { fontSize: '18px', fill: '#fff' });

		this.input.on('pointerdown',function(event) {

		},this);


		this.moveKeys = this.input.keyboard.addKeys({
			'up': Phaser.Input.Keyboard.KeyCodes.Z,
			'down': Phaser.Input.Keyboard.KeyCodes.S,
			'left': Phaser.Input.Keyboard.KeyCodes.Q,
			'right': Phaser.Input.Keyboard.KeyCodes.D,

		});


        this.input.keyboard.on('keyup_SPACE', function (event) {
            if (this.skeleton.x >= 100 && this.skeleton.x <= 170 && this.skeleton.y >= 110 && this.skeleton.y <= 160) {
                wood += woodPerAction;
            }
        }, this);

		this.input.keyboard.on('keydown_A',function(event) {
			if (this.debugText.visible) {
				this.debugText.setVisible(false);
			}
			else {
				this.debugText.setVisible(true);
			}
		},this);

		this.anims.create({
			key: 'stop',
			frames: [ { key: 'skeleton', frame: 0 } ],
			frameRate: 20,
		});

		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers('skeleton', { start:4, end: 7}),
			frameRate: 10,
		});

		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers('skeleton', { start: 8, end: 11 }),
			frameRate: 10,
		});

		this.anims.create({
			key: 'up',
			frames: this.anims.generateFrameNumbers('skeleton', { start: 12, end: 15 }),
			frameRate: 10,
		});

		this.anims.create({
			key: 'down',
			frames: this.anims.generateFrameNumbers('skeleton', { start: 0, end: 3 }),
			frameRate: 10,
        });

        this.input.on('pointerdown', function (event, gameObjects) {
        });

        this.input.on('pointerover', function (event, gameObjects) {
            gameObjects[0].setTint(0xff0000);

        });

        this.input.on('pointerout', function (event, gameObjects) {

            gameObjects[0].clearTint();

        });
	}

	update() {

        this.debugText.setText('x : ' + Math.floor(this.skeleton.x + 0.5) + ' y : ' + Math.floor(this.skeleton.y) + '\naxe : '+axe);

        this.inventory.setText(wood);




		if (this.cursors.left.isDown && this.cursors.down.isDown)
		{
			this.skeleton.setVelocityY(80);
			this.skeleton.setVelocityX(-80);
			this.skeleton.anims.play('left', true);
		}
		else if (this.moveKeys['left'].isDown && this.moveKeys['down'].isDown)
		{
			this.skeleton.setVelocityY(80);
			this.skeleton.setVelocityX(-80);
			this.skeleton.anims.play('left', true);
		}
		else if (this.cursors.left.isDown && this.cursors.up.isDown)
		{
			this.skeleton.setVelocityY(-80);
			this.skeleton.setVelocityX(-80);
			this.skeleton.anims.play('left', true);
		}
		else if (this.moveKeys['left'].isDown && this.moveKeys['up'].isDown)
		{
			this.skeleton.setVelocityY(-80);
			this.skeleton.setVelocityX(-80);
			this.skeleton.anims.play('left', true);
		}
		else if (this.cursors.left.isDown || this.moveKeys['left'].isDown)
		{
			this.skeleton.setVelocityY(0);
			this.skeleton.setVelocityX(-160);
			this.skeleton.anims.play('left', true);
		}

		else if (this.cursors.right.isDown && this.cursors.down.isDown)
		{
			this.skeleton.setVelocityY(80);
			this.skeleton.setVelocityX(80);
			this.skeleton.anims.play('right', true);
		}
				else if (this.moveKeys['right'].isDown && this.moveKeys['down'].isDown)
		{
			this.skeleton.setVelocityY(80);
			this.skeleton.setVelocityX(80);
			this.skeleton.anims.play('right', true);
		}
		else if (this.cursors.right.isDown && this.cursors.up.isDown)
		{
			this.skeleton.setVelocityY(-80);
			this.skeleton.setVelocityX(80);
			this.skeleton.anims.play('right', true);
		}
		else if (this.moveKeys['right'].isDown && this.moveKeys['up'].isDown)
		{
			this.skeleton.setVelocityY(-80);
			this.skeleton.setVelocityX(80);
			this.skeleton.anims.play('right', true);
		}
		else if (this.cursors.right.isDown || this.moveKeys['right'].isDown)
		{
			this.skeleton.setVelocityY(0);
			this.skeleton.setVelocityX(160);
			this.skeleton.anims.play('right', true);
		}

		else if (this.cursors.up.isDown || this.moveKeys['up'].isDown)
		{
			this.skeleton.setVelocityX(0);
			this.skeleton.setVelocityY(-160);
			this.skeleton.anims.play('up', true);
		}
		else if (this.cursors.down.isDown || this.moveKeys['down'].isDown)
		{
			this.skeleton.setVelocityX(0);
			this.skeleton.setVelocityY(160);
			this.skeleton.anims.play('down', true);
		}
		else
		{
			this.skeleton.setVelocityX(0);
			this.skeleton.setVelocityY(0);
			this.skeleton.anims.stopOnRepeat();
		}

		if (Math.floor(this.skeleton.x) == 624 && Math.floor(this.skeleton.y) == 258) 
		{
			this.scene.start("Maps2");
		}
	}
}
