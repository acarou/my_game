var enemy,text,turn,finish;

class Fight extends Phaser.Scene{
    constructor() {
        super({ key: "Fight"})
    }

    create() {
        enemy = {hp: 40,attack: 5, name: "Wild"};
        finish = false;
        turn = true;


        this.physics.add.sprite(130,98, 'fight', Math.floor(Math.random() * Math.floor(9)));
        this.cameras.main.setBounds(0, 0, 259, 195);
        this.physics.world.setBounds(0, 0, 259, 195);
        this.cameras.main.zoom = 3.1;

        var pokemon = this.physics.add.sprite(75, 150, 'pokemonsBack', choice.frame);
        enemy.pokemon = this.physics.add.sprite(190, 90, 'pokemons', Math.floor(Math.random() * Math.floor(150)));

        text = this.add.text(20, 100, choice.name + ' hp : '+choice.hp, {
            fontFamily: 'Arial',
            fontSize: 12,
            color: '#000000'
        });

        enemy.text = this.add.text(150,40, 'hp: ',{
            fontFamily: 'Arial',
            fontSize: 12,
            color: '#000000'
        });

        this.input.keyboard.on('keydown_W', function (event) {

            if (turn) {
                enemy.hp -= choice.attack;
                if (enemy.hp <= 0) {
                    enemy.hp = 0;
                    finish = true;
                }
            } else {
                choice.hp -= enemy.attack;
                if (choice.hp <= 0 ) {
                    choice.hp = 0;
                    this.scene.stop("Route1");
                    exit = "SpawnPoint";
                    choice.hp = 40;
                    this.scene.start("HeroHouse2F");
                }
            }

            turn = !turn;

            if (finish) {
                this.scene.resume("Route1");
                this.scene.stop();
            }
        },this);
    }

    update() {

        text.text = choice.name + ' hp : '+choice.hp;
        enemy.text.text = enemy.name + ' hp : '+ enemy.hp
    }
}