GamePlayManager = {
    init: function()
    {
        //Centramos y ajustamos la pantalla
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignVertically   = true;
        game.scale.pageAlignHorizontally = true;
    },
    preload: function()
    {
        // Cargamos los objetos
        game.load.image("background", "assets/img/background.png");
        game.load.spritesheet('seahorse', 'assets/img/horse.png', 84, 156, 2);
    },
    create: function()
    {
        // Mostramos los objetos en pantalla
        game.add.sprite(0, 0, 'background');
        // Guardamos la instancia del caballo en una variable para poder trabajar
        this.seahorse = game.add.sprite(0, 0, 'seahorse');
        // Aquí le estamos diciendo que de la hoja de sprites utilice el segundo frame según lista en base cero
        this.seahorse.frame = 1;
        // Aquí posicionamos el elemento en el centro de la pantalla respecto el eje X (Horizontal) e Y (Vertical)
        this.seahorse.x = game.width/2;
        this.seahorse.y = game.height/2;
        // Poscionamos el 'anchor' del elemento en el centro del mismo

    },
    update: function()
    {
        console.log('update');
    },
};

var game = new Phaser.Game(1136, 640, Phaser.CANVAS);

game.state.add('gameplay', GamePlayManager);
game.state.start('gameplay');