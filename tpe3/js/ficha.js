class Ficha {
    // Construye un objeto que encapsula toda la lógica de interacción y representación visual de una pieza en el juego
    constructor(x, y, config, color, ctx) {
        this.config = config;
        this.r = config["ficha-radio"];
        this.restingX = x;
        this.restingY = y;
        this.x = this.restingX;
        this.y = this.restingY;
        this.color = color;
        this.ctx = ctx;
        this.selectable = true;
        this.dragged = false;
        this.falling = false;
        this.image = this.initImage();
        this.speed = 0;
        this.acc = 555;
        this.tileY = 0;
    }

    // Emplea el contexto del lienzo para dibujar las piezas del juego de acuerdo a su estado particular
    draw() {
        if (this.dragged || !this.selectable) {
            this.ctx.drawImage(this.image, this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
            /*          
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.closePath();
            */
        } else {
            this.ctx.drawImage(this.image, this.x - this.r, this.y - this.r, this.r * 2, this.r);
            /*              
            this.ctx.beginPath();
            this.ctx.ellipse(this.x, this.y, this.r, this.r / 2, 0, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.stroke(); 
            */
        }
    }

    // Actualiza la posición de una pieza que está siendo arrastrada en el lienzo
    update(deltaTime, mouse) {
        if (this.dragged) {
            this.setPos(mouse.x, mouse.y);
        }
        if (this.falling) {
            this.speed += this.acc * (deltaTime / 1000);
            this.y += this.speed * (deltaTime / 1000);
            this.setPos(this.x, this.y);
            if (this.y >= this.tileY) {
                this.setPos(this.x, this.tileY);
                this.falling = false;
            }
        }
    }

    //inicializa la imagen de la ficha
    initImage() {
        const image = new Image();
        if (this.color == 'blue') {
            image.src = this.config['player1-img'];
        } else {
            image.src = this.config['player2-img'];
        }

        return image;
    }

    // Determina la posición final que adoptará una pieza que ingresa al tablero del juego
    fall(x, y, onComplete) {
        this.falling = true;
        this.x = x;
        this.tileY = y;
        setTimeout(() => {
            this.falling = false;
            onComplete && onComplete();
        }, 1000);
    }

    // Resetea a la posición inicial a una pieza que no ingresa al tablero del juego
    resetPos() {
        this.x = this.restingX;
        this.y = this.restingY;
    }

    // Actualiza la posición de una pieza
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }

    // Devuelve una pieza específica que puede ser seleccionada cuando el jugador hace click sobre ella
    checkClick(mouse) {
        const distance = Math.sqrt((mouse.x - this.x) ** 2 + (mouse.y - this.y) ** 2);
        this.setDragState(distance <= this.r && this.selectable);
        return this.dragged ? this : null;
    }

    // Devuelve la posición actual de una pieza
    getPos() {
        return { x: this.x, y: this.y }
    }

    // Modifica el estado de una pieza específica para determinar si la misma está siendo arrastrada
    setDragState(state) {
        this.dragged = state;
    }

    // Modifica el estado de una pieza que ingreso al tablero para evitar que sea retirada
    discard() {
        this.selectable = false;
    }

    // Devuelve el color de una pieza
    getColor() {
        return this.color;
    }
}