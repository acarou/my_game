let config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'impact',
		impact: {
			setBounds: {
			x: 0,
			y:0,
			width: 640,
			height: 480,
			}
		}
	},
	scene: [ Maps1, Maps2]
};
let game = new Phaser.Game(config);
