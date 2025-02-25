class DropZone extends Tile {

    // Construye un objeto que representa visualmente la zona donde el jugador puede soltar una pieza que ingresa en el tablero de juego
    constructor(x, y, width, height, config, color, column, ctx) {
        super(x, y, width, height, 0, config, color, ctx);
        this.column = column;
        this.initialImageW = width / 3;
        this.initialImageH = height / 4;
        this.initialImageX = x + this.width / 2 - this.initialImageW / 2
        this.initialImageY = y + this.height / 4;
        this.imageX = this.initialImageX;
        this.imageY = this.initialImageY;
        this.imageW = this.initialImageW;
        this.imageH = this.initialImageH;
        this.range = 2;
        this.direction = -1;
        this.speed = 10;
    }

    // Verifica si el jugador actual posiciona el mouse sobre esta DropZone
    isHoveredWithFicha(mouse) {
        const compareX = mouse.x > this.x && mouse.x < this.x + this.width;
        const compareY = mouse.y > this.y && mouse.y < this.y + this.height;

        if (compareX && compareY) {
            this.highlight(true);
            return this;
        } else {
            return null;
        }
    }

    // Actualiza la posición de la pista que indica al jugador la hubicacion de esta DropZone
    update(deltaTime) {
        this.imageY += this.direction * this.speed * (deltaTime / 1000);
        if (this.imageY > this.initialImageY + this.range) {
            this.imageY = this.initialImageY + this.range;
            this.direction = -1;
        } else if (this.imageY < this.initialImageY - this.range) {
            this.imageY = this.initialImageY - this.range;
            this.direction = 1;
        }
    }

    // Dibuja esta DropZone de piezas en el tablero con su respectiva pista visual
    draw() {
        //this.ctx.fillStyle = this.color;
        //this.ctx.fillRect(this.x, this.y, this.width, this.height);
        this.ctx.drawImage(this.image, this.imageX, this.imageY, this.imageW, this.imageH);
    }

    // Carga la imagen que representa la pista visual de una zona de colocación de piezas en el tablero de juego
    initImage() {
        const image = new Image();
        image.src = './img/4enlinea/hint-off.png';
        return image;
    }

    // Devuelve la columna del tablero de juego a la cual pertenece esta DropZone
    getColumn() {
        return this.column;
    }

    // Destaca una esta DropZone en el tablero de juego
    highlight(on) {
        const size = on ? 2 : 1;
        const x = on ? 2 : 0;
        const color = on ? 'orange' : 'grey';
        const image = on ? './img/4enlinea/hint-on.png' : './img/4enlinea/hint-off.png'

        this.imageW = this.initialImageW * size;
        this.imageH = this.initialImageH * size;
        this.imageX = this.initialImageX - x;
        this.image.src = image;
        this.setColor(color);
    }
}