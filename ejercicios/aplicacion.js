
/* ==========================================
   SISTEMA DE REGISTRO DE ESTUDIANTES - ULEAM
   JavaScript, RegExp, JSON y localStorage
   ========================================== */

// 1. ESTADO DE LA APLICACIÓN

const CLAVE_STORAGE = "estudiantesULEAM";

let estudiantes = [];

try {
    const datosGuardados = JSON.parse(
        localStorage.getItem(CLAVE_STORAGE) || "[]"
    );

    estudiantes = Array.isArray(datosGuardados)
        ? datosGuardados
        : [];
} catch (error) {
    console.error("Error al leer los datos:", error);
    estudiantes = [];
}

let estaEditando = false;


// 2. ELEMENTOS DEL DOM

const formulario = document.getElementById("formulario-estudiantes");
const entradaId = document.getElementById("id-estudiante");
const botonGuardar = document.getElementById("boton-guardar");
const botonCancelar = document.getElementById("boton-cancelar");
const botonLimpiar = document.getElementById("boton-limpiar");
const cuerpoTabla = document.getElementById("cuerpo-tabla");
const buscador = document.getElementById("buscar-estudiante");
const contador = document.getElementById("contador-estudiantes");

const campos = [
    "cedula",
    "apellidos",
    "nombres",
    "direccion",
    "telefono",
    "correo",
    "facultad",
    "nivel",
    "paralelo"
];


// 3. EXPRESIONES REGULARES

const expresiones = {

    // Exactamente 10 números
    cedula: /^[0-9]{10}$/,

    // Letras, espacios, tildes y apóstrofes
    nombres: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]{2,60}$/,

    apellidos: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' ]{2,60}$/,

    // Letras, números y signos comunes en direcciones
    direccion: /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.,#°/-]{5,120}$/,

    // Celular ecuatoriano: 09 + 8 dígitos
    telefono: /^09[0-9]{8}$/,

    // Formato básico de correo electrónico
    correo: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
};


// 4. VALIDACIÓN DE CÉDULA ECUATORIANA

function validarCedulaEcuatoriana(cedula) {

    // Primero comprobar los 10 dígitos
    if (!expresiones.cedula.test(cedula)) {
        return false;
    }

    // Código de provincia: 01-24 o 30
    const provincia = Number(cedula.substring(0, 2));

    if (!(
        (provincia >= 1 && provincia <= 24) ||
        provincia === 30
    )) {
        return false;
    }

    // Para cédulas de personas naturales
    const tercerDigito = Number(cedula[2]);

    if (tercerDigito > 5) {
        return false;
    }

    // Algoritmo módulo 10
    let suma = 0;

    for (let i = 0; i < 9; i++) {

        let digito = Number(cedula[i]);

        if (i % 2 === 0) {
            digito *= 2;

            if (digito > 9) {
                digito -= 9;
            }
        }

        suma += digito;
    }

    const verificador = (10 - (suma % 10)) % 10;

    return verificador === Number(cedula[9]);
}


// 5. MOSTRAR Y LIMPIAR ERRORES

function mostrarError(campo, mensaje) {

    const entrada = document.getElementById(campo);
    const textoError = document.getElementById(
        "error-" + campo
    );

    entrada.classList.add("invalido");

    textoError.textContent = mensaje;
}

function limpiarError(campo) {

    const entrada = document.getElementById(campo);
    const textoError = document.getElementById(
        "error-" + campo
    );

    entrada.classList.remove("invalido");

    textoError.textContent = "";
}

function limpiarTodosLosErrores() {

    campos.forEach(campo => {
        limpiarError(campo);
    });
}


// 6. OBTENER DATOS DEL FORMULARIO

function obtenerDatosFormulario() {

    const datos = {};

    campos.forEach(campo => {

        datos[campo] = document
            .getElementById(campo)
            .value
            .trim();
    });

    return datos;
}


// 7. VALIDAR TODOS LOS CAMPOS

