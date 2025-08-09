// El principal objetivo de este desafío es fortalecer tus habilidades en lógica de programación. Aquí deberás desarrollar la lógica para resolver el problema.


let amigos = [];
let asignacionesGlobal = {};

// 🎵 Sonido de celebración (opcional)
const sonidoCelebracion = new Audio("https://www.soundjay.com/human/cheering-01.mp3");

function consultarIndividual() {
    const nombre = prompt("Escribe tu nombre:");
    if (asignacionesGlobal[nombre]) {
        alert(`Tu amigo secreto es: ${asignacionesGlobal[nombre]}`);
        sonidoCelebracion.play(); // 🎉 Reproduce el sonido
    }
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

    const asignaciones = {};
    const disponibles = [...amigos];

    for (let i = 0; i < amigos.length; i++) {
        const actual = amigos[i];
        let posibles = disponibles.filter((nombre) => nombre !== actual);

        if (posibles.length === 0) {
            return sortearAmigo(); // Reinicia si no hay asignación válida
        }

        const elegido = posibles[Math.floor(Math.random() * posibles.length)];
        asignaciones[actual] = elegido;
        disponibles.splice(disponibles.indexOf(elegido), 1);
    }

    asignacionesGlobal = asignaciones;

    // 🎉 Animación de cuenta regresiva
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

    for (const [amigo, secreto] of Object.entries(asignacionesGlobal)) {
        const li = document.createElement("li");
        li.textContent = `${amigo} → 🎁 ${secreto}`;
        li.classList.add("reveal");
        resultado.appendChild(li);
    }
}

// Permite consultar asignación individual mediante prompt
function consultarIndividual() {
    const deseaVer = confirm("¿Quieres consultar tu amigo secreto de forma individual?");
    if (!deseaVer) return;

    const nombre = prompt("Escribe tu nombre exactamente como lo ingresaste:");
    if (!nombre || !asignacionesGlobal[nombre]) {
        alert("Nombre no encontrado. Asegúrate de escribirlo correctamente.");
        return;
    }

    alert(`🎁 Tu amigo secreto es: ${asignacionesGlobal[nombre]}`);
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
