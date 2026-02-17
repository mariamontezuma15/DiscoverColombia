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
        btnRegistro.classList.remove('logged-in');
        btnRegistro.innerHTML = '<a href="/register.html">Registro</a>';
    }
});