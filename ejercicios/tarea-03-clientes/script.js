const formulario = document.getElementById("formularioClientes");

formulario.addEventListener("submit", function (event) {

    // Evita que el formulario se envíe automáticamente
    event.preventDefault();

    // Obtener los valores ingresados
    const cedula = document.getElementById("cedula").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const correo = document.getElementById("correo").value.trim();

    // Limpiar mensajes anteriores
    document.getElementById("errorCedula").textContent = "";
    document.getElementById("errorNombre").textContent = "";
    document.getElementById("errorDireccion").textContent = "";
    document.getElementById("errorTelefono").textContent = "";
    document.getElementById("errorCorreo").textContent = "";
    document.getElementById("mensajeExito").textContent = "";

    let formularioValido = true;

    // VALIDACIÓN DE CÉDULA
    if (!/^\d{10}$/.test(cedula)) {
        document.getElementById("errorCedula").textContent =
            "La cédula debe contener exactamente 10 dígitos.";

        formularioValido = false;
    }

    // VALIDACIÓN DEL NOMBRE
    if (nombre === "") {
        document.getElementById("errorNombre").textContent =
            "El nombre es obligatorio.";

        formularioValido = false;

    } else if (nombre.length > 30) {

        document.getElementById("errorNombre").textContent =
            "El nombre no puede superar los 30 caracteres.";

        formularioValido = false;
    }

    // VALIDACIÓN DE DIRECCIÓN
    if (direccion === "") {
        document.getElementById("errorDireccion").textContent =
            "La dirección es obligatoria.";

        formularioValido = false;

    } else if (direccion.length > 50) {

        document.getElementById("errorDireccion").textContent =
            "La dirección no puede superar los 50 caracteres.";

        formularioValido = false;
    }

    // VALIDACIÓN DEL TELÉFONO
    if (!/^\d{10}$/.test(telefono)) {

        document.getElementById("errorTelefono").textContent =
            "El teléfono debe contener exactamente 10 dígitos.";

        formularioValido = false;
    }

    // VALIDACIÓN DEL CORREO
    const expresionCorreo =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!expresionCorreo.test(correo)) {

        document.getElementById("errorCorreo").textContent =
            "Ingrese un correo electrónico válido.";

        formularioValido = false;
    }

    // SI TODO ES CORRECTO
    if (formularioValido) {

        document.getElementById("mensajeExito").textContent =
            "Cliente registrado correctamente.";

        formulario.reset();
    }

});