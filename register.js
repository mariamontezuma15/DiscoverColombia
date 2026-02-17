// Control de selección de rol y envío del formulario
document.addEventListener('DOMContentLoaded', function() {
    const roleSelector = document.getElementById('role-selector');
    const roleUserBtn = document.getElementById('role-user');
    const roleAdminBtn = document.getElementById('role-admin');
    const registerForm = document.getElementById('register-form');
    const adminCodeGroup = document.getElementById('admin-code-group');
    const tituloRegistro = document.getElementById('titulo-registro');

    let selectedRole = null;
    const adminCode = Math.random().toString(36).slice(-8).toUpperCase();
    console.log('Codigo de administrador generado:', adminCode);

    const backBtn = document.getElementById('btn-back-role');

    // Volver al selector de rol desde el formulario
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            selectedRole = null;
            roleSelector.style.display = 'block';
            registerForm.style.display = 'none';
            adminCodeGroup.style.display = 'none';
            tituloRegistro.textContent = 'Crea una cuenta';
            // limpiar formulario
            registerForm.reset();
        });
    }

    roleUserBtn.addEventListener('click', function() {
        selectedRole = 'user';
        roleSelector.style.display = 'none';
        registerForm.style.display = 'block';
        adminCodeGroup.style.display = 'none';
        tituloRegistro.textContent = 'Registro de Usuario';
    });

    roleAdminBtn.addEventListener('click', function() {
        selectedRole = 'admin';
        roleSelector.style.display = 'none';
        registerForm.style.display = 'block';
        adminCodeGroup.style.display = 'block';
        tituloRegistro.textContent = 'Registro de Administrador';
    });

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const adminCodeInput = document.getElementById('adminCode').value.trim();

        if (!selectedRole) {
            alert('Selecciona primero si deseas registrarte como Usuario o Administrador.');
            return;
        }

        // Validaciones básicas
        if (!nombre || !apellido || !email || !password) {
            alert('Por favor completa todos los campos requeridos.');
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        const usuarioExistente = usuarios.find(u => u.email === email);
        if (usuarioExistente) {
            alert('Usuario ya existe');
            return;
        }

        // Si es admin, validar código (ejemplo simple: 'ADMIN123')
        if (selectedRole === 'admin') {
            if (!adminCodeInput) {
                alert('Ingresa el código de administrador.');
                return;
            }
            if (adminCodeInput !== adminCode) {
                alert('Código de administrador inválido.');
                return;
            }
        }

        // Guardar usuario con rol
        const nuevo = { nombre, apellido, email, password, role: selectedRole };
        usuarios.push(nuevo);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        alert('Usuario registrado correctamente');
        window.location.href = 'login.html';
    });
});
