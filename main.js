const opcionesValidas = ["1", "2", "3", "4", "sumar", "restar", "multiplicar", "dividir"];

function sumar(a, b) {
    return a + b;
}

function restar(a, b) {
    return a - b;
}

function multiplicar(a, b) {
    return a * b;
}

function dividir(a, b) {
    return a / b;
}

function nombreOperacion(op) {
    switch(op) {
        case "1":
        case "sumar":
            return "Suma";
        case "2":
        case "restar":
            return "Resta";
        case "3":
        case "multiplicar":
            return "Multiplicación";
        case "4":
        case "dividir":
            return "División";
        default:
            return "Desconocida";
    }
}

function calculadora() {
    let operacion;

    while (!opcionesValidas.includes(operacion)) {
        operacion = prompt(
            "¿Qué operación deseas realizar?\n" +
            "1. Sumar\n" +
            "2. Restar\n" +
            "3. Multiplicar\n" +
            "4. Dividir"
        );

        if (!opcionesValidas.includes(operacion)) {
            alert("Opción inválida, por favor elija una de la lista.");
        }
    }

    let numero1 = parseFloat(prompt("Ingresa el primer número"));
    let numero2 = parseFloat(prompt("Ingresa el segundo número:"));

    let resultado;
    let viewresultado = true;

    switch (operacion) {
        case "1":
        case "sumar":
            resultado = sumar(numero1, numero2);
            break;
        case "2":
        case "restar":
            resultado = restar(numero1, numero2);
            break;
        case "3":
        case "multiplicar":
            resultado = multiplicar(numero1, numero2);
            break;
        case "4":
        case "dividir":
            if (numero2 !== 0) {
                resultado = dividir(numero1, numero2);
            } else {
                alert("error 404 syntax err");
                viewresultado = false;
            }
            break;
        default:
            alert("Opción no válida");
            viewresultado = false;
    }

    if (viewresultado) {
        alert("El resultado es: " + resultado);

        const resumen = {
            operación: nombreOperacion(operacion),
            primerNúmero: numero1,
            segundoNúmero: numero2,
            resultado: resultado
        };

        alert(
            "Resumen:\n" +
            "Operación realizada: " + resumen.operación + "\n" +
            "Primer número: " + resumen.primerNúmero + "\n" +
            "Segundo número: " + resumen.segundoNúmero + "\n" +
            "Resultado: " + resumen.resultado
        );
    }
}

let continuar = "si";

while (continuar === "si") {
    calculadora();
    continuar = prompt("¿Desea realizar otra operación? (si / no)").toLowerCase();
}
