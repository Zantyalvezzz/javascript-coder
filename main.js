const pantalla = document.getElementById("pantalla");
const botones = document.querySelectorAll("#teclado button");

const listaHistorial = document.getElementById("historial-lista");
const btnClnHis = document.getElementById("limpiar-historial");

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
            siEligeC();
        } else if (boton.classList.contains("limpiar")) {
            limpiarCalculadora();
        }
    });
});

btnClnHis.addEventListener("click", () => {
    historial = [];
    localStorage.removeItem("historial");
    ultimoRegistro = "";
    actualizarHistorial();
});

document.addEventListener("keydown", (event) => {
    const tecla = event.key;

    if (!isNaN(tecla)) {
        manejarNumero(tecla);
    } else if (["+", "-", "*", "/"].includes(tecla)) {
        const operador = convertirOperador(tecla);
        manejarOperacion(operador);
    } else if (tecla === "Enter" || tecla === "=") {
        manejarIgual();
    } else if (tecla === "Escape") {
        limpiarCalculadora();
    }
});

function manejarNumero(num) {
    siEligeNum(num);
}

function convertirOperador(tecla) {
    switch (tecla) {
        case "*": return "x";
        case "/": return "÷";
        default: return tecla;
    }
}

function manejarOperacion(op) {
    siEligeOp(op);
}

function manejarIgual() {
    siEligeC();
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

    const ultimoChar = expresionCompleta.slice(-1);

    if (esOperador(ultimoChar)) {
        expresionCompleta = expresionCompleta.slice(0, -1) + op;
    } else {
        expresionCompleta += op;
    }
    resultadoMostrado = false;
    actualizarPantalla();
}

function siEligeC() {
    if (expresionCompleta === "") return;

    const expresionEval = expresionCompleta.replace(/x/g, "*").replace(/÷/g, "/");

    try {
        const resultado = eval(expresionEval);

        if (expresionCompleta !== resultado.toString()) {
            const registro = expresionCompleta + "=" + resultado;

            if (registro !== ultimoRegistro) {
                historial.push(registro);
                localStorage.setItem("historial", JSON.stringify(historial));
                actualizarHistorial();
                ultimoRegistro = registro;
            }
        }

        pantalla.textContent = resultado;
        expresionCompleta = resultado.toString();
        resultadoMostrado = true;
    } catch {
        pantalla.textContent = "Error";
        expresionCompleta = "";
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
