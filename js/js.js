// Obtén el canvas y su contexto 2D



const canvas = document.getElementById("paintCanvas");
const ctx = canvas.getContext("2d");

// Función para ajustar el tamaño del canvas al 100% del contenedor
function ajustarCanvas() {
    const dibujo = document.querySelector('.donde');
    canvas.width = dibujo.offsetWidth;  // Establecer el ancho del canvas al del contenedor
    canvas.height = dibujo.offsetHeight; // Establecer la altura del canvas al del contenedor
}

// Ajustar el tamaño del canvas cuando se carga la página y cuando se redimensiona la ventana
window.addEventListener('resize', ajustarCanvas);
ajustarCanvas(); // Llamar al cargar la página

let painting = false;
let color = document.getElementById("colorPicker").value;
let brushSize = document.getElementById("brushSize").value;

// Función para obtener la posición correcta del mouse dentro del canvas
function getMousePos(event) {
    const rect = canvas.getBoundingClientRect(); // Obtenemos el área visible del canvas
    return {
        x: event.clientX - rect.left, // Calculamos la posición X dentro del canvas
        y: event.clientY - rect.top   // Calculamos la posición Y dentro del canvas
    };
}

// Función para obtener la posición correcta del mouse dentro del canvas
function getMousePos(event) {
    const rect = canvas.getBoundingClientRect(); // Obtenemos el área visible del canvas
    return {
        x: event.clientX - rect.left, // Calculamos la posición X dentro del canvas
        y: event.clientY - rect.top   // Calculamos la posición Y dentro del canvas
    };
}


// Iniciar el dibujo
function startPainting(event) {
    painting = true;
    ctx.beginPath(); // Inicia una nueva línea
    const pos = getMousePos(event);  // Obtener la posición del ratón
    ctx.moveTo(pos.x, pos.y);       // Mover el lápiz a esa posición
}

// Dibujar en el canvas
function draw(event) {
    if (!painting) return;

    const pos = getMousePos(event);
    ctx.lineTo(pos.x, pos.y);        // Dibujar línea a la nueva posición
    ctx.strokeStyle = color;         // Establecer el color del trazo
    ctx.lineWidth = brushSize;       // Establecer el tamaño del pincel
    ctx.lineCap = "round";           // Suavizar las esquinas
    ctx.stroke();                    // Hacer el trazo
}

// Detener el dibujo
function stopPainting() {
    painting = false;
    ctx.beginPath(); // Reiniciar el trazo
}

// Eventos del mouse
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopPainting);
canvas.addEventListener("mouseleave", stopPainting);

// Cambiar color y tamaño del pincel
document.getElementById("colorPicker").addEventListener("change", (e) => {
    color = e.target.value;
});

document.getElementById("brushSize").addEventListener("input", (e) => {
    brushSize = e.target.value;
});

// Limpiar el canvas
document.getElementById("clearCanvas").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);  // Limpia el área del canvas
});









/*LISTA DE PALABRAS POR CATEGORIA*/


const palabrasRandom = {
    comida: ["manzana", "pizza", "hamburguesa", "sushi", "taco", "helado", "ensalada", "pasta", "queso", "pan", "arroz", "pollo", 
        "pescado", "fresa", "uva", "sandía", "limón", "zanahoria", "tomate", "cebolla"],
    vehiculo: ["coche", "bicicleta", "motocicleta", "autobús", "camión", "tren", "avión", "barco", 
        "submarino", "tractor", "patinete", "helicóptero", "tanque", "ambulancia", "taxi", "furgoneta", "yate", "moto acuática", "cohete", "triciclo"],
    tecnologia: ["computadora", "teléfono", "tablet", "teclado", "mouse", "monitor", "impresora", "router", 
        "cámara", "dron", "smartwatch", "auriculares", "altavoz", "batería", "cargador", "disco duro", "memoria USB", "laptop", "proyector", "consola"],
    animales: ["perro", "gato", "elefante", "tigre", "león", "jirafa", "mono", "oso", "pájaro", "pez", 
        "tortuga", "serpiente", "rana", "caballo", "vaca", "oveja", "cerdo", "conejo", "ardilla", "delfín"]
};

// Función para obtener una palabra aleatoria de una categoría específica
function obtenerPalabraAleatoria(palabrasRandom, categoria) {
    const palabras = palabrasRandom[categoria];
    if (palabras) {
        const indiceAleatorio = Math.floor(Math.random() * palabras.length);
        return palabras[indiceAleatorio];
    } else {
        return "Categoría no encontrada";
    }
}


$(document).ready(function () {
    
    // PARTE DE LAS PALABRAS
    const categorias = Object.keys(palabrasRandom);
    const categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];
    console.log();
    
    // Seleccionar una palabra aleatoria de la categoría
    const palabraAleatoria = obtenerPalabraAleatoria(palabrasRandom, categoriaAleatoria);

    // Mostrar la palabra en la sección correspondiente
    $(".palabra span").text(palabraAleatoria);
    
    //PARTE DE TEMPORIZADOR
    
    let tiempo = 15; 
    
    // Función para actualizar el temporizador cada segundo
    let temporizador = setInterval(function() {
        if (tiempo <= 0) {
            clearInterval(temporizador); // Detener el temporizador cuando llegue a 0
            alert("¡El tiempo ha terminado!");
        } else {
            tiempo--; // Reducir el tiempo
            $("#tiempoRestante").text(tiempo); // Actualizar el texto del temporizador
        }
    }, 1000); // Actualizar cada segundo (1000ms)
});