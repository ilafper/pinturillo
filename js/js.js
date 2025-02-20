// Obtén el canvas y su contexto 2D

const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");

// Función para ajustar el tamaño del canvas al 100% del contenedor
function ajustarCanvas() {
    const dibujo = document.querySelector('.donde');
    canvas.width = dibujo.offsetWidth;
    canvas.height = dibujo.offsetHeight;
}

window.addEventListener('resize', ajustarCanvas);
ajustarCanvas();

let painting = false;
let color = document.getElementById("colorPicker").value;
let brushSize = document.getElementById("brushSize").value;
let isErasing = false;
let tiempo;
let tiempoActivo = false;
let temporizador;
let rondaActual = 1;
let puntosJugador = 0;
let puntosIA = 0;
let jugadorDibuja = false;  


// Función para obtener la posición correcta del mouse dentro del canvas
function getMousePos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
function startPainting(event) {
    if (!jugadorDibuja) {
        jugadorDibuja = true;  // El jugador empieza a dibujar
        iniciarIA();  // Iniciar la IA después de que el jugador empieza a dibujar
        console.log(palabraCorrecta, categoriaCorrecta);  // Verifica las palabras correctas y la categoría
    }
    painting = true;
    ctx.beginPath();
    const pos = getMousePos(event);
    ctx.moveTo(pos.x, pos.y);
    if (!tiempoActivo) iniciarTemporizador();
}

function draw(event) {
    if (!painting) return;
    const pos = getMousePos(event);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = isErasing ? "#FFFFFF" : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.stroke();
}

function stopPainting() {
    painting = false;
    ctx.beginPath();
}

canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopPainting);
canvas.addEventListener("mouseleave", stopPainting);

document.getElementById("colorPicker").addEventListener("change", (e) => {
    color = e.target.value;
});

document.getElementById("brushSize").addEventListener("input", (e) => {
    brushSize = e.target.value;
});

document.getElementById("clearCanvas").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

document.querySelector(".deletePAINT").addEventListener("click", () => {
    isErasing = !isErasing;
    const deleteBtn = document.querySelector(".deletePAINT");
    deleteBtn.textContent = isErasing ? "Dibujar" : "Borrar";
});

const palabrasRandom = {
    comida: ["manzana", "pizza", "hamburguesa", "sushi", "taco", "helado", "ensalada", "pasta", "queso", "pan", "arroz", "pollo", "pescado", "fresa", "uva", "sandía", "limón", "zanahoria", "tomate", "cebolla"],
    vehiculo: ["coche", "bicicleta", "motocicleta", "autobús", "camión", "tren", "avión", "barco", "submarino", "tractor", "patinete", "helicóptero", "tanque", "ambulancia", "taxi", "furgoneta", "yate", "moto acuática", "cohete", "triciclo"],
    tecnologia: ["computadora", "teléfono", "tablet", "teclado", "mouse", "monitor", "impresora", "router", "cámara", "dron", "smartwatch", "auriculares", "altavoz", "batería", "cargador", "disco duro", "memoria USB", "laptop", "proyector", "consola"],
    animales: ["perro", "gato", "elefante", "tigre", "león", "jirafa", "mono", "oso", "pájaro", "pez", "tortuga", "serpiente", "rana", "caballo", "vaca", "oveja", "cerdo", "conejo", "ardilla", "delfín"]
};

function obtenerPalabraAleatoria(palabrasRandom, categoria) {
    const palabras = palabrasRandom[categoria];
    return palabras ? palabras[Math.floor(Math.random() * palabras.length)] : "Categoría no encontrada";
}


let palabraCorrecta; 
let categoriaCorrecta;  

function iniciarRonda() {
    if (rondaActual > 5) return finalizarJuego();

    const categorias = Object.keys(palabrasRandom);
    categoriaCorrecta = categorias[Math.floor(Math.random() * categorias.length)];
    palabraCorrecta = obtenerPalabraAleatoria(palabrasRandom, categoriaCorrecta);
    console.log(categoriaCorrecta, palabraCorrecta);
    
    // Mostrar la palabra correcta en el DOM
    $(".palabra span").text(palabraCorrecta);

    tiempo = 20;
    tiempoActivo = false;
    $("#tiempoRestante").text(tiempo);

    // La IA no comienza hasta que el jugador empiece a dibujar
    jugadorDibuja = false;  // Reiniciar el estado antes de cada ronda
    mostrarMensaje("Sistema", "Esperando a que el jugador dibuje.");
}


function iniciarTemporizador() {
    tiempoActivo = true;
    temporizador = setInterval(function() {
        if (tiempo <= 0) {
            clearInterval(temporizador);
            puntosJugador++;
            $("#puntosJugador").text(puntosJugador);
            rondaActual++;
            iniciarRonda();
        } else {
            tiempo--;
            $("#tiempoRestante").text(tiempo);
        }
    }, 1000);
}

function iniciarIA() {
    if (!jugadorDibuja) {
        mostrarMensaje("Sistema", "Esperando hasta que el jugador empiece a dibujar...");
        return;  // No se inicia la IA hasta que el jugador dibuje
    }

    const intentos = palabrasRandom[categoriaCorrecta].slice(); // Solo intenta palabras de la categoría correcta

    const iaInterval = setInterval(function() {
        if (tiempo <= 0) {
            clearInterval(iaInterval);
            return;
        }

        // La IA elige una palabra aleatoria de la categoría correcta
        const intento = intentos.splice(Math.floor(Math.random() * intentos.length), 1)[0]; 
        mostrarMensaje("IA", intento);

        // Verificar si la IA adivinó la palabra correcta
        if (intento === palabraCorrecta) {
            mostrarMensaje("Jugador", "¡Correcto!");
            clearInterval(iaInterval);
            clearInterval(temporizador);
            puntosIA++;  // La IA suma un punto solo si adivinó correctamente
            $("#puntosIA").text(puntosIA);
            rondaActual++;
            iniciarRonda();  // Inicia una nueva ronda
        } else {
            mostrarMensaje("Jugador", "Incorrecto");
        }
    }, 2000);  //cada 2 seg
}


function mostrarMensaje(usuario, mensaje) {
    let claseUsuario = ''; 

    // Determina si el mensaje es de la IA, jugador o sistema
    if (usuario === "IA") {
        claseUsuario = 'ia';  // Mensaje de la IA, alineado a la izquierda
    } else if (usuario === "Sistema") {
        claseUsuario = 'sistema';  // Mensaje del sistema, centrado
    } else if (usuario === "Jugador") {
        claseUsuario = 'jugador';  // Mensaje del jugador, alineado a la derecha
    }

    // Inserta el mensaje con la clase correspondiente
    $("#chatMessages").append(`<p class="${claseUsuario}"><strong>${usuario}:</strong> ${mensaje}</p>`);
    $("#chatMessages").scrollTop($("#chatMessages")[0].scrollHeight);
}



function finalizarJuego() {
    let resultado = "Empate";
    if (puntosJugador > puntosIA) resultado = "¡Ganaste!";
    else if (puntosIA > puntosJugador) resultado = "La IA ganó";

    alert(`Juego terminado. ${resultado}`);
}

$(document).ready(function () {
    iniciarRonda();
});
