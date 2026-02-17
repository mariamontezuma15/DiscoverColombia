function obtenerAlojamientos() {
    const raw = localStorage.getItem('alojamientos');
    if (raw === null) {
        const alojamientos = [
            {
                titulo: 'Hotel Dann Carlton Medellin',
                direccion: 'Cra 43A No. 7-50, El Poblado',
                puntuacion: '4.3',
                precio: 'Desde COP 4.987.287',
                img: 'img/destino_placeholder.png'
            },
            {
                titulo: 'Sofitel Baru Cartagena',
                direccion: 'Km 7 Sector, Baru, Cartagena de Indias',
                puntuacion: '4.3',
                precio: 'Desde COP 4.987.287',
                img: 'img/destino_placeholder.png'
            },
            {
                titulo: 'Masaya Medellin',
                direccion: 'Calle 8 #43A-89, El Poblado, Medellin',
                puntuacion: '4.3',
                precio: 'Desde COP 4.987.287',
                img: 'img/destino_placeholder.png'
            },
            {
                titulo: 'Hotel Casa Alejandria Quimbaya',
                direccion: 'Cra 4 #16-46, Quimbaya, Quindio, Colombia',
                puntuacion: '4.3',
                precio: 'Desde COP 4.987.287',
                img: 'img/destino_placeholder.png'
            }
        ];
        localStorage.setItem('alojamientos', JSON.stringify(alojamientos));
        return alojamientos;
    }

    try {
        const alojamientos = JSON.parse(raw);
        if (!alojamientos || !Array.isArray(alojamientos)) {
            return [];
        }
        return alojamientos;
    } catch (err) {
        console.warn('estadida.js: alojamientos in localStorage is corrupted. Backing up and restoring defaults.', err);
        localStorage.setItem('alojamientos_backup', raw);
        localStorage.removeItem('alojamientos');
        return obtenerAlojamientos();
    }
}

function renderizarAlojamientos() {
    const grid = document.querySelector('.cards-grid');
    if (!grid) return;
    const alojamientos = obtenerAlojamientos();
    const usuarioActual = (() => {
        try { return JSON.parse(sessionStorage.getItem('usuarioActual')); } catch (e) { return null; }
    })();
    const esAdmin = usuarioActual && usuarioActual.role === 'admin';

    grid.innerHTML = '';
    alojamientos.forEach((alojamiento, index) => {
        const card = document.createElement('article');
        card.className = 'card';
        const img = alojamiento.img || 'img/destino_placeholder.png';
        const titulo = alojamiento.titulo || 'Alojamiento destacado';
        const direccion = alojamiento.direccion || '';
        const puntuacion = alojamiento.puntuacion || '4.0';
        const precio = alojamiento.precio || '';

        card.innerHTML = `
            <img class="card-image" src="${img}" alt="${titulo}">
            <div class="card-body">
                <h4>${titulo}</h4>
                <p class="muted">${direccion}</p>
                <div class="meta">
                    <a href="/alojamiento.html" class="btn-detalle">Ver detalle</a>
                    <div class="badge">${puntuacion}</div>
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

function agregarAlojamiento(titulo, direccion, puntuacion, precio, img) {
    const alojamientos = obtenerAlojamientos();
    alojamientos.push({ titulo, direccion, puntuacion, precio, img });
    localStorage.setItem('alojamientos', JSON.stringify(alojamientos));
    renderizarAlojamientos();
}

function editarAlojamiento(index, titulo, direccion, puntuacion, precio, img) {
    const alojamientos = obtenerAlojamientos();
    alojamientos[index] = { ...alojamientos[index], titulo, direccion, puntuacion, precio, img };
    localStorage.setItem('alojamientos', JSON.stringify(alojamientos));
    renderizarAlojamientos();
}

function eliminarAlojamiento(index) {
    const alojamientos = obtenerAlojamientos();
    alojamientos.splice(index, 1);
    localStorage.setItem('alojamientos', JSON.stringify(alojamientos));
    renderizarAlojamientos();
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

    renderizarAlojamientos();

    const esAdmin = usuarioActual && usuarioActual.role === 'admin';
    if (esAdmin) {
        const body = document.body;
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.classList.add('overlay');
        body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.id = 'modal-alojamiento';
        modal.classList.add('modal');
        modal.innerHTML = `
            <button id="btn-close-modal" class="modal-close" aria-label="Cerrar">&times;</button>
            <div class="modal-header">
                <h4 id="titulo-modal">Agregar alojamiento</h4>
            </div>
            <input type="text" placeholder="Titulo" id="titulo">
            <input type="text" placeholder="Direccion" id="direccion">
            <input type="text" placeholder="Puntuacion" id="puntuacion" class="half">
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
            btnAgregar.textContent = 'Agregar Alojamiento';
            btnAgregar.className = 'btn-detalle btn-agregar-paquete';
            btnAgregar.id = 'btn-mostrar-modal';
            sectionTitle.appendChild(btnAgregar);
        }

        const openModal = () => {
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('modal-alojamiento').style.display = 'block';
        };

        const closeModal = () => {
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('modal-alojamiento').style.display = 'none';
        };

        const btnMostrar = document.getElementById('btn-mostrar-modal');
        if (btnMostrar) {
            btnMostrar.addEventListener('click', function () {
                indiceEditar = null;
                document.getElementById('titulo-modal').textContent = 'Agregar alojamiento';
                document.getElementById('titulo').value = '';
                document.getElementById('direccion').value = '';
                document.getElementById('puntuacion').value = '';
                document.getElementById('precio').value = '';
                document.getElementById('img').value = '';
                openModal();
            });
        }

        document.getElementById('btn-guardar').addEventListener('click', function () {
            const titulo = document.getElementById('titulo').value;
            const direccion = document.getElementById('direccion').value;
            const puntuacion = document.getElementById('puntuacion').value;
            const precio = document.getElementById('precio').value;
            const img = document.getElementById('img').value;

            if (indiceEditar !== null) {
                editarAlojamiento(indiceEditar, titulo, direccion, puntuacion, precio, img);
            } else {
                agregarAlojamiento(titulo, direccion, puntuacion, precio, img);
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
            eliminarAlojamiento(index);
        } else if (e.target.classList.contains('btn-editar')) {
            const index = e.target.dataset.index;
            const alojamiento = obtenerAlojamientos()[index];
            indiceEditar = index;
            document.getElementById('titulo-modal').textContent = 'Editar alojamiento';
            document.getElementById('titulo').value = alojamiento.titulo || '';
            document.getElementById('direccion').value = alojamiento.direccion || '';
            document.getElementById('puntuacion').value = alojamiento.puntuacion || '';
            document.getElementById('precio').value = alojamiento.precio || '';
            document.getElementById('img').value = alojamiento.img || '';
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('modal-alojamiento').style.display = 'block';
        }
    });
});
