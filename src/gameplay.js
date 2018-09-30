var AMOUNT_GEMS = 30;  // Variable Global, número de gemas en pantalla
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
        game.add.sprite(0, 0, 'background');  // Mostramos los objetos en pantalla
        this.seahorse = game.add.sprite(0, 0, 'seahorse');  // Guardamos el caballo en una variable para poder trabajar con él
        this.seahorse.frame = 1;  // Aquí le estamos diciendo que de la hoja de sprites utilice el segundo frame, según lista en base cero
        this.seahorse.x = game.width/2;  // Aquí posicionamos el elemento en el centro de la pantalla respecto el eje X (Horizontal) e Y (Vertical)
        this.seahorse.y = game.height/2;
        this.seahorse.anchor.setTo(0.5);  // Posicionamos el 'anchor' del elemento en el centro del caballo
        game.input.onDown.add(this.onTap, this); //Capturar el primer click del mouse sobre la pantalla para activar el hito (flag)
        this.gems = []; //Creamos las gemas y las guardamos en un array
        for (var i = 0; i < AMOUNT_GEMS; i++)
        {
            var gem = game.add.sprite(100, 100, 'gems');
            gem.frame = game.rnd.integerInRange(0, 3);  // Para darle una imagen al azar entre el frame 1 y el 4 del que está constituido la hoja de sprites
            gem.scale.setTo(0.30 + game.rnd.frac());  // Aleatorizar el tamaño de las gemas
            gem.anchor.setTo(0.5);  // Situar el ancla en el centro de la gema
            gem.x = game.rnd.integerInRange(50, 1050);  // Valor al azar para las coordenadas X e Y
            gem.y = game.rnd.integerInRange(50, 600);
            this.gems[i] = gem;  // Guardamos en nuestro array el elemento gema nuevo
            var rectCurrentGem = this.getBoundsGem(gem);  // Guardamos en variable el rectangulo de la gema creada
            var rectSeahorse = this.getBoundsGem(this.seahorse);  // Guardamos en variable el rectangulo del caballo
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
            var rect1 = this.getBoundsGem(this.gems[i]);  // Almacenamos la posicion del rectangulo existente en pantalla
            if(this.isRectanglesOverlapping(rect1, rect2))  // Ahora comprobamos si se sobrepone la gema nueva con la antigua
            {
                return true;
            }
        }
        return false;
    },
    getBoundsHorse: function()
    {
        // Obtenemos la coordenada X menos la mitad de su ancho (left)
        // Tampoco permitimos que la orientación de caballo se invierta, para ello usamos el metodo absoluto para
        // impedir números negativos en el ancho
        var x0 = this.seahorse.x - Math.abs(this.seahorse.width/2);
        var width = Math.abs(this.seahorse.width)/2;  // Para mejorar la precision de la colision dividimos entre 2, la mitad
        var y0 = this.seahorse.y - this.seahorse.height/2;  // Obtenemos la coordenada Y menos la mitad de su alto (top)
        var height = this.seahorse.height;
        return new Phaser.Rectangle(x0, y0, width, height);  // Devolvemos el rectangulo
    },
    render: function()
    {
        game.debug.spriteBounds(this.horse);  // Funcion para debuggear
        for(var i = 0; i < AMOUNT_GEMS; i++)
        {
            game.debug.spriteBounds(this.gems[i]);
        }
    },
    update: function()
    {
        if(this.flagFirstMouseDown)
        {
            // Trackeamos y guardamos en una variable las coordenadas X e Y de donde se encuentra nuestro mouse en cada
            // momento (en tiempo real)
            var pointerX = game.input.x;
            var pointerY = game.input.y;
            // Calculamos la distancia que hay entre el puntero del ratón y el caballo y luego lo guardamos en una variable
            var distX = pointerX - this.seahorse.x;
            var distY = pointerY - this.seahorse.y;
            if(distX > 0)  // Si distX es mayor a 0 significa que nuestro ratón está a la derecha si no a la izquierda
            {
                this.seahorse.scale.setTo(1, 1);
            } else {
                this.seahorse.scale.setTo(-1, 1);  // Invertimos la orientación en el eje X (Horizontal)
            }
            // Aquí movemos nuestro caballo hacia la posición del mouse en un porcentaje determinado, para ello sumamos
            // la distancia del caballo respecto a la del mouse y le multiplicamos un porcentaje. El porcentaje supone
            // velocidad, a mayor número más rápido se mueve hacia el puntero el caballo
            this.seahorse.x += distX * 0.02;
            this.seahorse.y += distY * 0.02;
            for(var i = 0; i < AMOUNT_GEMS; i++)  // Verificamos si nuestro caballo colisiona con alguno de nuestros diamantes
            {
                var rectSeahorse = this.getBoundsHorse();  //Recuperamos el rectangulo del caballo y de la gema y ver sí están colisionando
                var rectGem = this.getBoundsGem(this.gems[i]);
                if(this.isRectanglesOverlapping(rectSeahorse, rectGem))  // Verificamos si los 2 rectangulos anteriores colisionan
                {
                    console.log('COLISION');
                }
            }
        }
    },
};
var game = new Phaser.Game(1136, 640, Phaser.CANVAS);
game.state.add('gameplay', GamePlayManager);
game.state.start('gameplay');
