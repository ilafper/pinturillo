// Obtén el canvas y su contexto 2D
const canvas = document.getElementById("paintCanvas"); // Obtiene el elemento canvas del HTML
const pincel = canvas.getContext("2d"); // Obtiene el contexto 2D para poder dibujar sobre el canvas

// Función para ajustar el tamaño del canvas al 100% del contenedor
function ajustarCanvas() {
    const dibujo = document.querySelector('.donde'); // Selecciona el contenedor del canvas
    canvas.width = dibujo.offsetWidth; // Ajusta el ancho del canvas al del contenedor
    canvas.height = dibujo.offsetHeight; // Ajusta la altura del canvas al del contenedor
}

window.addEventListener('resize', ajustarCanvas); // Añade un evento para ajustar el tamaño del canvas cuando la ventana cambia de tamaño
ajustarCanvas(); // Ajusta el tamaño del canvas al cargar la página

// Variables globales que manejan el estado del juego
let painting = false; 
let color = document.getElementById("colorElegido").value; 
let grosorpincel = document.getElementById("grosorpincel").value; 
 // Indica si el jugador está en modo borrador
let isErasing = false;
let tiempo; 
let tiempoActivo = false; 
let temporizador;
let rondaActual = 1; 
let puntosJugador = 0;
let puntosIA = 0;
let jugadorDibuja = false;

// Función para obtener la coordenadas del ratón dentro del canvas
function cooordenadasRaton(event) {
    const rect = canvas.getBoundingClientRect(); // Obtiene la posición del canvas en la página
    return {
        x: event.clientX - rect.left, // Calcula la posición X del ratón dentro del canvas
        y: event.clientY - rect.top // Calcula la posición Y del ratón dentro del canvas
    };
}

// Función que se ejecuta cuando el jugador empieza a dibujar
function empezar(event) {
    if (!jugadorDibuja) {
        jugadorDibuja = true; 
        iniciarIA();
        //console.log(palabraCorrecta, categoriaCorrecta);
    }
    painting = true; // Marca que el jugador está dibujando
    pincel.beginPath(); // Inicia un nuevo trazo en el canvas
    const pos = cooordenadasRaton(event);
    pincel.moveTo(pos.x, pos.y); // Mueve el pincel a la posición del ratón
    if (!tiempoActivo) iniciarTemporizador();
}

// Función que dibuja sobre el canvas cuando el ratón se mueve
function draw(event) {
    if (!painting) return; // Si no estamos pintando, no hacemos nada
    const pos = cooordenadasRaton(event); // Obtiene la posición actual del ratón
    pincel.lineTo(pos.x, pos.y); // Dibuja una línea hasta la nueva posición
    pincel.strokeStyle = isErasing ? "#FFFFFF" : color; // Si estamos borrando, el color será blanco, si no, usará el color seleccionado
    pincel.lineWidth = grosorpincel; // Ajusta el grosor del pincel
    pincel.lineCap = "round"; // Hace que las líneas sean redondeadas
    pincel.stroke(); // Dibuja la línea
}

// Función que para el dibujo
function parar() {
    painting = false; 
    pincel.beginPath();
}


canvas.addEventListener("mousedown", empezar); // Inicia el dibujo cuando el jugador hace click
canvas.addEventListener("mousemove", draw); // Dibuja mientras el ratón se mueve
canvas.addEventListener("mouseup", parar); // Para el dibujo cuando el jugador suelta el click
canvas.addEventListener("mouseleave", parar); // Para el dibujo si el ratón sale del canvas

// Cambia el color del pincel cuando el jugador selecciona un color
document.getElementById("colorElegido").addEventListener("change", (e) => {
    color = e.target.value; 
});

// Cambia el grosor del pincel cuando el jugador ajusta el slider
document.getElementById("grosorpincel").addEventListener("input", (e) => {
    grosorpincel = e.target.value; 
});

// Limpia el canvas cuando el jugador hace click en el botón de borrar
document.getElementById("clearCanvas").addEventListener("click", () => {
    pincel.clearRect(0, 0, canvas.width, canvas.height); 
});

// Alterna entre los modos "Dibujar" y "Borrar" cuando el jugador hace click en el botón de borrar
document.querySelector(".deletePAINT").addEventListener("click", () => {
    isErasing = !isErasing; // Cambia el modo entre borrar y dibujar
    const deleteBtn = document.querySelector(".deletePAINT");
    deleteBtn.textContent = isErasing ? "Dibujar" : "Borrar"; // Cambia el texto del botón , depepende del modo
});

// lista de palabras con categorias
const palabrasRandom = {
    comida: ["manzana", "pizza", "hamburguesa", "sushi", "taco", "helado", "ensalada", "pasta", "queso", "pan", "arroz", "pollo", "pescado", "fresa", "uva", "sandía", "limón", "zanahoria", "tomate", "cebolla"],
    vehiculo: ["coche", "bicicleta", "motocicleta", "autobús", "camión", "tren", "avión", "barco", "submarino", "tractor", "patinete", "helicóptero", "tanque", "ambulancia", "taxi", "furgoneta", "yate", "moto acuática", "cohete", "triciclo"],
    tecnologia: ["computadora", "teléfono", "tablet", "teclado", "mouse", "monitor", "impresora", "router", "cámara", "dron", "smartwatch", "auriculares", "altavoz", "batería", "cargador", "disco duro", "memoria USB", "laptop", "proyector", "consola"],
    animales: ["perro", "gato", "elefante", "tigre", "león", "jirafa", "mono", "oso", "pájaro", "pez", "tortuga", "serpiente", "rana", "caballo", "vaca", "oveja", "cerdo", "conejo", "ardilla", "delfín"]
};

