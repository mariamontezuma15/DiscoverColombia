function obtenerVuelos() {
    const raw = localStorage.getItem('vuelos');
    if (raw === null) {
        const vuelos = [
            {
                titulo: 'Vuelos a Medellin',
                subinfo: 'Desde Bogota · Sab, 10 Ene - Mar, 13 Ene',
                aerolinea: 'Avianca',
                precio: 'Desde COP 4.987.287',
                img: 'img/medellin.png'
            },
            {
                titulo: 'Vuelos a Cartagena',
                subinfo: 'Desde Bogota · Sab, 10 Ene - Mar, 13 Ene',
                aerolinea: 'Viva',
                precio: 'Desde COP 4.987.287',
                img: 'img/cartagena.png'
            },
            {
                titulo: 'Vuelos a Quimbaya',
                subinfo: 'Desde Bogota · Sab, 10 Ene - Mar, 13 Ene',
                aerolinea: 'LATAM',
                precio: 'Desde COP 4.987.287',
                img: 'img/quimbaya.png'
            },
            {
                titulo: 'Vuelos a Medellin',
                subinfo: 'Desde Bogota · Sab, 10 Ene - Mar, 13 Ene',
                aerolinea: 'Avianca',
                precio: 'Desde COP 4.987.287',
                img: 'img/medellin.png'
            }
        ];
        localStorage.setItem('vuelos', JSON.stringify(vuelos));
        return vuelos;
    }

    try {
        const vuelos = JSON.parse(raw);
        if (!vuelos || !Array.isArray(vuelos)) {
            return [];
        }
        return vuelos;
    } catch (err) {
        console.warn('vuelos.js: vuelos in localStorage is corrupted. Backing up and restoring defaults.', err);
        localStorage.setItem('vuelos_backup', raw);
        localStorage.removeItem('vuelos');
        return obtenerVuelos();
    }
}

