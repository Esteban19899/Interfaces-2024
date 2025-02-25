"use strict";

listenersLinks();
initSidebar();
document.getElementById("goto").click();

async function partialRender(event) {

    const main = document.getElementById("content");
    const loadingTime = 500;
    const clickDelay = event.target.classList.contains("await-animation") ? 1500 : 0;
    const url = event.target.getAttribute("data-url") || event.target.getAttribute("href");

    event.preventDefault();

    setTimeout(async () => {
        const response = await fetch(url);
        const content = await response.text();

        animateLoader(loadingTime);
        main.innerHTML = content;

        switch (url) {
            case "home.html":
                startCarousel(1);
                fillHome();
                login(true);
                break;
            case "form.html":
                listenersForm();
                renderRecaptcha();
                login(false);
                break;
            case "game.html":
                login(true);
        }

        listenersLinks();
    }, clickDelay);
}

function listenersLinks() {

    let links = document.getElementsByClassName("link");
    let cardToggles = document.getElementsByClassName("card-toggle");
    let bannerInputs = document.getElementsByClassName("carousel-radio");
    let playButton = document.getElementsByClassName("play-game-button");
    let formButtons = document.getElementsByClassName("await-animation");
    let playerNext = document.getElementsByClassName('player-name-next');
    let fichaNext = document.getElementsByClassName('ficha-next');
    let imgFichas = document.getElementsByClassName('img-ficha');

    for (let item of links) {
        item.addEventListener("click", partialRender);
    }
    for (let item of cardToggles) {
        item.addEventListener("click", updateCard);
    }
    for (let item of bannerInputs) {
        item.addEventListener("change", moveCarousel)
    }
    for (let item of playButton) {
        item.addEventListener("click", goToSelectPlayer);
    }
    for (let item of formButtons) {
        item.addEventListener("click", animateFormButtons);
    }
    for (let item of playerNext) {
        item.addEventListener("click", goToSelectFicha);
    }
    for (let item of fichaNext) {
        item.addEventListener("click", loadConfig);
    }
    for (let item of imgFichas) {
        item.addEventListener("click", selectFicha);
    }
}

async function updateCard(event) {
    event.preventDefault();

    let clicked = event.target;
    let card = clicked.closest('.card');
    let type = clicked.innerHTML;
    let name = clicked.closest('.card-blackout').querySelector('.card-title').innerHTML;
    let img = card.querySelector('.card-img').src;
    let price = card.querySelector('.card-price').innerHTML;

    let url;

    switch (type) {
        case "Add to Cart":
            url = "goto.html";
            break;
        case "Remove":
        case "Go to Cart":
            url = "add.html";
            break;
    }

    // Fetch .html
    let response = await fetch(url);
    let content = await response.text();

    // Cargamos la card con la nueva
    card.innerHTML = content;
    card.querySelector('.card-title').innerHTML = name;
    card.querySelector('.card-img').src = img;
    card.querySelector('.card-price').innerHTML = price;

    listenersLinks();
}

function animateLoader(duration) {
    const bar = document.getElementById("loader-bar");
    const loader = document.getElementById("loader");
    const body = document.getElementsByTagName("body");

    window.scrollTo(0, 0);
    body[0].style.overflowY = "hidden";
    bar.classList.add("loader-bar-animation");
    loader.classList.add("show-loader");
    bar.style.animationDuration = duration;

    const element = document.getElementById("loader-number");
    const start = 0;
    const end = 100;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentNumber = Math.floor(progress * (end - start) + start);
        element.textContent = currentNumber;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);

    setTimeout(() => {
        body[0].style.overflowY = "visible";
        bar.classList.remove("loader-bar-animation");
        loader.classList.remove("show-loader");
    }, duration + 600);
}

function listenersForm() {
    /*  const loginForm = document.getElementById('login-form');
     const registerForm = document.getElementById('register-form');
 
     // Verificamos si existen los elementos antes de asignar eventos
     if (loginForm && registerForm) {
         // Almacenamos todos los botones para alternar formularios
         const toggleButtons = document.querySelectorAll('.toggle-form');
 
         toggleButtons.forEach(link => {
             link.addEventListener('click', (e) => {
                 e.preventDefault(); // Evitar que el botón recargue la página
 
                 // Alternar visibilidad de los formularios
                 if (loginForm.style.display === 'none' || loginForm.style.display === '') {
                     loginForm.style.display = 'block'; // Mostrar el formulario de inicio de sesión
                     registerForm.style.display = 'none'; // Ocultar el formulario de registro
                 } else {
                     loginForm.style.display = 'none'; // Ocultar el formulario de inicio de sesión
                     registerForm.style.display = 'block'; // Mostrar el formulario de registro
                 }
             });
         });
     } else {
         console.error("Los formularios no se encontraron.");
     } */

    const toggleButtons = document.getElementsByClassName("toggle-form");
    for (let button of toggleButtons) {

        button.addEventListener("click", (event) => {

            event.preventDefault;

            const forms = document.getElementsByClassName("form-container");
            for (let form of forms) {
                form.classList.toggle("form-active");
            }
        });
    }
}

