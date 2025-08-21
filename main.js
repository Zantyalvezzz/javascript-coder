const pantalla = document.getElementById("pantalla");
const botones = document.querySelectorAll("#teclado button");

const listaHistorial = document.getElementById("historial-lista");
const btnLimpiarHistorial = document.getElementById("limpiar-historial");

let resultadoMostrado = false;
let historial = JSON.parse(localStorage.getItem("historial")) || [];
let ultimoRegistro = "";
let expresionCompleta = "";

if (historial.length > 0) {
    ultimoRegistro = historial[historial.length - 1];
}

actualizarHistorial();

botones.forEach(boton => {
    boton.addEventListener("click", () => {
        const valor = boton.textContent;

        if (boton.classList.contains("num")) {
            siEligeNum(valor);
        } else if (boton.classList.contains("operations")) {
            siEligeOp(valor);
        } else if (boton.classList.contains("igual")) {
            siEligeIgual();
        } else if (boton.classList.contains("limpiar")) {
            limpiarCalculadora();
        }
    });
});

btnLimpiarHistorial.addEventListener("click", () => {
    historial = [];
    localStorage.removeItem("historial");
    ultimoRegistro = "";
    actualizarHistorial();
});

document.addEventListener("keydown", (event) => {
    const tecla = event.key;

    if (!isNaN(tecla)) {
        siEligeNum(tecla);
    } else if (["+", "-", "*", "/"].includes(tecla)) {
        const operador = convertirOperador(tecla);
        siEligeOp(operador);
    } else if (tecla === "Enter" || tecla === "=") {
        siEligeIgual();
    } else if (tecla === "Escape") {
        limpiarCalculadora();
    }
});


function convertirOperador(tecla) {
    switch (tecla) {
        case "*": return "x";
        case "/": return "÷";
        default: return tecla;
    }
}

function esOperador(solouno) {
    return ["+", "-", "x", "÷"].includes(solouno);
}

function siEligeNum(num) {
    if (resultadoMostrado) {
        expresionCompleta = num;
        resultadoMostrado = false;
    } else {
        if (expresionCompleta === "0") {
            expresionCompleta = num;
        } else {
            expresionCompleta += num;
        }
    }
    actualizarPantalla();
}

function siEligeOp(op) {
    if (expresionCompleta === "") return;

    const ultimoCaracter = expresionCompleta.slice(-1);

    if (esOperador(ultimoCaracter)) return;

    expresionCompleta += op;
    resultadoMostrado = false;
    actualizarPantalla();
}

function siEligeIgual() {
    if (expresionCompleta === "") return;

    const resultado = calcularResultado(expresionCompleta);

    if (resultado !== "Error" && expresionCompleta !== resultado.toString()) {
        const registro = expresionCompleta + "=" + resultado;
        if (registro !== ultimoRegistro) {
            historial.push(registro);
            localStorage.setItem("historial", JSON.stringify(historial));
            actualizarHistorial();
            ultimoRegistro = registro;
        }
        expresionCompleta = resultado.toString();
        resultadoMostrado = true;
    } else if (resultado === "Error") {
        expresionCompleta = "";
    }

    pantalla.textContent = resultado;

    Swal.fire({
        title: "Resultado:",
        text: pantalla.textContent,
        customClass: {
            popup: 'alerta-resultado'
        }
    });


    fetch("https://68a6d44d639c6a54e99ffe1e.mockapi.io/calculadora", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registro: expresionCompleta + "=" + resultado })
    })
        .then(response => response.json())
        .catch(error => {
            console.error("error al guardar")
        });

}

function calcularResultado(expresion) {
    const expresionEvaluada = expresion.replace(/x/g, "*").replace(/÷/g, "/");
    try {
        return eval(expresionEvaluada);
    } catch {
        return "Error";
    }
}

function limpiarCalculadora() {
    expresionCompleta = "";
    resultadoMostrado = false;
    pantalla.textContent = "0";
}

function actualizarPantalla() {
    pantalla.textContent = expresionCompleta || "0";
}

function actualizarHistorial() {
    listaHistorial.innerHTML = "";
    historial.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        listaHistorial.appendChild(li);
    });
}
