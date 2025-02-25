/*controla tamaño del header y su logo*/
function headerControl(wTop) {
    const header = document.getElementById('header');
    const logo = header.getElementsByTagName('img')[0];
    const startScroll = 1000;
    const maxScroll = 900;
    const fullLogoHeight = 360;
    const minLogoHeight = 60;
    const fullHeaderHeight = 103;
    const minHeaderHeight = 60;

    if (wTop > startScroll) {
        const clampedScroll = Math.min(wTop - startScroll, maxScroll);
        const newLogoHeight = fullLogoHeight - ((fullLogoHeight - minLogoHeight) * clampedScroll) / maxScroll;
        const newHeaderHeight = fullHeaderHeight - ((fullHeaderHeight - minHeaderHeight) * clampedScroll) / maxScroll;

        logo.style.height = newLogoHeight + 'px';
        header.style.height = newHeaderHeight + 'px';
    }
}

/*controla la animacion parallax
 del hero basandose en el scroll*/
function heroParallax(wTop) {
    const hero = document.getElementsByClassName('hero-parallax');
    const end = 1000;
    const progress = wTop / end;

    //al asignar un animation-delay negativo, adelantamos la animacion
    for (const layer of hero) layer.style.animationDelay = -progress + 's';
}

/*recibe las secciones que se estan mostrando
 busca en cada una los elementos con parallax vertical 
 y los anima usando section.yTop como referencia */
function verticalParallax(sections, wBottom) {
    for (const section of sections) {
        const current = document.getElementById('section' + section.id);
        const layers = current.getElementsByClassName('parallax');
        //esta constante ayuda a evitar parallax muy pronunciado o muy tenue en resoluciones extremas
        const vhConst = window.visualViewport.height / 10

        for (const layer of layers) {
            let speed = layer.getAttribute('data-speed');
            let yPos = -((wBottom - section.yTop) * speed / vhConst);

            layer.setAttribute('style', 'transform: translate3d(0px, ' + yPos + 'px, 0px)');
        }
    }
}

/*anima las cards de la seccion 2 en caso de que entren en pantalla*/
function cardsUp(sectionTop, wBottom) {
    const cards = document.getElementsByClassName('card');

    if (wBottom > sectionTop + 150) {
        for (const card of cards) {
            card.classList.add('card-up');
        }
    } else {
        for (const card of cards) {
            card.classList.remove('card-up');
        }
    }
}

/*mueve la imagen de los personajes de la seccion 3 en la direccion contraria al mouse*/
function mouseParallax(event, section, image) {

    const { left, top, width, height } = section.getBoundingClientRect();
    const offsetX = ((event.clientX - left) / width) * 2 - 1;
    const offsetY = ((event.clientY - top) / height) * 2 - 1;

    // Ajustar la cantidad de movimiento
    const moveAmount = 60;
    image.style.transform = `translate(${-offsetX * moveAmount}px, ${-offsetY * moveAmount}px) scale(1.2)`;
}

// Configuración del evento
const sectionDescarga = document.querySelector('.section.descarga');
const imagen = document.querySelector('.boys');

if (sectionDescarga && imagen) {
    const handleMouseMove = (event) => mouseParallax(event, sectionDescarga, imagen);
    sectionDescarga.addEventListener('mousemove', handleMouseMove);
}

/*muestra en la seccion 4 un personaje dependiendo del texto*/
function stickyScroll() {
    const characters = document.getElementsByClassName('character');
    const items = document.getElementsByClassName('item');
    const stickyBottom = document.getElementsByClassName('left')[0].getBoundingClientRect().bottom;
    let shown = 0;

    for (const item of items) {
        const itemTop = item.getBoundingClientRect().top;
        shown = itemTop < stickyBottom ? item.getAttribute('data-image') : shown;
    }

    Array.from(characters).forEach(char => char.classList.remove('active-char'));
    characters[shown].classList.add('active-char');
}