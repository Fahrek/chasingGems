GamePlayManager = {

    init: function()
    {
        // Centramos y ajustamos la pantalla
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignVertically   = true;
        game.scale.pageAlignHorizontally = true;

        this.flagFirstMouseDown = false;
    },

    preload: function()
    {
        // Cargamos en memoria los objetos que se van a utilizar
        game.load.image("background", "assets/img/background.png");
        game.load.spritesheet('seahorse', 'assets/img/horse.png', 84, 156, 2);
    },

    create: function()
    {
        // Mostramos los objetos en pantalla
        game.add.sprite(0, 0, 'background');

        // Guardamos el caballo en una variable para poder trabajar con él
        this.seahorse = game.add.sprite(0, 0, 'seahorse');

        // Aquí le estamos diciendo que de la hoja de sprites utilice el segundo frame, según lista en base cero
        this.seahorse.frame = 1;

        // Aquí posicionamos el elemento en el centro de la pantalla respecto el eje X (Horizontal) e Y (Vertical)
        this.seahorse.x = game.width/2;
        this.seahorse.y = game.height/2;

        // Posicionamos el 'anchor' del elemento en el centro del caballo
        this.seahorse.anchor.setTo(0.5);

        //Capturar el primer click para activar el flag
        game.input.onDown.add(this.onTap, this)
    },

    onTap: function(){
        this.flagFirstMouseDown = true;
    },

    update: function()
    {
        if(this.flagFirstMouseDown)
        {
            // Trackeamos y guardamos en una variable las coordenadas X e Y de donde se encuentra nuestro mouse
            // en cada momento (en tiempo real)
            var pointerX = game.input.x;
            var pointerY = game.input.y;

            // Calculamos la distancia que hay entre el puntero del ratón y el caballo y luego lo guardamos en una variable
            var distX = pointerX - this.seahorse.x;
            var distY = pointerY - this.seahorse.y;

            // Si distX es mayor a 0 significa que nuestro ratón está a la derecha si no a la izquierda
            if(distX > 0){
                this.seahorse.scale.setTo(1, 1);
            } else {
                // Invertimos la orientación en el eje X (Horizontal)
                this.seahorse.scale.setTo(-1, 1);
            }

            // Aquí movemos nuestro caballo hacia la posición del mouse en un porcentaje determinado, para ello sumamos
            // la distancia del caballo respecto a la del mouse y le multiplicamos un porcentaje. El porcentaje supone
            // velocidad, a mayor número más rápido se mueve hacia el puntero el caballo
            this.seahorse.x += distX * 0.02;
            this.seahorse.y += distY * 0.02;
        }
    },
};

var game = new Phaser.Game(1136, 640, Phaser.CANVAS);

game.state.add('gameplay', GamePlayManager);
game.state.start('gameplay');