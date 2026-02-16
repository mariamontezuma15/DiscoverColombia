function obtenerPaquetes() {
    let paquetes = JSON.parse(localStorage.getItem('paquetes'));
    if (!paquetes) {
        paquetes = [
            {
                titulo: 'Hotel Cartagena SUN',
                precio: 'COP 497.287',
                subinfo: 'Vuelo + Alojamiento',
                desc: 'Paquete imperdible, hotel frente al mar, desayuno incluido, transporte y acceso exclusivo.',
                puntuacion: '4.3',
                comentarios: '32 Comentarios',
                img: 'img/destino_placeholder.png'
            },
            {
                titulo: 'Hotel Cartagena SUN',
                precio: 'COP 497.287',
                subinfo: 'Vuelo + Alojamiento',
                desc: 'Paquete imperdible, hotel frente al mar, desayuno incluido, transporte y acceso exclusivo.',
                puntuacion: '4.3',
                comentarios: '32 Comentarios',
                img: 'img/destino_placeholder.png'
            },
            {
                titulo: 'Hotel Cartagena SUN',
                precio: 'COP 497.287',
                subinfo: 'Vuelo + Alojamiento',
                desc: 'Paquete imperdible, hotel frente al mar, desayuno incluido, transporte y acceso exclusivo.',
                puntuacion: '4.3',
                comentarios: '32 Comentarios',
                img: 'img/destino_placeholder.png'
            },
            {
                titulo: 'Hotel Cartagena SUN',
                precio: 'COP 497.287',
                subinfo: 'Vuelo + Alojamiento',
                desc: 'Paquete imperdible, hotel frente al mar, desayuno incluido, transporte y acceso exclusivo.',
                puntuacion: '4.3',
                comentarios: '32 Comentarios',
                img: 'img/destino_placeholder.png'
            }
        ];
        localStorage.setItem('paquetes', JSON.stringify(paquetes));
    }
    return paquetes;
}

function renderizarPaquetes() {
    const paquetes = obtenerPaquetes();
    const grid = document.querySelector('.paquetes-grid');
    grid.innerHTML = '';
    paquetes.forEach((paquete, index) => {
        const card = document.createElement('div');
        card.className = 'card-paquete';
        card.innerHTML = `
            <img src="${paquete.img}" alt="Destino">
            <div class="card-body">
                <h4>${paquete.titulo}</h4>
                <p class="precio">${paquete.precio}</p>
                <p class="subinfo">${paquete.subinfo}</p>
                <p class="desc">${paquete.desc}</p>
                <div class="rating">
                    <span class="puntuacion">${paquete.puntuacion}</span>
                    <span class="comentarios">${paquete.comentarios}</span>
                </div>
                <a href="/alojamiento.html" class="btn-detalle">Ver detalle</a>
                ${sessionStorage.getItem('usuarioActual') ? `<button class="btn-editar btn-detalle" data-index="${index}">Editar</button><button class="btn-eliminar btn-detalle" data-index="${index}">Eliminar</button>` : ''}
            </div>
        `;
        grid.appendChild(card);
    });
}

function agregarPaquete(titulo, precio, subinfo, desc) {
    const paquetes = obtenerPaquetes();
    paquetes.push({ titulo, precio, subinfo, desc, puntuacion: '4.3', comentarios: '32 Comentarios', img: 'img/destino_placeholder.png' });
    localStorage.setItem('paquetes', JSON.stringify(paquetes));
    renderizarPaquetes();
}

function editarPaquete(index, titulo, precio, subinfo, desc) {
    const paquetes = obtenerPaquetes();
    paquetes[index] = { ...paquetes[index], titulo, precio, subinfo, desc };
    localStorage.setItem('paquetes', JSON.stringify(paquetes));
    renderizarPaquetes();
}

function eliminarPaquete(index) {
    const paquetes = obtenerPaquetes();
    paquetes.splice(index, 1);
    localStorage.setItem('paquetes', JSON.stringify(paquetes));
    renderizarPaquetes();
}

let indiceEditar = null;

document.addEventListener('DOMContentLoaded', function() {
    const usuarioActual = JSON.parse(sessionStorage.getItem('usuarioActual'));
    const btnRegistro = document.querySelector('.btn-registro');
    if (usuarioActual) {
        btnRegistro.innerHTML = `Hola ${usuarioActual.nombre}!`;
        btnRegistro.classList.add('logged-in');
    }
    renderizarPaquetes();
    if (sessionStorage.getItem('usuarioActual')) {
        const body = document.body;
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        overlay.classList.add('overlay');
        body.appendChild(overlay);
        const modal = document.createElement('div');
        modal.id = 'modal-paquete';
        modal.classList.add('modal');
        modal.innerHTML = `
            <h4 id="titulo-modal">Agregar Paquete</h4>
            <input type="text" placeholder="Título" id="titulo">
            <input type="text" placeholder="Precio" id="precio">
            <input type="text" placeholder="Subinfo" id="subinfo">
            <textarea placeholder="Descripción" id="desc"></textarea>
            <button id="btn-guardar" class="btn-detalle">Guardar</button>
            <button id="btn-cancelar" class="btn-detalle">Cancelar</button>
        `;
        body.appendChild(modal);
        const h3 = document.querySelector('.paquetes .section-title');
        h3.classList.add('section-title-with-btn');
        const btnAgregar = document.createElement('button');
        btnAgregar.textContent = 'Agregar Paquete';
        btnAgregar.className = 'btn-detalle btn-agregar-paquete';
        btnAgregar.id = 'btn-mostrar-modal';
        h3.appendChild(btnAgregar);
        document.getElementById('btn-mostrar-modal').addEventListener('click', function() {
            indiceEditar = null;
            document.getElementById('titulo-modal').textContent = 'Agregar Paquete';
            document.getElementById('titulo').value = '';
            document.getElementById('precio').value = '';
            document.getElementById('subinfo').value = '';
            document.getElementById('desc').value = '';
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('modal-paquete').style.display = 'block';
        });
        document.getElementById('btn-guardar').addEventListener('click', function() {
            const titulo = document.getElementById('titulo').value;
            const precio = document.getElementById('precio').value;
            const subinfo = document.getElementById('subinfo').value;
            const desc = document.getElementById('desc').value;
            if (indiceEditar !== null) {
                editarPaquete(indiceEditar, titulo, precio, subinfo, desc);
            } else {
                agregarPaquete(titulo, precio, subinfo, desc);
            }
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('modal-paquete').style.display = 'none';
        });
        document.getElementById('btn-cancelar').addEventListener('click', function() {
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('modal-paquete').style.display = 'none';
        });
        overlay.addEventListener('click', function() {
            document.getElementById('overlay').style.display = 'none';
            document.getElementById('modal-paquete').style.display = 'none';
        });
    }
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-eliminar')) {
            const index = e.target.dataset.index;
            eliminarPaquete(index);
        } else if (e.target.classList.contains('btn-editar')) {
            const index = e.target.dataset.index;
            indiceEditar = index;
            const paquete = obtenerPaquetes()[index];
            document.getElementById('titulo-modal').textContent = 'Editar Paquete';
            document.getElementById('titulo').value = paquete.titulo;
            document.getElementById('precio').value = paquete.precio;
            document.getElementById('subinfo').value = paquete.subinfo;
            document.getElementById('desc').value = paquete.desc;
            document.getElementById('overlay').style.display = 'block';
            document.getElementById('modal-paquete').style.display = 'block';
        }
    });
});