function renderizarVuelos() {
    const grid = document.querySelector('.cards-grid');
    if (!grid) return;
    const vuelos = obtenerVuelos();
    const usuarioActual = (() => {
        try { return JSON.parse(sessionStorage.getItem('usuarioActual')); } catch (e) { return null; }
    })();
    const esAdmin = usuarioActual && usuarioActual.role === 'admin';

    grid.innerHTML = '';
    vuelos.forEach((vuelo, index) => {
        const card = document.createElement('article');
        card.className = 'card';
        const img = vuelo.img || 'img/destino_placeholder.png';
        const titulo = vuelo.titulo || 'Vuelo destacado';
        const subinfo = vuelo.subinfo || '';
        const aerolinea = vuelo.aerolinea || 'Aerolinea';
        const precio = vuelo.precio || '';

        card.innerHTML = `
            <img class="card-image" src="${img}" alt="${titulo}">
            <div class="card-body">
                <h4>${titulo}</h4>
                <p class="muted">${subinfo}</p>
                <div class="meta">
                    <div class="badge">Por ${aerolinea}</div>
                    <div class="price">${precio}</div>
                </div>
                ${esAdmin ? `
                    <div class="actions">
                        <button class="btn-detalle btn-editar" data-index="${index}">Editar</button>
                        <button class="btn-detalle btn-eliminar" data-index="${index}">Eliminar</button>
                    </div>
                ` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

function agregarVuelo(titulo, subinfo, aerolinea, precio, img) {
    const vuelos = obtenerVuelos();
    vuelos.push({ titulo, subinfo, aerolinea, precio, img });
    localStorage.setItem('vuelos', JSON.stringify(vuelos));
    renderizarVuelos();
}

function editarVuelo(index, titulo, subinfo, aerolinea, precio, img) {
    const vuelos = obtenerVuelos();
    vuelos[index] = { ...vuelos[index], titulo, subinfo, aerolinea, precio, img };
    localStorage.setItem('vuelos', JSON.stringify(vuelos));
    renderizarVuelos();
}

function eliminarVuelo(index) {
    const vuelos = obtenerVuelos();
    vuelos.splice(index, 1);
    localStorage.setItem('vuelos', JSON.stringify(vuelos));
    renderizarVuelos();
}

let indiceEditar = null;

document.addEventListener('DOMContentLoaded', function () {
    const btnRegistro = document.querySelector('.btn-registro');
    let usuarioActual = null;
    try {
        usuarioActual = JSON.parse(sessionStorage.getItem('usuarioActual'));
    } catch (e) {
        usuarioActual = null;
    }

    if (btnRegistro) {
        if (usuarioActual) {
            const nombre = usuarioActual.nombre || usuarioActual.username || usuarioActual.email || 'Usuario';
            btnRegistro.classList.add('logged-in');
            btnRegistro.innerHTML = `
                <div class="user-menu">
                    <div class="greeting">Hola, ${nombre}</div>
                    <div class="logout-row"><a href="#" id="btn-logout" class="logout-link small-logout">Cerrar sesion</a></div>
                </div>
            `;
            const logout = document.getElementById('btn-logout');
            if (logout) {
                logout.addEventListener('click', function (e) {
                    e.preventDefault();
                    sessionStorage.removeItem('usuarioActual');
                    location.reload();
                });
            }
        } else {
            btnRegistro.classList.remove('logged-in');
            btnRegistro.innerHTML = '<a href="/register.html">Registro</a>';
        }
    }

    renderizarVuelos();

    const esAdmin = usuarioActual && usuarioActual.role === 'admin';
    if (esAdmin) {
        const body = document.body;
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.classList.add('overlay');
        body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.id = 'modal-vuelo';
        modal.classList.add('modal');
        modal.innerHTML = `
            <button id="btn-close-modal" class="modal-close" aria-label="Cerrar">&times;</button>
            <div class="modal-header">
                <h4 id="titulo-modal">Agregar vuelo</h4>
            </div>
            <input type="text" placeholder="Titulo" id="titulo">
            <input type="text" placeholder="Subinfo" id="subinfo">
            <input type="text" placeholder="Aerolinea" id="aerolinea" class="half">
            <input type="text" placeholder="Precio" id="precio" class="half last">
            <input type="text" placeholder="URL de imagen" id="img">
            <div class="modal-actions">
                <button id="btn-cancelar" class="btn-detalle">Cancelar</button>
                <button id="btn-guardar" class="btn-detalle">Guardar</button>
            </div>
        `;
        body.appendChild(modal);

        const sectionTitle = document.querySelector('.section-title');
        if (sectionTitle) {
            sectionTitle.classList.add('section-title-with-btn');
            const btnAgregar = document.createElement('button');
            btnAgregar.textContent = 'Agregar Vuelo';
            btnAgregar.className = 'btn-detalle btn-agregar-paquete';
            btnAgregar.id = 'btn-mostrar-modal';
            sectionTitle.appendChild(btnAgregar);
        }

        const openModal = () => {
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('modal-vuelo').style.display = 'block';
        };

        const closeModal = () => {
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('modal-vuelo').style.display = 'none';
        };

        const btnMostrar = document.getElementById('btn-mostrar-modal');
        if (btnMostrar) {
            btnMostrar.addEventListener('click', function () {
                indiceEditar = null;
                document.getElementById('titulo-modal').textContent = 'Agregar vuelo';
                document.getElementById('titulo').value = '';
                document.getElementById('subinfo').value = '';
                document.getElementById('aerolinea').value = '';
                document.getElementById('precio').value = '';
                document.getElementById('img').value = '';
                openModal();
            });
        }

        document.getElementById('btn-guardar').addEventListener('click', function () {
            const titulo = document.getElementById('titulo').value;
            const subinfo = document.getElementById('subinfo').value;
            const aerolinea = document.getElementById('aerolinea').value;
            const precio = document.getElementById('precio').value;
            const img = document.getElementById('img').value;

            if (indiceEditar !== null) {
                editarVuelo(indiceEditar, titulo, subinfo, aerolinea, precio, img);
            } else {
                agregarVuelo(titulo, subinfo, aerolinea, precio, img);
            }
            closeModal();
        });

        document.getElementById('btn-cancelar').addEventListener('click', closeModal);
        const closeBtn = document.getElementById('btn-close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }
        overlay.addEventListener('click', closeModal);
    }

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-eliminar')) {
            const index = e.target.dataset.index;
            eliminarVuelo(index);
        } else if (e.target.classList.contains('btn-editar')) {
            const index = e.target.dataset.index;
            const vuelo = obtenerVuelos()[index];
            indiceEditar = index;
            document.getElementById('titulo-modal').textContent = 'Editar vuelo';
            document.getElementById('titulo').value = vuelo.titulo || '';
            document.getElementById('subinfo').value = vuelo.subinfo || '';
            document.getElementById('aerolinea').value = vuelo.aerolinea || '';
            document.getElementById('precio').value = vuelo.precio || '';
            document.getElementById('img').value = vuelo.img || '';
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('modal-vuelo').style.display = 'block';
        }
    });
});