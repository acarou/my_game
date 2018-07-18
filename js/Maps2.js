class Maps2 extends Phaser.Scene {
	constructor() {
		super({key: "Maps2" });
	}

	preload() {


	}
	create() {
		this.add.text(0,0,"Welcome to Example2", { front:"40px Impact"});

		this.input.keyboard.on('keyup_SPACE',function() {
			this.scene.start("Maps1");

		},this);
	}
}