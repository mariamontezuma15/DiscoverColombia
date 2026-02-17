document.addEventListener('DOMContentLoaded', function () {
    const btnRegistro = document.querySelector('.btn-registro');
    if (!btnRegistro) return;

    let usuarioActual = null;
    try {
        usuarioActual = JSON.parse(sessionStorage.getItem('usuarioActual'));
    } catch (e) {
        usuarioActual = null;
    }

    if (usuarioActual) {
        const nombre = usuarioActual.nombre || usuarioActual.username || usuarioActual.email || 'Usuario';
        btnRegistro.classList.add('logged-in');
        btnRegistro.innerHTML = `
            <div class="user-menu">
                <div class="greeting">Hola, ${nombre}</div>
                <div class="logout-row"><a href="#" id="btn-logout" class="logout-link small-logout">Cerrar sesión</a></div>
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
        // default register link
        btnRegistro.classList.remove('logged-in');
        btnRegistro.innerHTML = '<a href="/register.html">Registro</a>';
    }
    
    // --- Alojamiento data rendering and admin edit ---
    const defaultAlojamiento = {
        titulo: 'Hotel Dann Carlton Medellín',
        direccion: 'Cra 43A No. 7-50, El Poblado, 050001 Medellín, Colombia',
        estrellas: '⭐⭐⭐⭐',
        puntuacion: '4.3',
        comentarios: '234 Comentarios',
        gallery: [
            'img/destino_placeholder.png',
            'img/destino_placeholder.png',
            'img/destino_placeholder.png',
            'img/destino_placeholder.png',
            'img/destino_placeholder.png',
            'img/destino_placeholder.png'
        ],
        review: {
            title: 'Excelente ubicación',
            estrellas: '⭐⭐⭐⭐',
            text: 'Las habitaciones son muy cómodas solo que el ruido de los huéspedes a altas horas podría tener más control.',
            author: 'Daniel Paniagua Quintero'
        },
        descripcion: [
            'Dann Carlton ofrece habitaciones de lujo con zona de estar, piscina al aire libre y spa. El hotel está situado en la zona de El Poblado, a 3 cuadras del Casino San Fernando. El acceso WiFi está disponible en todo el establecimiento de forma gratuita.',
            'Las amplias habitaciones del Hotel Dann Carlton Medellín cuentan con aire acondicionado, TV y minibar. En la piscina hay una terraza para tomar el sol. Los huéspedes pueden disfrutar de tratamientos de belleza en el salón, hacer ejercicio en el gimnasio o tomar uno de los masajes relajantes que se ofrecen.',
            'El hotel se encuentra a 30 minutos en coche del aeropuerto José María Córdova. En Dann Carlton Medellín es posible aparcar gratis en un aparcamiento privado.'
        ],
        servicios: [
            'Piscina al aire libre', 'Jacuzzi', 'Playa privada', 'Traslado desde el aeropuerto', 'Aire acondicionado', 'Mascotas permitidas', 'Bar', 'Restaurante', 'Cafetería'
        ]
    };

    function obtenerAlojamiento() {
        const raw = localStorage.getItem('alojamiento');
        if (!raw) {
            // initialize localStorage with defaults so pages behave like packages
            try { localStorage.setItem('alojamiento', JSON.stringify(defaultAlojamiento)); } catch (e) { /* ignore */ }
            return defaultAlojamiento;
        }
        try {
            const obj = JSON.parse(raw);
            return Object.assign({}, defaultAlojamiento, obj);
        } catch (e) {
            console.warn('alojamiento: stored data corrupted, using defaults', e);
            try { localStorage.setItem('alojamiento_backup', raw); } catch (er) {}
            try { localStorage.setItem('alojamiento', JSON.stringify(defaultAlojamiento)); } catch (er) {}
            return defaultAlojamiento;
        }
    }

    function guardarAlojamiento(obj) {
        localStorage.setItem('alojamiento', JSON.stringify(obj));
    }

    function renderAlojamiento() {
        const aloj = obtenerAlojamiento();
        const tituloEl = document.getElementById('alojamiento-titulo');
        const dirEl = document.getElementById('alojamiento-direccion');
        const starsEl = document.getElementById('alojamiento-stars');
        const descEl = document.getElementById('alojamiento-descripcion');
        const servEl = document.getElementById('alojamiento-servicios');
        const imgEl = document.querySelector('.imagenes');
        const reviewContainer = document.querySelector('.comentario');
        const mapContainer = document.querySelector('.mapa');
        if (tituloEl) tituloEl.textContent = aloj.titulo;
        if (dirEl) dirEl.textContent = aloj.direccion;
        if (starsEl) starsEl.textContent = aloj.estrellas;
        if (descEl) {
            // ensure there's a heading 'Descripción' inside the description block
            const descTitleId = 'aloj-desc-title';
            let descTitle = descEl.querySelector(`#${descTitleId}`);
            if (!descTitle) {
                descTitle = document.createElement('h3');
                descTitle.id = descTitleId;
                descTitle.textContent = 'Descripción';
                // insert the title as the first child of descEl
                descEl.insertBefore(descTitle, descEl.firstChild);
            }
            // remove only the paragraph elements, preserve the title
            descEl.querySelectorAll('p.descripcion').forEach(p => p.remove());
            // add description paragraphs
            aloj.descripcion.forEach(p => {
                const node = document.createElement('p');
                node.className = 'descripcion';
                node.textContent = p;
                descEl.appendChild(node);
            });
        }
        if (servEl) {
            servEl.innerHTML = '';
            aloj.servicios.forEach(s => {
                const span = document.createElement('span');
                span.innerHTML = s;
                servEl.appendChild(span);
            });
        }

        // render gallery
        if (imgEl) {
            imgEl.innerHTML = '';
            const gallery = document.createElement('div');
            gallery.className = 'imagen-gallery';
            // main image
            const main = document.createElement('div');
            main.className = 'gallery-main';
            const mimg = document.createElement('img');
            mimg.src = aloj.gallery[0] || 'img/destino_placeholder.png';
            mimg.alt = aloj.titulo;
            main.appendChild(mimg);
            gallery.appendChild(main);
            // side images
            const side = document.createElement('div');
            side.className = 'gallery-side';
            aloj.gallery.slice(1,4).forEach(src=>{
                const d = document.createElement('div'); d.className='side-item'; const i=document.createElement('img'); i.src=src; i.alt=''; d.appendChild(i); side.appendChild(d);
            });
            gallery.appendChild(side);
            // thumbnails
            const thumbs = document.createElement('div'); thumbs.className='gallery-thumbs';
            aloj.gallery.slice(4).forEach(src=>{ const t=document.createElement('img'); t.src=src; t.alt=''; thumbs.appendChild(t); });
            gallery.appendChild(thumbs);
            imgEl.appendChild(gallery);
        }

        // render review box in the right column (first .comentario)
        if (reviewContainer) {
            // keep the existing h3, append a review-card after it
            const h3 = reviewContainer.querySelector('h3');
            let card = reviewContainer.querySelector('.review-card');
            if (!card) {
                card = document.createElement('div'); card.className = 'review-card';
                if (h3 && h3.nextSibling) h3.parentNode.insertBefore(card, h3.nextSibling);
                else reviewContainer.appendChild(card);
            }
            card.innerHTML = `
                <h4>${aloj.review.title}</h4>
                <div class="review-stars">${aloj.review.estrellas}</div>
                <p class="review-text">"${aloj.review.text}"</p>
                <div class="review-author">${aloj.review.author}</div>
            `;
        }

        // render map image (use local asset ubicacion_en_el_mapa.png) and overlay two vector shapes
        if (mapContainer) {
            // Insert image wrapper
            mapContainer.innerHTML = `
                <div class="map-wrapper">
                    <img src="img/ubicacion_en_el_mapa.png" alt="Ubicación en el mapa" class="map-image">
                </div>
            `;

            const pinOuter = { leftPct: 54.6, topPct: 38.2, widthPx: 86, heightPx: 110, color: '#113563',
                // exact px coordinates (design):
                leftPx: 1140, topPx: 620, widthPxDesign: 38.33, heightPxDesign: 46 };
            const pinInner = { leftPct: 54.6, topPct: 34.8, widthPx: 24, heightPx: 24, color: '#F5B941',
                leftPx: 1152.78, topPx: 632.55, widthPxDesign: 12.78, heightPxDesign: 12.545 };

            const wrapper = mapContainer.querySelector('.map-wrapper');
            const img = wrapper.querySelector('.map-image');

            // create pin elements but wait until image loads to position/scale them
            const outerEl = document.createElement('div'); outerEl.className = 'map-pin-outer';
            const innerEl = document.createElement('div'); innerEl.className = 'map-pin-inner';
            // give them temporary hidden state until positioned
            outerEl.style.opacity = '0'; outerEl.style.pointerEvents = 'none';
            innerEl.style.opacity = '0'; innerEl.style.pointerEvents = 'none';
            wrapper.appendChild(outerEl);
            wrapper.appendChild(innerEl);

            function positionPins() {
                // natural image size
                const natW = img.naturalWidth || img.width;
                const natH = img.naturalHeight || img.height;
                const dispW = img.clientWidth;
                const dispH = img.clientHeight;
                if (!natW || !natH) return;

                // If design provides exact pixel coordinates, apply them so vectors match design exactly.
                if (typeof pinOuter.leftPx === 'number' && typeof pinOuter.topPx === 'number') {
                    outerEl.style.left = pinOuter.leftPx + 'px';
                    outerEl.style.top = pinOuter.topPx + 'px';
                    outerEl.style.width = (pinOuter.widthPxDesign || pinOuter.widthPx) + 'px';
                    outerEl.style.height = (pinOuter.heightPxDesign || pinOuter.heightPx) + 'px';
                    outerEl.style.background = pinOuter.color;
                    outerEl.style.opacity = '1';
                    outerEl.style.transform = 'none';
                    outerEl.style.zIndex = '3';

                    innerEl.style.left = pinInner.leftPx + 'px';
                    innerEl.style.top = pinInner.topPx + 'px';
                    innerEl.style.width = (pinInner.widthPxDesign || pinInner.widthPx) + 'px';
                    innerEl.style.height = (pinInner.heightPxDesign || pinInner.heightPx) + 'px';
                    innerEl.style.background = pinInner.color;
                    innerEl.style.opacity = '1';
                    innerEl.style.transform = 'none';
                    innerEl.style.zIndex = '4';
                } else {
                    // Fallback: percentage-based placement
                    const outerLeftPct = pinOuter.leftPct;
                    const outerTopPct = pinOuter.topPct;
                    const innerLeftPct = pinInner.leftPct;
                    const innerTopPct = pinInner.topPct;
                    const maxScale = Math.min(1, dispW / 900);
                    const outerW = Math.max(28, Math.round(pinOuter.widthPx * maxScale));
                    const outerH = Math.max(36, Math.round(pinOuter.heightPx * maxScale));
                    const innerW = Math.max(10, Math.round(pinInner.widthPx * maxScale));
                    const innerH = Math.max(10, Math.round(pinInner.heightPx * maxScale));
                    outerEl.style.left = outerLeftPct + '%';
                    outerEl.style.top = outerTopPct + '%';
                    outerEl.style.width = outerW + 'px';
                    outerEl.style.height = outerH + 'px';
                    outerEl.style.background = pinOuter.color;
                    outerEl.style.opacity = '1';
                    outerEl.style.transform = 'translate(-50%, -100%)';
                    outerEl.style.zIndex = '3';
                    innerEl.style.left = innerLeftPct + '%';
                    innerEl.style.top = innerTopPct + '%';
                    innerEl.style.width = innerW + 'px';
                    innerEl.style.height = innerH + 'px';
                    innerEl.style.background = pinInner.color;
                    innerEl.style.opacity = '1';
                    innerEl.style.transform = 'translate(-50%, -50%)';
                    innerEl.style.zIndex = '4';
                }
            }

            // If image already cached and complete
            if (img.complete && img.naturalWidth) {
                positionPins();
            } else {
                img.addEventListener('load', positionPins);
            }

            // reposition on window resize to keep pins aligned
            window.addEventListener('resize', function () {
                // small debounce
                clearTimeout(window._pinPositionTimeout);
                window._pinPositionTimeout = setTimeout(positionPins, 120);
            });
        }
    }

    renderAlojamiento();

    // If admin, add edit button and modal
    if (usuarioActual && usuarioActual.role === 'admin') {
        const tituloEl = document.getElementById('alojamiento-titulo');
        if (tituloEl) {
            const btnEdit = document.createElement('button');
            btnEdit.textContent = 'Editar alojamiento';
            btnEdit.className = 'btn-detalle';
            btnEdit.style.marginLeft = '12px';
            tituloEl.insertAdjacentElement('afterend', btnEdit);

            // overlay + modal
            const body = document.body;
            const overlay = document.createElement('div');
            overlay.id = 'overlay-alojamiento';
            overlay.className = 'overlay';
            overlay.style.display = 'none';
            body.appendChild(overlay);

            const modal = document.createElement('div');
            modal.id = 'modal-alojamiento';
            modal.className = 'modal';
            modal.style.display = 'none';
            modal.innerHTML = `
                <button id="btn-close-alojamiento" class="modal-close" aria-label="Cerrar">&times;</button>
                <div class="modal-header"><h4>Editar alojamiento</h4></div>
                <input id="aloj-input-titulo" placeholder="Título">
                <div id="err-titulo" class="input-error" aria-live="polite"></div>
                <input id="aloj-input-direccion" placeholder="Dirección">
                <div id="err-direccion" class="input-error" aria-live="polite"></div>
                <label>Estrellas</label>
                <select id="aloj-input-estrellas">
                    <option value="">Selecciona puntuación</option>
                    <option value="1">⭐ (1 estrella)</option>
                    <option value="2">⭐⭐ (2 estrellas)</option>
                    <option value="3">⭐⭐⭐ (3 estrellas)</option>
                    <option value="4">⭐⭐⭐⭐ (4 estrellas)</option>
                    <option value="5">⭐⭐⭐⭐⭐ (5 estrellas)</option>
                </select>
                <div id="err-estrellas" class="input-error" aria-live="polite"></div>
                <label>Descripciones (separadas por línea)</label>
                <textarea id="aloj-input-descripcion" placeholder="Párrafo 1\nPárrafo 2"></textarea>
                <div id="err-descripcion" class="input-error" aria-live="polite"></div>
                <label>Servicios (separados por coma)</label>
                <input id="aloj-input-servicios" placeholder="Piscina, Restaurante, A/C">
                <div id="err-servicios" class="input-error" aria-live="polite"></div>
                <div class="modal-actions"><button id="btn-aloj-cancel" class="btn-detalle">Cancelar</button><button id="btn-aloj-save" class="btn-detalle">Guardar</button></div>
            `;
            body.appendChild(modal);

            function openModal() {
                const aloj = obtenerAlojamiento();
                document.getElementById('aloj-input-titulo').value = aloj.titulo || '';
                document.getElementById('aloj-input-direccion').value = aloj.direccion || '';
                // Convert stars to number
                const starCount = (aloj.estrellas || '').match(/⭐/g)?.length || '';
                document.getElementById('aloj-input-estrellas').value = starCount;
                document.getElementById('aloj-input-descripcion').value = (aloj.descripcion || []).join('\n');
                document.getElementById('aloj-input-servicios').value = (aloj.servicios || []).join(', ');
                overlay.style.display = 'block';
                modal.style.display = 'block';
            }

            btnEdit.addEventListener('click', openModal);
            document.getElementById('btn-aloj-cancel').addEventListener('click', function () { overlay.style.display = 'none'; modal.style.display = 'none'; });
            document.getElementById('btn-close-alojamiento').addEventListener('click', function () { overlay.style.display = 'none'; modal.style.display = 'none'; });
            overlay.addEventListener('click', function () { overlay.style.display = 'none'; modal.style.display = 'none'; });
            document.getElementById('btn-aloj-save').addEventListener('click', function () {
                // clear previous errors
                ['err-titulo','err-direccion','err-estrellas','err-descripcion','err-servicios'].forEach(id=>{const el=document.getElementById(id); if(el) el.textContent='';});
                const tituloVal = document.getElementById('aloj-input-titulo').value.trim();
                const direccionVal = document.getElementById('aloj-input-direccion').value.trim();
                const estrellasVal = document.getElementById('aloj-input-estrellas').value.trim();
                const descripcionVal = document.getElementById('aloj-input-descripcion').value.split('\n').map(s=>s.trim()).filter(Boolean);
                const serviciosVal = document.getElementById('aloj-input-servicios').value.split(',').map(s=>s.trim()).filter(Boolean);

                const errors = {};
                // Title validation
                if (!tituloVal || tituloVal.length < 3) errors.titulo = 'El título debe tener al menos 3 caracteres.';
                if (tituloVal.length > 120) errors.titulo = 'El título no puede exceder 120 caracteres.';
                // Dirección
                if (!direccionVal || direccionVal.length < 5) errors.direccion = 'Introduce una dirección válida.';
                // Estrellas: must be selected (1-5)
                let estrellasNormalized = '';
                if (!estrellasVal) {
                    errors.estrellas = 'Selecciona una puntuación de estrellas.';
                } else {
                    const n = parseInt(estrellasVal, 10);
                    if (n < 1 || n > 5) errors.estrellas = 'Las estrellas deben ser entre 1 y 5.';
                    else estrellasNormalized = '⭐'.repeat(n);
                }
                // Descripcion
                if (!descripcionVal || descripcionVal.length === 0) errors.descripcion = 'Añade al menos un párrafo descriptivo.';
                else if (descripcionVal.some(p=>p.length < 10)) errors.descripcion = 'Cada párrafo debe tener al menos 10 caracteres.';
                // Servicios
                if (!serviciosVal || serviciosVal.length === 0) errors.servicios = 'Añade al menos un servicio.';

                // If errors, show and abort
                if (Object.keys(errors).length > 0) {
                    if (errors.titulo) document.getElementById('err-titulo').textContent = errors.titulo;
                    if (errors.direccion) document.getElementById('err-direccion').textContent = errors.direccion;
                    if (errors.estrellas) document.getElementById('err-estrellas').textContent = errors.estrellas;
                    if (errors.descripcion) document.getElementById('err-descripcion').textContent = errors.descripcion;
                    if (errors.servicios) document.getElementById('err-servicios').textContent = errors.servicios;
                    return;
                }

                const newObj = {
                    titulo: tituloVal,
                    direccion: direccionVal,
                    estrellas: estrellasNormalized,
                    descripcion: descripcionVal,
                    servicios: serviciosVal
                };
                guardarAlojamiento(newObj);
                renderAlojamiento();
                overlay.style.display = 'none';
                modal.style.display = 'none';
            });
        }
    }
});