// Función para obtener una palabra aleatoria de una categoría
function obtenerPalabraAleatoria(palabrasRandom, categoria) {
    const palabras = palabrasRandom[categoria]; // Obtiene la lista de palabras de la categoría
    return palabras ? palabras[Math.floor(Math.random() * palabras.length)] : "Categoría no encontrada"; // Devuelve una palabra aleatoria de la categoría
}

let palabraCorrecta; // Palabra correcta de la ronda
let categoriaCorrecta; // Categoría de la palabra correcta

// Inicia una nueva ronda
function iniciarRonda() {
    if (rondaActual > 5) return finalizarJuego(); // Si ya pasaron 5 rondas, termina el juego

    const categorias = Object.keys(palabrasRandom); // Obtiene las categorías disponibles
    
    categoriaCorrecta = categorias[Math.floor(Math.random() * categorias.length)]; // Elige una categoría aleatoria
    palabraCorrecta = obtenerPalabraAleatoria(palabrasRandom, categoriaCorrecta); // Obtiene una palabra aleatoria de la categoría seleccionada
    //console.log(categoriaCorrecta, palabraCorrecta); // Muestra la categoría y palabra en la consola (para depuración)
    
    $(".palabra span").text(palabraCorrecta); // Muestra la palabra correcta en la interfaz (se oculta para el jugador)
    //tiempo de la ronda en seg.
    tiempo = 20;
    tiempoActivo = false; // Marca que el temporizador no está activo
    $("#tiempoRestante").text(tiempo); // Muestra el tiempo restante

    jugadorDibuja = false;  // Reinicia el estado de dibujo
    mostrarMensaje("Sistema", "Esperando a que el jugador dibuje."); // Muestra un mensaje en el chat esperando que el jugador empiece a dibujar
}

// Inicia el temporizador de la ronda
function iniciarTemporizador() {
    tiempoActivo = true; // Marca que el temporizador está activo
    temporizador = setInterval(function() {
        if (tiempo <= 0) {
            clearInterval(temporizador); // Detiene el temporizador cuando el tiempo llega a 0
            puntosJugador++; // El jugador gana un punto
            $("#puntosJugador").text(puntosJugador); // Actualiza los puntos del jugador
            rondaActual++; // Pasa a la siguiente ronda
            iniciarRonda(); // Inicia una nueva ronda
        } else {
            tiempo--; // Decrementa el tiempo
            $("#tiempoRestante").text(tiempo); // Actualiza el tiempo restante en la interfaz
        }
    }, 1000); // Se actualiza cada segundo
}

// Inicia la IA para que empiece a adivinar
function iniciarIA() {
    if (!jugadorDibuja) {
        mostrarMensaje("Sistema", "Esperando hasta que el jugador empiece a dibujar..."); // Muestra mensaje esperando que el jugador dibuje
        return; // No se inicia la IA hasta que el jugador empiece a dibujar
    }

    const intentos = palabrasRandom[categoriaCorrecta].slice(); // Copia las palabras de la categoría correcta
    const iaInterval = setInterval(function() {
        if (tiempo <= 0) {
            clearInterval(iaInterval); // Detiene el intento de la IA cuando el tiempo se acaba
            return;
        }

        const intento = intentos.splice(Math.floor(Math.random() * intentos.length), 1)[0]; // La IA elige una palabra aleatoria de la categoría correcta
        mostrarMensaje("IA", intento); // Muestra el intento de la IA en el chat

        // Verifica si la IA adivinó correctamente
        if (intento === palabraCorrecta) {
            mostrarMensaje("Jugador", "¡Correcto!"); //si la la ia acierta la palabra ell jugador manda el mensaje correcto.
            clearInterval(iaInterval); // Detiene los intentos de la IA
            clearInterval(temporizador); // Detiene el temporizador
            puntosIA++; // La IA gana un punto
            $("#puntosIA").text(puntosIA); // Actualiza los puntos de la IA
            rondaActual++; // Avanza a la siguiente ronda
            iniciarRonda(); // Inicia una nueva ronda
        } else {
            mostrarMensaje("Jugador", "Incorrecto"); // Si la IA no adivina correctamente, muestra un mensaje
        }
    }, 2000); // La IA hace un intento cada 2 segundos
}

// Función para mostrar los mensajes en el chat
function mostrarMensaje(usuario, mensaje) {
    //varible para alamacenar la clase del usuario y segun sea ia jugador mostrar el nombre
    let claseUsuario = ''; 

    if (usuario === "IA") {
        claseUsuario = 'ia';  
    } else if (usuario === "Sistema") {
        claseUsuario = 'sistema'; 
    } else if (usuario === "Jugador") {
        claseUsuario = 'jugador'; 
    }

    // Inserta el mensaje en el chat
    $("#chatMessages").append(`<p class="${claseUsuario}"><strong>${usuario}:</strong> ${mensaje}</p>`);
    $("#chatMessages").scrollTop($("#chatMessages")[0].scrollHeight); // Desplaza el chat hacia el final
}

// Finaliza el juego y muestra el resultado
function finalizarJuego() {
    let resultado = "Empate";
    if (puntosJugador > puntosIA) resultado = "¡Ganaste!";
    else if (puntosIA > puntosJugador) resultado = "La IA ganó";

    alert(`Juego terminado. ${resultado}`); // Muestra el resultado final
}

// Inicializa el juego al cargar la página
$(document).ready(function () {
    iniciarRonda(); // Inicia la primera ronda
});