// Nueva función para renderizar reCAPTCHA
function renderRecaptcha() {
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (recaptchaContainer) {
        grecaptcha.render(recaptchaContainer, {
            'sitekey': '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
        });
    } else {
        console.error("El contenedor de reCAPTCHA no se encontró.");
    }
}

function animateFormButtons(event) {

    const tickMark = '<svg width="48" height="35" viewBox="0 0 58 45" xmlns="http://www.w3.org/2000/svg"><path fill="#fff" fill-rule="nonzero" d="M19.11 44.64L.27 25.81l5.66-5.66 13.18 13.18L52.07.38l5.65 5.65"></path></svg>';

    event.target.innerHTML = tickMark;
    event.target.classList.add("submit-btn-focus");
}

function listenerCards() {
    let cards = document.getElementsByClassName("card");

    for (let card of cards) {
        let blackout = card.children[1];

        card.addEventListener("mouseenter", () => {
            blackout.classList.remove('card-blackout-hidden');
            blackout.classList.add('card-blackout-visible');
        });

        card.addEventListener("mouseleave", () => {
            blackout.classList.add('card-blackout-hidden');
            blackout.classList.remove('card-blackout-visible');
        })
    }
}

async function startCarousel(position) {

    const inputs = document.getElementById("carousel-inputs");
    const input = inputs.querySelector(`input[value="${position}"]`);

    if (input) {

        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });

        input.dispatchEvent(event);
    }

    position = (position % 4) + 1;
    setTimeout(() => startCarousel(position), 5000);
}

function moveCarousel(event) {

    const carousel = document.getElementById("carousel");
    const allImg = document.getElementsByClassName("carousel-img");
    const allItems = document.getElementsByClassName("carousel-item-blackout");
    const value = event.target.value;
    const img = document.getElementById("carousel-" + value);
    const item = img.parentElement.querySelector('.carousel-item-blackout');

    for (let i = 0; i < allItems.length; i++) {
        allImg[i].classList.remove("carousel-animation");
        allItems[i].classList.remove("carousel-active");
    }

    img.classList.add("carousel-animation");
    item.classList.add("carousel-active");

    carousel.style.setProperty("--position", value);
}

async function fillHome() {

    const games = document.getElementById("games");

    const sectionResponse = await fetch("cardsection.html");
    const cardSectCode = await sectionResponse.text();

    games.innerHTML = cardSectCode.repeat(6);

    const titleElements = games.querySelectorAll('.card-section-title');
    const rowsEl = games.querySelectorAll('.card-row');

    const titles = ["Recomendados", "En tu libreria", "Accion", "Carreras", "Aventura", "Deportes"];

    const cardResponse = await fetch("add.html");
    const card = await cardResponse.text();

    for (let i = 0; i < titles.length; i++) {
        let row = "";

        for (let j = 0; j < titles.length; j++) {
            row += '<div class="card">' + card + '</div>';
        }
        titleElements[i].innerHTML = titles[i]
        rowsEl[i].innerHTML = row;
    }

    const imgElements = document.getElementsByClassName("card-img");
    const cardTitleElements = document.getElementsByClassName("card-title");
    const cardPriceElements = document.getElementsByClassName("card-price");

    const jsonResponse = await fetch("img/games/paths.json");
    const paths = await jsonResponse.json();

    const freeResponse = await fetch("play.html");
    const code = await freeResponse.text();

    for (let i = 0; i < imgElements.length; i++) {

        imgElements[i].src = paths.images[i]['path'];
        cardTitleElements[i].innerHTML = paths.images[i]['name'];
        cardPriceElements[i].innerHTML = paths.images[i]['price'];
        if (paths.images[i]['price'] == "Free!") {
            let card = imgElements[i].closest('.card');
            makeFree(card, code);
        }
    }

    listenersLinks();
}

function makeFree(card, code) {

    let title = card.querySelector('.card-title').innerHTML;
    let img = card.querySelector('.card-img').src;

    card.innerHTML = code;

    card.querySelector('.card-title').innerHTML = title;
    card.querySelector('.card-img').src = img;

    listenersLinks();
}

function initSidebar() {
    const menuBtn = document.getElementById('menu-btn');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const sidebarLinks = sidebar.querySelectorAll('.link');

    menuBtn.addEventListener('click', function () {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    });

    // Cerrar el menú si se hace clic en el overlay
    overlay.addEventListener('click', function () {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });

    for (let link of sidebarLinks) {
        link.addEventListener('click', function () {
            overlay.click();
        })
    }
}

function login(state) {

    const avatar = document.getElementById("user-avatar");
    const icon = document.getElementById("user-icon");
    const searchBar = document.getElementById("search-bar");

    if (state) {
        icon.style.display = "none";
        avatar.style.display = "block";
        searchBar.style.display = "flex";

    } else {
        avatar.style.display = "none";
        icon.style.display = "block";
        searchBar.style.display = "none";
    }
}