class GameState {
    // Construye un objeto que gestiona los elementos del juego y la interacción con el jugador en su turno
    constructor(config, ctx) {
        this.fichas = this.createFichas(config, ctx);
        this.board = new Board(config, ctx);
        this.mouse = { x: 0, y: 0 };
        this.selectedFicha = null;
        this.hoveredDropZone = null;
        this.playerOneTurn = true;
        this.ctx = ctx;
        this.player1Name = config['player1-name'];
        this.player2Name = config['player2-name'];
        this.startTime = 200;
        this.remainingTime = this.startTime;
        this.timerIsRunning = false;
        this.turnArrow = this.initArrow();
        this.initialArrowY = 20;
        this.arrowY = this.initialArrowY;
        this.range = 2;
        this.direction = -1;
        this.speed = 10;
    }

    // Crea la cantidad de fichas necesaria para cada jugador en una partida en particular
    createFichas(config, ctx) {
        const fichas = [];
        let num = config['board-rows'] * config['board-columns']
        num = (num + 1) / 2 | 0; // Se deshace de los decimales redondeando el resultado para arriba (Bitwise Operator)

        //deshardcodear las coordenadas pls
        for (let i = 0; i < num; i++) {
            fichas.push(new Ficha(73, 155 - (i * 3), config, 'blue', ctx));
            fichas.push(new Ficha(247, 155 - (i * 3), config, 'red', ctx));
        }

        return fichas;
    }

    // Actualiza el estado de la partida junto con sus elementos e indica si la partida debe continuar
    update(deltaTime) {
        const continueGame = this.board.update(deltaTime, this.mouse, this.selectedFicha != null);
        if (this.timerIsRunning) {
            this.remainingTime -= deltaTime / 1000;
            if (this.remainingTime <= 0) {
                this.remainingTime = 0;
                this.timerIsRunning = false;
                this.abort();
            }
        }
        this.fichas.forEach(obj => obj.update(deltaTime, this.mouse));
        this.updateArrow(deltaTime);
        return continueGame && this.timerIsRunning;
    }

    // Dibuja los elementos de la partida en el lienzo
    draw() {
        this.board.drawBackground();
        this.fichas.forEach(obj => obj.draw());
        this.board.draw();
        this.drawTurnArrow();
        this.drawTimer();
    }

    // Determina cuáles son las fichas seleccionables en un turno y las recorre hasta encontrar la que selecciona el jugador
    click() {
        const playableColor = this.playerOneTurn ? 'blue' : 'red';
        for (let ficha of this.fichas) {
            if (this.selectedFicha == null && ficha.getColor() == playableColor) {
                this.selectedFicha = ficha.checkClick(this.mouse, playableColor);
            }
        }
    }

    // Verifica dónde suelta el jugador la ficha seleccionada para determinar si se continúa con el siguiente turno
    mouseUp() {
        if (this.selectedFicha != null) {
            this.playerOneTurn = this.board.checkForHover(this.selectedFicha) ? !this.playerOneTurn : this.playerOneTurn;
            this.selectedFicha.setDragState(false);
            this.selectedFicha = null;
        }
    }

    //consulta el ganador a board y lo devuelve
    getWinner() {
        const color = this.board.getWinner();
        let name;

        switch (color) {
            case 'blue':
                name = this.player1Name;
                break;
            case 'red':
                name = this.player2Name;
                break;
            default:
                name = 'neither';
        }
        return name;
    }

    //aborta el juego
    abort() {
        this.restartTimer();
        this.board.abort();
    }

    //dibuja el timer
    drawTimer() {
        this.ctx.fillStyle = "yellow";
        this.ctx.font = "14px Simpsons";
        this.ctx.fillText(Math.ceil(this.remainingTime), 155, 15);
    }

    //reinicia el timer
    restartTimer() {
        this.remainingTime = this.startTime;
        this.timerIsRunning = true;
    }

    //actualiza la flecha que indica el turno
    updateArrow(deltaTime) {
        this.arrowY += this.direction * this.speed * (deltaTime / 1000);
        if (this.arrowY > this.initialArrowY + this.range) {
            this.arrowY = this.initialArrowY + this.range;
            this.direction = -1;
        } else if (this.arrowY < this.initialArrowY - this.range) {
            this.arrowY = this.initialArrowY - this.range;
            this.direction = 1;
        }
    }

    //dibuja la flecha que indica el turno
    drawTurnArrow() {
        let x = 20;

        if (!this.playerOneTurn) {
            x = 275;
        }

        this.ctx.drawImage(this.turnArrow, x, this.arrowY, this.turnArrow.width, this.turnArrow.height);
    }

    //inicializa el grafico de la flecha
    initArrow() {
        const arrow = new Image();
        arrow.src = './img/4enlinea/arrow.png';
        return arrow;
    }
}