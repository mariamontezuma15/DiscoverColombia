document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.querySelector('input[placeholder="Nombre"]').value;
    const apellido = document.querySelector('input[placeholder="Apellido"]').value;
    const email = document.querySelector('input[placeholder="Email"]').value;
    const password = document.querySelector('input[placeholder="Contraseña"]').value;
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioExistente = usuarios.find(u => u.email === email);
    if (usuarioExistente) {
        alert('Usuario ya existe');
        return;
    }
    usuarios.push({ nombre, apellido, email, password });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    alert('Usuario registrado correctamente');
    window.location.href = 'login.html';
});
