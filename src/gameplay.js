// Variable Global, número de gemas en pantalla
var AMOUNT_GEMS = 30;

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
        game.load.image('background', 'assets/img/background.png');
        game.load.spritesheet('seahorse', 'assets/img/horse.png', 84, 156, 2);
        game.load.spritesheet('gems', 'assets/img/diamonds.png', 81, 84, 4);
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

        //Capturar el primer click del mouse sobre la pantalla para activar el hito (flag)
        game.input.onDown.add(this.onTap, this);

        //Creamos las gemas y las guardamos en un array
        this.gems = [];
        for (var i = 0; i < AMOUNT_GEMS; i++)
        {
            var gem = game.add.sprite(100, 100, 'gems');
            // Para darle una imagen al azar entre el frame 1 y el 4 del que está constituido la hoja de sprites
            gem.frame = game.rnd.integerInRange(0, 3);
            // Aleatorizar el tamaño de las gemas
            gem.scale.setTo(0.30 + game.rnd.frac());
            // Situar el ancla en el centro de la gema
            gem.anchor.setTo(0.5);
            // Valor al azar para las coordenadas X e Y
            gem.x = game.rnd.integerInRange(50, 1050);
            gem.y = game.rnd.integerInRange(50, 600);

            // Guardamos en nuestro array el elemento gema nuevo
            this.gems[i] = gem;
            // Guardamos en variable el rectangulo de la gema creada
            var rectCurrentGem = this.getBoundsGem(gem);
            // Guardamos en variable el rectangulo del caballo
            var rectSeahorse = this.getBoundsGem(this.seahorse);
            // Mientras sí exista una superposcion entre gemas nuevas y existentes cambiamos las coordenadas de las primeras
            // para que no coincidas en el espacio con las segundas. También preguntamos si colisionan las gemas con el caballo
            while(this.isOverlappingNewGem(i, rectCurrentGem)
                  || this.isRectanglesOverlapping(rectSeahorse, rectCurrentGem))
            {
                gem.x = game.rnd.integerInRange(50, 1050);
                gem.y = game.rnd.integerInRange(50, 600);
                // Calculamos de nuevo las dimensiones del rectangulo con unas coordenadas que no esten ocupadas por la
                // posicion de una gema existente
                rectCurrentGem = this.getBoundsGem(gem);
            }
        }
    },

    onTap: function()
    {
        this.flagFirstMouseDown = true;
    },

    // Para evitar que se superpongan las gemas unas encima de las otras:
    // Una funcion que envie un sprite de una gema y devuelva coordenadas que está ocupando el rectangulo donde
    // la gema esta ubicadoa en la pantalla
    getBoundsGem: function(currentGem)
    {
        return new Phaser.Rectangle(currentGem.left, currentGem.top, currentGem.width, currentGem.height);
    },

    // Otra función en la que le pasaremos 2 parametros de 2 gemas diferentes y nos va indicar si estan superpuestos o no
    isRectanglesOverlapping: function(rect1, rect2)
    {
      if(rect1.x > rect2.x + rect2.width || rect2.x > rect1.x + rect1.width)
      {
          return false;
      }
        else if (rect1.y > rect2.y + rect2.height || rect2.y > rect1.y + rect1.height)
      {
          return false;
      }
      return true;
    },

    // Verificamos si al generar gemas nuevas estas colisionan con las anteriores, y de ser así cambiamos las coordenadas.
    // Index es el indice de la posicion en el array de la nueva gema que estamos creando y su rectangulo (rect2) se
    // comparan contra la lista de gemas existentes en pantalla, para ello compararemos estos valores recorriendo uno a
    // uno mediante un ciclo for
    isOverlappingNewGem: function(index, rect2)
    {
        for(var i = 0; i < index; i++)
        {
            // Almacenamos la posicion del rectangulo existente en pantalla
            var rect1 = this.getBoundsGem(this.gems[i]);
            // Ahora comprobamos si se sobrepone la gema nueva con la antigua
            if(this.isRectanglesOverlapping(rect1, rect2))
            {
                return true;
            }
        }
        return false;
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
