class Tile {

    // Construye un objeto que representa una casilla específica del tablero de juego y gestiona la lógica de su contenido
    constructor(x, y, width, height, borderType, config, color, ctx) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.ctx = ctx;
        this.ficha = null;
        this.image = this.initImage();
        this.hasBorder = false;
        if (borderType != 0) {
            this.hasBorder = true;
            this.border = this.initBorder(borderType, config);
        }
    }

    // Dibuja una casilla específica del tablero de juego en el lienzo
    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        if (this.hasBorder) {
            this.ctx.drawImage(this.border, this.borderX, this.y, this.borderW, this.borderH);
        }
        /*         this.ctx.fillStyle = this.color;
                    this.ctx.fillRect(this.x, this.y, this.width, this.height); */
    }

    // Carga la imagen que representa una casilla del tablero de juego
    initImage() {
        const image = new Image();
        image.src = './img/4enlinea/wood.png';
        return image;
    }

    // Carga el borde correspondiente a esta casilla y sus propiedades
    initBorder(type, config) {
        const image = new Image();
        const random = Math.floor(Math.random() * 3) + 1;
        image.src = `./img/4enlinea/wood${random}.png`;
        this.borderW = config[`border${random}-W`];
        this.borderH = config[`border${random}-H`];
        if (type == -1) {
            this.borderX = this.x + type * this.borderW - type * 2;
        } else {
            this.borderX = this.x + type * this.width - type * 2;
        }
        this.borderY = this.y - (this.borderH - this.height);
        return image;
    }

    // Actualiza el color de una casilla específica del tablero de juego 
    setColor(color) {
        this.color = color;
    }

    // Recibe una pieza, que está ingresando a una columna determinada del tablero de juego, en una casilla específica de la misma
    setFicha(ficha, onComplete) {
        this.ficha = ficha;
        ficha.fall(this.x + this.width / 2, this.y + this.height / 2, onComplete);
    }

    // Devuelve el contenido de una casilla específica del tablero de juego
    getFicha() {
        return this.ficha;
    }
}