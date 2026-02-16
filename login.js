document.querySelector('.btn').addEventListener('click', function() {
    const email = document.querySelector('input[placeholder="Email"]').value;
    const password = document.querySelector('input[placeholder="Contraseña"]').value;
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    if (usuario) {
        sessionStorage.setItem('usuarioActual', JSON.stringify(usuario));
        alert('Login exitoso');
        window.location.href = 'packages.html';
    } else {
        alert('Credenciales incorrectas');
    }
});