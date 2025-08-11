let amigos = [];
let asignacionesGlobal = {};
let intentosFallidos = {}; // 🧠 Registro de intentos fallidos por jugador

// 🎵 Sonido de celebración (opcional)
const sonidoCelebracion = new Audio("https://www.soundjay.com/human/cheering-01.mp3");

// 🔢 Selección aleatoria segura con Math.floor
function seleccionarAleatorio(array, excluir = null) {
    const opciones = excluir ? array.filter(item => item !== excluir) : array;
    if (opciones.length === 0) return null;
    const indice = Math.floor(Math.random() * opciones.length);
    return opciones[indice];
}

// Función para agregar un amigo a la lista
function agregarAmigo() {
    const input = document.getElementById("amigo");
    const nombre = input.value.trim();

    if (nombre === "") {
        alert("Por favor, ingresa un nombre válido.");
        return;
    }

    if (amigos.includes(nombre)) {
        alert("Este nombre ya fue agregado.");
        return;
    }

    amigos.push(nombre);
    input.value = "";
    actualizarLista();
}

// Actualiza la lista visual de amigos con animación
function actualizarLista() {
    const lista = document.getElementById("listaAmigos");
    lista.innerHTML = "";

    amigos.forEach((amigo) => {
        const li = document.createElement("li");
        li.textContent = `🎁 ${amigo}`;
        li.classList.add("fade-in");
        lista.appendChild(li);
    });
}

// Realiza el sorteo de amigo secreto
function sortearAmigo() {
    if (amigos.length < 2) {
        alert("Necesitas al menos dos amigos para hacer el sorteo.");
        return;
    }

    let asignaciones = {};
    let intentos = 0;
    let exitoso = false;

    while (!exitoso && intentos < 5) {
        asignaciones = {};
        const disponibles = [...amigos];
        exitoso = true;

        for (let i = 0; i < amigos.length; i++) {
            const actual = amigos[i];
            let posibles = disponibles.filter((nombre) => nombre !== actual);

            if (posibles.length === 0) {
                exitoso = false;
                break;
            }

            const elegido = seleccionarAleatorio(posibles);
            asignaciones[actual] = elegido;
            disponibles.splice(disponibles.indexOf(elegido), 1);
        }

        intentos++;
    }

    if (!exitoso) {
        alert("No se pudo realizar el sorteo. Intenta nuevamente.");
        return;
    }

    asignacionesGlobal = asignaciones;

    iniciarCuentaRegresiva(() => {
        mostrarResultado();
        sonidoCelebracion.play();
        lanzarConfeti();
        consultarIndividual();
    });
}

// Muestra todas las asignaciones en la lista #resultado
function mostrarResultado() {
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = "<h3>🎉 Resultados del sorteo 🎉</h3>";

    const lista = document.createElement("ol");

    for (const [amigo, secreto] of Object.entries(asignacionesGlobal)) {
        const li = document.createElement("li");
        li.textContent = `${amigo} → 🎁 ${secreto}`;
        li.classList.add("reveal");
        lista.appendChild(li);
    }

    resultado.appendChild(lista);
}

// Consulta individual con intentos únicos
function consultarIndividual() {
    const deseaVer = confirm("¿Quieres consultar tu amigo secreto de forma individual?");
    if (!deseaVer) return;

    adivinarAmigoSecreto();
}

// Adivinar con control de intentos
function adivinarAmigoSecreto() {
    const nombreJugador = prompt("Escribe tu nombre exactamente como lo ingresaste:");

    if (!nombreJugador || !asignacionesGlobal[nombreJugador]) {
        alert("Nombre no encontrado. Asegúrate de escribirlo correctamente.");

        actualizarBotonReinicio();
        return;
    }

    if (!intentosFallidos[nombreJugador]) {
        intentosFallidos[nombreJugador] = [];
    }

    const intento = prompt("¿Quién crees que es tu amigo secreto?");

    if (intentosFallidos[nombreJugador].includes(intento)) {
        alert("⚠️ Ya intentaste ese nombre. Prueba con otro.");
        return;
    }

    const amigoSecreto = asignacionesGlobal[nombreJugador];

    if (intento === amigoSecreto) {
        alert("🎉 ¡Acertaste! Ese es tu amigo secreto.");
        sonidoCelebracion.play();
        lanzarConfeti();
        delete intentosFallidos[nombreJugador];

        actualizarBotonReinicio();
    } else {
        intentosFallidos[nombreJugador].push(intento);
        alert(`❌ Ese no es tu amigo secreto. Has hecho ${intentosFallidos[nombreJugador].length} intento(s).`);
    }
}

// Reinicia el juego
function reiniciarJuego() {
    amigos = [];
    asignacionesGlobal = {};
    intentosFallidos = {};

    document.getElementById("listaAmigos").innerHTML = "";
    document.getElementById("resultado").innerHTML = "";

    actualizarBotonSortear();

    alert("🔄 Juego reiniciado. Puedes volver a ingresar jugadores y hacer el sorteo.");
}

// 🎬 Cuenta regresiva antes de mostrar resultados
function iniciarCuentaRegresiva(callback) {
    const resultado = document.getElementById("resultado");
    resultado.innerHTML = "<h3>Preparando el sorteo...</h3>";
    let segundos = 3;

    const intervalo = setInterval(() => {
        resultado.innerHTML = `<h3>Revelando en... ${segundos} 🎉</h3>`;
        segundos--;

        if (segundos < 0) {
            clearInterval(intervalo);
            callback();
        }
    }, 1000);
}

// 🎊 Simulación de confeti (simple)
function lanzarConfeti() {
    const confeti = document.createElement("div");
    confeti.innerHTML = "🎊🎊🎊";
    confeti.style.position = "fixed";
    confeti.style.top = "20px";
    confeti.style.left = "50%";
    confeti.style.transform = "translateX(-50%)";
    confeti.style.fontSize = "2rem";
    confeti.style.zIndex = "9999";
    document.body.appendChild(confeti);

    setTimeout(() => confeti.remove(), 3000);
}

// 🔄 Botón: cambiar a modo reinicio
function actualizarBotonReinicio() {
    const boton = document.getElementById("sortearBtn");
    const icono = document.getElementById("iconoBtn");

    boton.textContent = "";
    icono.innerHTML = `<img src="assets/restart_alt.png" alt="Ícono de reinicio">`;
    boton.appendChild(icono);
    boton.appendChild(document.createTextNode(" Reiniciar juego"));

    boton.onclick = reiniciarJuego;
    boton.classList.add("reiniciar");
    boton.classList.add("rebote");
    setTimeout(() => boton.classList.remove("rebote"), 500);
}

// 🎲 Botón: volver a modo sorteo
function actualizarBotonSortear() {
    const boton = document.getElementById("sortearBtn");
    const icono = document.getElementById("iconoBtn");

    boton.textContent = "";
    icono.innerHTML = `<img src="assets/play_circle_outline.png" alt="Ícono para sortear">`;
    boton.appendChild(icono);
    boton.appendChild(document.createTextNode(" Sortear amigo"));

    boton.onclick = sortearAmigo;
    boton.classList.remove("reiniciar");
    boton.classList.add("rebote");
    setTimeout(() => boton.classList.remove("rebote"), 500);
}
