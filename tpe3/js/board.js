class Board {
    // Construye un objeto que representa los sucesos que se desarrollan en el tablero de juego y la lógica de verificación de victorias
    constructor(config, ctx) {
        this.config = config;
        this.rows = config['board-rows'];
        this.columns = config['board-columns'];
        this.tileWidth = config['tile-width'];
        this.tileHeight = config['tile-height'];
        this.tileSpacing = config['tile-spacing'];
        let boardsize = ((this.tileWidth + this.tileSpacing) * this.columns) - this.tileSpacing;
        this.boardX = (config['canvas-width'] - boardsize) / 2;
        this.boardY = this.config['canvas-height'] - (this.rows + 1) * this.tileHeight - this.config['board-y'];
        this.matrix = Array.from({ length: this.columns }, () => Array(this.rows));
        this.dropZones = [];
        this.hoveredDropZone = null;
        this.winner = null;
        this.ctx = ctx;
        this.fill();
        this.background = this.initBackground();
    }

    // Dibuja las zonas válidas para la caída de fichas y el tablero de juego en el lienzo
    draw() {
        for (let hint of this.dropZones) {
            hint.draw()
        }
        for (let column of this.matrix) {
            for (let tile of column) {
                tile.draw();
            }
        }
    }

    drawBackground() {
        this.ctx.drawImage(this.background, this.boardX, this.boardY + this.tileHeight, this.tileWidth * this.columns, this.tileHeight * this.rows);
    }

    // Actualiza el estado del juego hasta que termine la partida verificando si el mouse se encuentra sobre alguna zona de caída
    update(deltaTime, mouse, isFichaSelected) {
        if (this.winner == null) {
            for (const hint of this.dropZones) {
                hint.update(deltaTime);
            }
            if (isFichaSelected) {
                this.checkDropZones(mouse);
            }
            return true;
        } else {
            return false;
        }
    }

    // Recorre las zonas de caída y actualiza el estado de la que se encuentre la que se encuentre bajo el mouse
    checkDropZones(mouse) {
        this.hoveredDropZone = null;
        for (const zone of this.dropZones) {
            zone.highlight(false);
            if (this.hoveredDropZone == null) {
                this.hoveredDropZone = zone.isHoveredWithFicha(mouse);
            }
        }
    }

    // Verifica dónde suelta una pieza el jugador para determinar qué comportamiento tendrá la misma
    checkForHover(ficha) {
        if (this.hoveredDropZone != null) {
            return this.addFicha(ficha);
        } else {
            ficha.resetPos();
            return false;
        }
    }

    // Asigna la primera posición libre de la columna correspondiente a la pieza y verifica posibles condiciones de victoria
    addFicha(ficha) {
        const column = this.hoveredDropZone.getColumn();
        const firstEmpty = this.searchFreeTile(column);
        this.hoveredDropZone.highlight(false);
        this.hoveredDropZone = null;

        if (firstEmpty != -1) {
            this.matrix[column][firstEmpty].setFicha(ficha, () => {
                this.checkPosibleWin(column, firstEmpty, ficha.getColor());
            });
            ficha.discard();
            return true;
        } else {
            ficha.resetPos();
            return false;
        }
    }

    // Retorna el índice de la primera posición vacía de una columna del tablero de juego
    searchFreeTile(column) {
        for (let x = this.matrix[column].length - 1; x >= 0; x--) {
            if (this.matrix[column][x].getFicha() == null) {
                return x;
            }
        }
        return -1;
    }

    // Inicializa las zonas de caída de piezas y las posiciones de las columnas del tablero de juego
    fill() {
        let posX = this.boardX;
        let posY = this.boardY;

        for (let x = 0; x < this.columns; x++) {
            const dropZone = new DropZone(posX, posY, this.tileWidth, this.tileHeight, this.config, 'grey', x, this.ctx);
            this.dropZones.push(dropZone);
            posX += this.tileWidth + this.tileSpacing;
        }

        posX = this.boardX;
        posY = this.boardY + this.tileHeight + this.tileSpacing;

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.columns; x++) {
                let border = x == 0 ? -1 : 0;
                border = x == this.columns - 1 ? 1 : border;

                const tile = new Tile(posX, posY, this.tileWidth, this.tileHeight, border, this.config, 'blue', this.ctx);
                this.matrix[x][y] = tile;
                posX += this.tileWidth + this.tileSpacing;
            }
            posX = this.boardX;
            posY += this.tileHeight + this.tileSpacing;
        }
    }

    initBackground() {
        const image = new Image();
        image.src = './img/4enlinea/board-background.png';
        return image;
    }

    // Verifica si la última pieza colocada en el tablero de juego completa una línea ganadora
    checkPosibleWin(column, row, color) {
        const winCount = this.config['win-count'];
        const directions = [
            { x: -1, y: -1 }, //diagonal principal
            { x: 0, y: -1 },  //vertical
            { x: 1, y: -1 },  //diagonal secundaria
            { x: -1, y: 0 }]; //horizonal

        for (const { x, y } of directions) {
            const count =
                this.recursiveLineCheck(column, row, x, y, winCount, 1, color) +
                this.recursiveLineCheck(column, row, -x, -y, winCount, 0, color);

            if (count >= winCount) {
                this.winner = color;
                return;
            }
        }
    }

    // Verifica el largo de una línea formada en determinado eje a partir de la última pieza colocada en el tablero de juego
    recursiveLineCheck(x, y, dirX, dirY, winCount, currentCount, color) {
        const newX = x + dirX;
        const newY = y + dirY;

        // Condición de corte si se cae de la matriz
        if (newX < 0 || newX >= this.matrix.length || newY < 0 || newY >= this.matrix[0].length) {
            return currentCount;
        }

        const cell = this.matrix[newX][newY];
        const newColor = cell.getFicha() ? cell.getFicha().getColor() : null;

        if (newColor === color && ++currentCount < winCount) {
            return this.recursiveLineCheck(newX, newY, dirX, dirY, winCount, currentCount, color);
        } else {
            return currentCount;
        }
    }

    //devuelve el ganador
    getWinner() {
        return this.winner;
    }

    abort() {
        this.winner = 'tie';
    }
}