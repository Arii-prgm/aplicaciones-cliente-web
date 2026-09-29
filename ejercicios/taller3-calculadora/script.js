// Solicitar al usuario los dos números
let numero1 = parseFloat(prompt("Ingrese el primer número:"));
let numero2 = parseFloat(prompt("Ingrese el segundo número:"));

// Bucle de 5 iteraciones
for (let i = 1; i <= 5; i++) {

    let resultado;

    if (i === 1) {
        resultado = numero1 + numero2;
        document.write(
            "<p>1. SUMA: " + numero1 + " + " + numero2 + " = " + resultado + "</p>"
        );
    }

    else if (i === 2) {
        resultado = numero1 - numero2;
        document.write(
            "<p>2. RESTA: " + numero1 + " - " + numero2 + " = " + resultado + "</p>"
        );
    }

    else if (i === 3) {
        resultado = numero1 * numero2;
        document.write(
            "<p>3. MULTIPLICACIÓN: " + numero1 + " × " + numero2 + " = " + resultado + "</p>"
        );
    }

    else if (i === 4) {
        resultado = numero1 / numero2;
        document.write(
            "<p>4. DIVISIÓN: " + numero1 + " / " + numero2 + " = " + resultado + "</p>"
        );
    }

    else if (i === 5) {
        resultado = numero1 % numero2;
        document.write(
            "<p>5. MÓDULO: " + numero1 + " % " + numero2 + " = " + resultado + "</p>"
        );
    }
}