function validarFormulario(datos) {

    limpiarTodosLosErrores();

    let esValido = true;

    // CÉDULA
    if (!expresiones.cedula.test(datos.cedula)) {

        mostrarError(
            "cedula",
            "La cédula debe contener exactamente 10 dígitos."
        );

        esValido = false;

    } else if (!validarCedulaEcuatoriana(datos.cedula)) {

        mostrarError(
            "cedula",
            "La cédula ecuatoriana no es válida."
        );

        esValido = false;
    }

    // CÉDULA DUPLICADA
    const cedulaExiste = estudiantes.some(
        estudiante =>
            estudiante.cedula === datos.cedula &&
            estudiante.id !== entradaId.value
    );

    if (cedulaExiste) {

        mostrarError(
            "cedula",
            "Ya existe un estudiante registrado con esta cédula."
        );

        esValido = false;
    }

    // APELLIDOS
    if (!expresiones.apellidos.test(datos.apellidos)) {

        mostrarError(
            "apellidos",
            "Ingrese apellidos válidos, solo letras y espacios."
        );

        esValido = false;
    }

    // NOMBRES
    if (!expresiones.nombres.test(datos.nombres)) {

        mostrarError(
            "nombres",
            "Ingrese nombres válidos, solo letras y espacios."
        );

        esValido = false;
    }

    // DIRECCIÓN
    if (!expresiones.direccion.test(datos.direccion)) {

        mostrarError(
            "direccion",
            "La dirección debe tener entre 5 y 120 caracteres válidos."
        );

        esValido = false;
    }

    // TELÉFONO
    if (!expresiones.telefono.test(datos.telefono)) {

        mostrarError(
            "telefono",
            "Ingrese un celular ecuatoriano de 10 dígitos que comience con 09."
        );

        esValido = false;
    }

    // CORREO
    if (!expresiones.correo.test(datos.correo)) {

        mostrarError(
            "correo",
            "Ingrese un correo electrónico válido."
        );

        esValido = false;
    }

    // FACULTAD
    if (datos.facultad === "") {

        mostrarError(
            "facultad",
            "Seleccione una facultad."
        );

        esValido = false;
    }

    // NIVEL
    if (datos.nivel === "") {

        mostrarError(
            "nivel",
            "Seleccione un nivel académico."
        );

        esValido = false;
    }

    // PARALELO
    if (datos.paralelo === "") {

        mostrarError(
            "paralelo",
            "Seleccione un paralelo."
        );

        esValido = false;
    }

    return esValido;
}


// 8. GUARDAR EN LOCALSTORAGE USANDO JSON

function guardarEnLocalStorage() {

    const datosJSON = JSON.stringify(estudiantes);

    localStorage.setItem(CLAVE_STORAGE, datosJSON);
}


// 9. MOSTRAR ESTUDIANTES EN LA TABLA

function renderizarEstudiantes() {

    cuerpoTabla.innerHTML = "";

    const textoBusqueda = buscador.value
        .trim()
        .toLowerCase();

    const estudiantesFiltrados = estudiantes.filter(
        estudiante => {

            const texto = (
                estudiante.cedula + " " +
                estudiante.apellidos + " " +
                estudiante.nombres
            ).toLowerCase();

            return texto.includes(textoBusqueda);
        }
    );

    contador.textContent =
        estudiantes.length +
        (estudiantes.length === 1
            ? " estudiante registrado"
            : " estudiantes registrados");

    if (estudiantesFiltrados.length === 0) {

        const fila = document.createElement("tr");
        const celda = document.createElement("td");

        celda.colSpan = 10;
        celda.style.textAlign = "center";
        celda.textContent = textoBusqueda
            ? "No se encontraron estudiantes."
            : "No hay estudiantes registrados.";

        fila.appendChild(celda);
        cuerpoTabla.appendChild(fila);

        return;
    }

    estudiantesFiltrados.forEach(estudiante => {

        const fila = document.createElement("tr");

        const columnas = [
            estudiante.cedula,
            estudiante.apellidos,
            estudiante.nombres,
            estudiante.direccion,
            estudiante.telefono,
            estudiante.correo,
            estudiante.facultad,
            estudiante.nivel,
            estudiante.paralelo
        ];

        // textContent evita interpretar datos como HTML
        columnas.forEach(valor => {

            const celda = document.createElement("td");

            celda.textContent = valor;

            fila.appendChild(celda);
        });

        const celdaAcciones = document.createElement("td");

        const botonEditar = document.createElement("button");

        botonEditar.textContent = "Editar";
        botonEditar.className = "btn-editar";
        botonEditar.type = "button";

        botonEditar.addEventListener("click", () => {
            prepararEdicion(estudiante.id);
        });

        const botonEliminar = document.createElement("button");

        botonEliminar.textContent = "Eliminar";
        botonEliminar.className = "btn-eliminar";
        botonEliminar.type = "button";

        botonEliminar.addEventListener("click", () => {
            eliminarEstudiante(estudiante.id);
        });

        celdaAcciones.appendChild(botonEditar);
        celdaAcciones.appendChild(botonEliminar);

        fila.appendChild(celdaAcciones);
        cuerpoTabla.appendChild(fila);
    });
}


