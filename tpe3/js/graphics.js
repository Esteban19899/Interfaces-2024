class Graphics {
    // Construye un objeto que renderiza un entorno visual en el lienzo para acompañar la experiencia de juego
    constructor(config, ctx) {
        this.config = config;
        this.ctx = ctx;
        this.background = this.initBackground();
        this.bart = this.initBart();
        this.milhouse = this.initMilhouse();
        this.table = this.initTable();
    }

    // Carga la imagen de fondo del juego
    initBackground() {
        const background = new Image();
        background.src = './img/4enlinea/background.png';
        return background;
    }

    // Carga la imagen del jugador 1 (Bart)
    initBart() {
        const bart = new Image();
        bart.src = './img/4enlinea/bart.png';
        return bart;
    }

    // Carga la imagen del jugador 2 (Milhouse)
    initMilhouse() {
        const milhouse = new Image();
        milhouse.src = './img/4enlinea/milhouse.png';
        return milhouse;
    }

    // Carga la imagen de la mesa de juego
    initTable() {
        const table = new Image();
        table.src = './img/4enlinea/table.png';
        return table;
    }

    // Emplea el contexto del lienzo para dibujar las imágenes del juego
    draw() {
        this.ctx.drawImage(this.background, 0, 0, this.config['canvas-width'], this.config['canvas-height']);
        this.ctx.drawImage(this.bart, 260, 46, 55, 134);
        this.ctx.drawImage(this.milhouse, 0, 44, 63, 136);
        this.ctx.drawImage(this.table, 25, 140, 270, 40);
    }

    // Emplea el contexto del lienzo para dibujar un aviso de finalización de la partida actual
    showWinner(winnerColor) {
        const ctx = this.ctx;
        ctx.fillStyle = 'yellow';
        ctx.font = '36px Simpsons';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const centerX = this.config['canvas-width'] / 2;
        const centerY = this.config['canvas-height'] / 6;
        ctx.fillText(`¡${winnerColor} has won!`, centerX, centerY);
    }
}