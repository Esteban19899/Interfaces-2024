'use strict';

start()

/*inicializa las secciones calculando su yTop y yBottom
y agrega eventListeners, se ejecuta una unica vez*/
function start() {

    //seteos de logica que depende del scroll
    const sections = document.querySelectorAll('.section');
    const debug = document.getElementById('debugTab');
    let positions = [];

    sections.forEach((section, did) => {
        const rect = section.getBoundingClientRect();
        const yTop = rect.top;
        const yBottom = rect.bottom;
        const id = section.id.replace(/^section/, "");
        positions.push({ id, yTop, yBottom });
    });

    let timeout = null;
    window.addEventListener('scroll', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            updateOffset(positions, debug);
        }, 8); //solo dispara masomenos 120 veces x segundo
    });

    //seteos de logica que depende de la posicion del mouse
    const descarga = document.getElementById('section3');
    const boys = descarga.getElementsByTagName('img')[0];

    descarga.addEventListener('mousemove', (event) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            mouseParallax(event, descarga, boys);
        }, 8); //solo dispara masomenos 120 veces x segundo
    });

    window.addEventListener('load', () => {
        window.scrollTo(0, 0);
    });
}

/*al actualizarse la posicion de scroll, chequea cuales 
sections son visibles y llama animaciones relacionadas al scroll*/
function updateOffset(positions, debug) {

    let wTop = window.scrollY;
    let wBottom = wTop + window.visualViewport.height;
    let shownSections = [];

    for (let i = 0; i < positions.length; i++) {
        if (positions[i].yTop < wBottom && positions[i].yBottom > wTop) {
            shownSections.push(positions[i]);
        }
    }

    //animations:
    headerControl(wTop);
    heroParallax(wTop);
    verticalParallax(shownSections, wBottom);
    cardsUp(positions[2].yTop, wBottom);
    stickyScroll();

    //debug tab
    const ids = shownSections.map(obj => obj.id);
    debug.innerHTML = '&emsp;Viewport top y value: ' + wTop +
        '<br>&emsp;Viewport height: ' + window.visualViewport.height +
        '<br>&emsp;Viewport bottom: ' + wBottom +
        '<br>&emsp;Current section(s): ' + ids;
}

// Función de inicialización del menú hamburguesa
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const items = document.querySelectorAll('#sidebar-container ul li'); // Todos los ítems del sidebar
    
    // Si el sidebar ya tiene la clase 'active', lo ocultamos
    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    } else {
        // Primero eliminamos las animaciones de los ítems
        items.forEach(item => {
            item.style.animation = 'none'; // Detenemos la animación
        });

        // Forzamos el reflow para que los cambios se apliquen
        void sidebar.offsetWidth;

        // Ahora agregamos las animaciones de nuevo
        items.forEach(item => {
            item.style.animation = ''; // Reaplicamos la animación
        });

        // Agregamos la clase active para mostrar el sidebar
        sidebar.classList.add('active');
    }
}