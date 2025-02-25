let playersNames = [];
let playersFichas = [];
let listenersAdded = false;

// Carga de forma asíncrona un archivo de configuración JSON con aspectos clave del juego
async function loadConfig() {

    const response = await fetch('js/config.json');
    const config = await response.json();
    let configString = JSON.stringify(config, null, 4);

    const form = document.getElementById('form-linea');
    const formData = new FormData(form);
    const boardSize = formData.get('connect');

    configString = calculateSize(configString, boardSize);
    configString = addNamesAndFichas(configString)
    const fullConfig = JSON.parse(configString);

    playGame(fullConfig);
}

// Inicializa los elementos del juego y comienza con un ciclo de actualizaciones que constituyen el flujo de la partida
function playGame(config) {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const gameState = new GameState(config, ctx);
    const graphics = new Graphics(config, ctx);
    let lastTime = 0;

    setup(canvas, config);
    addMouseEventListeners(canvas, gameState);

    // Actualiza y renderiza el estado actual de la partida, avisando si la misma debe continuar o ya finalizó
    function gameLoop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;

        const continueGame = gameState.update(deltaTime);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        graphics.draw();
        gameState.draw();
        if (continueGame) {
            requestAnimationFrame(gameLoop);
        } else {
            graphics.showWinner(gameState.getWinner());
        }
    }

    // Programa la ejecución de gameLoop(timestamp) en el proximo frame de la pantalla
    gameState.restartTimer();
    requestAnimationFrame(gameLoop);
}

// Sustituye el menu del juego por el canvas donde se ejecuta el juego (lienzo)
function setup(canvas, config) {
    const img = document.getElementById('select-ficha');
    const button = document.getElementById('play-game-button');
    const div = document.getElementById('canvas-buttons');
    img.style.display = 'none';
    button.style.display = 'none';
    div.style.display = 'flex';
    canvas.style.display = 'block'
    canvas.width = config['canvas-width'];
    canvas.height = config['canvas-height'];
}

// Añade los controles del juego al mouse para poder interactuar con él
function addMouseEventListeners(canvas, gameState) {

    canvas.addEventListener('mousedown', (event) => {
        gameState.click();
    });
    canvas.addEventListener('mouseup', () => {
        gameState.mouseUp();
    });
    canvas.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        gameState.mouse.x = (event.clientX - rect.left) * scaleX;
        gameState.mouse.y = (event.clientY - rect.top) * scaleY;
    });

    if (!listenersAdded) {

        let gameRestart = document.getElementsByClassName('canvas-restart');
        let gameHome = document.getElementsByClassName('canvas-home');

        gameRestart[0].addEventListener("click", () => {
            gameState.abort();
            loadConfig();
        });
        gameHome[0].addEventListener("click", (event) => {
            gameState.abort();
            goToSelectPlayer(event);
        });

        listenersAdded = true;
    }
}

//inicializa el menu de seleccion de nombre de jugadores
function goToSelectPlayer(event) {
    event.preventDefault();

    const music = document.getElementById('track');
    music.play();
    music.volume = 0.5;

    const canvas = document.getElementById('game-canvas');
    const card = document.getElementById('play-game-card');
    const playerMenu = document.getElementById('select-player-name');
    const div = document.getElementById('canvas-buttons');
    canvas.style.display = 'none';
    card.style.display = 'none';
    playerMenu.style.display = 'block';
    div.style.display = 'none';
}

//inicializa el menu de seleccion de modo de juego y fichas
function goToSelectFicha(event) {
    event.preventDefault();
    const playerMenu = document.getElementById('select-player-name');
    const fichaMenu = document.getElementById('select-ficha');
    const fichas = document.getElementsByClassName('img-ficha');
    const players = document.getElementsByClassName('player-names');
    const form = document.getElementById('player-form');
    const formData = new FormData(form);

    players[0].innerHTML = formData.get('player1');
    players[1].innerHTML = formData.get('player2');

    playerMenu.style.display = 'none';
    fichaMenu.style.display = 'block';

    for (const ficha of fichas) {
        ficha.style.border = '';
    }
    fichas[0].style.border = '4px solid var(--acc_400)';
    fichas[1].style.border = '4px solid red';

    playersNames[0] = formData.get('player1');
    playersNames[1] = formData.get('player2');
    playersFichas[0] = fichas[0].getAttribute('src');
    playersFichas[1] = fichas[1].getAttribute('src');
}

//controla la seleccion de fichas en el menu
function selectFicha(event) {
    const fichas = document.getElementsByClassName('img-ficha');
    const target = event.target;
    const color = target.getAttribute('player-data');

    for (const item of fichas) {
        const itemColor = item.getAttribute('player-data');
        item.style.border = color == itemColor ? '' : item.style.border;
    }

    target.style.border = `4px solid ${color}`;
    switch (color) {
        case 'var(--acc_400)':
            playersFichas[0] = target.getAttribute('src');
            break;
        case 'red':
            playersFichas[1] = target.getAttribute('src');
    }
}

//calcula el tamaño del tablero y lo agrega al config
function calculateSize(configString, size) {
    let rows = 6;
    let columns = 7;

    switch (size) {
        case '3':
            rows = 5;
            columns = 6;
            break;
        case '4':
            rows = 6;
            columns = 7;
            break;
        case '5':
            rows = 7;
            columns = 8;
            break;
        case '6':
            rows = 8;
            columns = 8;
    }
    return configString.slice(0, -2) + `, "board-rows" : ${rows}, "board-columns" : ${columns}, "win-count" : ${size} }`;
}

//agrega los nombre y fichas seleccionados al config
function addNamesAndFichas(configString) {
    configString = configString.slice(0, -2) + `, "player1-img" : "${playersFichas[0]}", "player2-img" : "${playersFichas[1]}" }`;
    return configString.slice(0, -2) + `, "player1-name" : "${playersNames[0]}", "player2-name" : "${playersNames[1]}" }`;
}