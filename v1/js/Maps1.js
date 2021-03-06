let axe = 0;
let wood = 0;
let woodPerAction = 1;

class Maps1 extends Phaser.Scene {
	constructor() {
        super({ key: "Maps1" });
	}

	preload() {
        this.load.image('background', 'assets/images/background.png');
        this.load.image('woodIcon', 'assets/images/medievals/log_oak_2.png');
        this.load.image('bag', 'assets/images/medievals/bag.png');
        this.load.spritesheet('skeleton','assets/images/skeleton.png', { frameWidth: 32, frameHeight: 48});
        this.load.spritesheet('axes', 'assets/images/axe.png', { frameWidth: 128, frameHeight: 128, endFrame: 50 });
	}

    create() {
        this.impact.world.setBounds(75, 15, 650, 485);

        this.add.image(80, 20, 'background').setOrigin(0);
        this.add.image(10, 510, 'woodIcon').setOrigin(0);

        /**
		 *
		 * create text part
         *
         */
        this.debugText = this.add.text(10,485,'x: y :', { fontSize: '12px', fill: '#fff' }).setVisible(false);
        this.inventory = this.add.text(120, 550, '', { fontSize: '18px', fill: '#fff' });

        /**
		 * end text part
         */

        /**
         *
         *  create axe part
         *
         */
        this.axes = this.textures.get('axes').getFrameNames();
        let y = 175;
        for (let i = 0; i < 6; i++) {
            let axes = this.add.image(y, 550, 'axes', Phaser.Math.RND.pick(this.axes,true)).setDisplaySize(64, 64).setInteractive();
            y+= 50;

            axes.on('pointerdown', function () {
            	this.setTint(0xffff);
            	axe = i;
            	woodPerAction = getAxe(i);
            });
            axes.on('pointerup', function () {
            	this.setTint(0xff0000);
            });

            axes.on('pointerover', function () {
                this.setTint(0xff0000);
            });

            axes.on('pointerout', function () {
                this.clearTint();
            });
        }

        /**
         *  end axe part
         */



        /**
         *
         *  create bag part
         *
         */

        this.bag = this.add.image(670, 500, 'bag').setOrigin(0).setInteractive();

		this.bag.on('pointerover', function(){
			this.setTint(0xdfbf64)
		});
		this.bag.on('pointerout', function(){
			this.clearTint();
		});

		this.bag.on('pointerdown', function(){
            this.setTint(0xf0f0f0);
        });

		this.bag.on('pointerup', function(){
			this.setTint(0xdfbf64);
		});

        /**
         *  end create bag part
         */


        /**
		 *
		 *  create skeleton (player) part
		 *
         */

        this.cursors = this.input.keyboard.createCursorKeys();

        this.moveKeys = this.input.keyboard.addKeys({
            'up': Phaser.Input.Keyboard.KeyCodes.Z,
            'down': Phaser.Input.Keyboard.KeyCodes.S,
            'left': Phaser.Input.Keyboard.KeyCodes.Q,
            'right': Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.skeleton = this.impact.add.sprite(200, 200, 'skeleton').setMaxVelocity(1000).setActiveCollision();

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

        /**
		 * end skeleton part
         */

        /**
         *
         * create some control
         *
         */
        this.input.keyboard.on('keyup_SPACE', function () {
            if (this.skeleton.x >= 170 && this.skeleton.x <= 240 && this.skeleton.y >= 130 && this.skeleton.y <= 165) {
                wood += woodPerAction;
            }
        }, this);

        this.input.keyboard.on('keydown_A',function() {
            if (this.debugText.visible) {
                this.debugText.setVisible(false);
            }
            else {
                this.debugText.setVisible(true);
            }
        },this);

        this.input.keyboard.on('keydown_R',function() {
			wood = 0;
        },this);

        /**
         * end control
         */
	}

	update() {

        this.debugText.setText('x : ' + Math.floor(this.skeleton.x + 0.5) + ' y : ' + Math.floor(this.skeleton.y) + '\naxe : ' + axe + '\nwood_per_action : '+ woodPerAction);

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
		}

		if (Math.floor(this.skeleton.x) === 709 && Math.floor(this.skeleton.y) === 275)
		{
			this.scene.start("Maps2");
		}
	}

	destroy() {
		console.log('toto');
	}
}


function getAxe(axeLevel) {
	let woodPerAction;
	switch (axeLevel) {
		case 0:
			woodPerAction = 1;
			break;
		case 1:
            woodPerAction = 2;
			break;
		case 2:
            woodPerAction = 4;
			break;
		case 3:
            woodPerAction = 8;
			break;
		case 4:
            woodPerAction = 16;
			break;
		case 5:
            woodPerAction = 32;
			break;
	}
	return woodPerAction;
}

function buyAxe(axeLevel,wood) {

    let woodPerAction;
    switch (axeLevel) {
        case 0:
            woodPerAction = 1;
            break;
        case 1:
            woodPerAction = 2;
            break;
        case 2:
            woodPerAction = 4;
            break;
        case 3:
            woodPerAction = 8;
            break;
        case 4:
            woodPerAction = 16;
            break;
        case 5:
            woodPerAction = 32;
            break;
    }
    return woodPerAction;

}