// 10. CREATE Y UPDATE - REGISTRAR O ACTUALIZAR

formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const datos = obtenerDatosFormulario();

    if (!validarFormulario(datos)) {
        return;
    }

    if (estaEditando) {

        // UPDATE: modificar el registro seleccionado
        const indice = estudiantes.findIndex(
            estudiante => estudiante.id === entradaId.value
        );

        if (indice === -1) {
            alert("No se encontró el estudiante.");
            reiniciarFormulario();
            return;
        }

        estudiantes[indice] = {
            id: entradaId.value,
            ...datos
        };

        alert("Estudiante actualizado correctamente.");

    } else {

        // CREATE: registrar un nuevo estudiante
        const nuevoEstudiante = {
            id: crypto.randomUUID(),
            ...datos
        };

        estudiantes.push(nuevoEstudiante);

        alert("Estudiante registrado correctamente.");
    }

    guardarEnLocalStorage();
    reiniciarFormulario();
    renderizarEstudiantes();
});


// 11. PREPARAR EDICIÓN

function prepararEdicion(id) {

    const estudiante = estudiantes.find(
        estudiante => estudiante.id === id
    );

    if (!estudiante) {
        return;
    }

    entradaId.value = estudiante.id;

    campos.forEach(campo => {

        document.getElementById(campo).value =
            estudiante[campo];
    });

    estaEditando = true;

    botonGuardar.textContent = "Actualizar estudiante";

    botonCancelar.classList.remove("oculto");

    limpiarTodosLosErrores();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// 12. DELETE - ELIMINAR ESTUDIANTE

function eliminarEstudiante(id) {

    const estudiante = estudiantes.find(
        estudiante => estudiante.id === id
    );

    if (!estudiante) {
        return;
    }

    const confirmar = confirm(
        "¿Está seguro de eliminar a " +
        estudiante.nombres + " " +
        estudiante.apellidos + "?"
    );

    if (!confirmar) {
        return;
    }

    estudiantes = estudiantes.filter(
        estudiante => estudiante.id !== id
    );

    if (estaEditando && entradaId.value === id) {
        reiniciarFormulario();
    }

    guardarEnLocalStorage();
    renderizarEstudiantes();

    alert("Estudiante eliminado correctamente.");
}


// 13. REINICIAR FORMULARIO

function reiniciarFormulario() {

    formulario.reset();

    entradaId.value = "";

    estaEditando = false;

    botonGuardar.textContent = "Registrar estudiante";

    botonCancelar.classList.add("oculto");

    limpiarTodosLosErrores();
}


// 14. BOTONES CANCELAR Y LIMPIAR

botonCancelar.addEventListener(
    "click",
    reiniciarFormulario
);

botonLimpiar.addEventListener("click", () => {

    reiniciarFormulario();
});


// 15. LIMPIAR ERRORES AL MODIFICAR CAMPOS

campos.forEach(campo => {

    document.getElementById(campo)
        .addEventListener("input", () => {
            limpiarError(campo);
        });
});


// 16. BUSCAR ESTUDIANTES

buscador.addEventListener("input", () => {

    renderizarEstudiantes();
});


// 17. INICIAR APLICACIÓN

renderizarEstudiantes();

console.log(
    "Sistema de Registro de Estudiantes ULEAM iniciado."
);
