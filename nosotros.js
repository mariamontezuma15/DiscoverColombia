document.addEventListener('DOMContentLoaded', function () {
    const usuarioActual = JSON.parse(sessionStorage.getItem('usuarioActual'));
    const btnRegistro = document.querySelector('.btn-registro');
    if (usuarioActual) {
        btnRegistro.classList.add('logged-in');
        const nombre = usuarioActual.nombre || usuarioActual.username || usuarioActual.email || 'Usuario';
        btnRegistro.innerHTML = `
            <div class="user-menu">
                <div class="greeting">Hola, ${nombre}</div>
                <div class="logout-row"><a href="#" id="btn-logout" class="logout-link small-logout">Cerrar sesión</a></div>
            </div>
        `;
        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function (e) {
                e.preventDefault();
                sessionStorage.removeItem('usuarioActual');
                location.reload();
            });
        }
    } else {
        if (btnRegistro) {
            btnRegistro.classList.remove('logged-in');
            btnRegistro.innerHTML = '<a href="/register.html">Registro</a>';
        }
    }
});
