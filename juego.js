var contexto = document.getElementById("lienzojuego").getContext("2d")
contexto.canvas.width = 300
contexto.canvas.height = 530

// DIMENSIONES FIJAS (Evita colisiones falsas si la imagen tarda en cargar sobre internet)
var ANCHO_TUBERIA = 52;
var ALTO_TUBERIA_NORTE = 242;
var ESPACIO_TUBERIA = 110;
var ALTO_SUELO = 112;

// VARIABLES
var FPS = 60
var score = 0
var gravedad = 1.5
var personaje = {
    x: 50,
    y: 150,
    w: 35,
    h: 30
}

// Generador de palabras
var palabras = ["dog", "house", "sun", "bird", "green", "eye", "table", "classroom", "student", "water", "book", "school", "friend"];
var palabrasPendientes = [...palabras];
var juegoGanado = false;
var tuberias = new Array()

function obtenerPalabra() {
    if (palabrasPendientes.length === 0) {
        juegoGanado = true;
        return "";
    }
    return palabrasPendientes.shift();
}

// Traducciones
var traducciones = {
    dog: "Perro", house: "Casa", sun: "Sol", bird: "Pájaro", green: "Verde", eye: "Ojo", table: "Mesa", classroom: "Salón", student: "Estudiante", water: "Agua", book: "Libro", school: "Escuela", friend: "Amigo"
};

// FUNCIÓN DE REINICIO SIN RECARGAR LA PÁGINA
function reiniciarJuego() {
    personaje.y = 150;
    score = 0;
    juegoGanado = false;
    palabrasPendientes = [...palabras];
    tuberias = [];
    tuberias[0] = {
        x: contexto.canvas.width,
        y: -100,
        palabra: obtenerPalabra()
    };
    document.getElementById("listaPalabras").innerHTML = "";
    document.getElementById("contador").innerText = "0";
}

// Inicializar primera tubería
reiniciarJuego();

// AUDIO E IMÁGENES
var punto = new Audio()
punto.src = "audios/punto.mp3"

var bird = new Image()
bird.src = "imagenes/bird.png"

var background = new Image()
background.src = "imagenes/background.png"

var tuberiaNorte = new Image()
tuberiaNorte.src = "imagenes/tuberiaNorte.png"

var tuberiaSur = new Image()
tuberiaSur.src = "imagenes/tuberiaSur.png"

var suelo = new Image()
suelo.src = "imagenes/suelo.png"

// Variable para desbloquear audio en celulares
var audioInicializado = false;

// CONTROL
function presionar(e) {
    if (e && e.cancelable) e.preventDefault();
    
    if (!audioInicializado) {
        punto.play().then(() => {
            punto.pause();
            punto.currentTime = 0;
        }).catch(function(err){});

        if ('speechSynthesis' in window) {
            let inicioSilencioso = new SpeechSynthesisUtterance("");
            speechSynthesis.speak(inicioSilencioso);
        }
        audioInicializado = true;
    }

    personaje.y -= 33;
}

window.addEventListener("keydown", presionar);
document.getElementById("lienzojuego").addEventListener("touchstart", presionar, { passive: false });
document.getElementById("lienzojuego").addEventListener("mousedown", presionar);

// BUCLE PRINCIPAL
setInterval(loop, 1000 / FPS)

function loop() {

    if (juegoGanado) {
        contexto.drawImage(background, 0, 0);
        contexto.drawImage(suelo, 0, contexto.canvas.height - ALTO_SUELO);

        contexto.fillStyle = "#ADFF2F";
        contexto.font = "bold 40px Arial";
        contexto.textAlign = "center";
        contexto.strokeStyle = "black";
        contexto.lineWidth = 4;

        contexto.strokeText("YOU WIN!", contexto.canvas.width / 2, contexto.canvas.height / 2);
        contexto.fillText("YOU WIN!", contexto.canvas.width / 2, contexto.canvas.height / 2);
        return;
    }

    contexto.clearRect(0, 0, 300, 530)
    
    // FONDO Y SUELO
    contexto.drawImage(background, 0, 0)
    
    // GENERADOR DE TUBERÍA
    for (var i = 0; i < tuberias.length; i++) {
        var altoNorte = tuberiaNorte.height || ALTO_TUBERIA_NORTE;
        var anchoTub = tuberiaNorte.width || ANCHO_TUBERIA;
        var constante = altoNorte + ESPACIO_TUBERIA;

        contexto.drawImage(tuberiaNorte, tuberias[i].x, tuberias[i].y)
        contexto.drawImage(tuberiaSur, tuberias[i].x, tuberias[i].y + constante)
        tuberias[i].x--

        // Limitar posición y
        if (tuberias[i].y + altoNorte > 110) {
            tuberias[i].y = 0
        }

        // Nueva tubería
        if (tuberias[i].x == 50 && !juegoGanado) {
            var nuevaPalabra = obtenerPalabra();
            if (nuevaPalabra !== "") {
                tuberias.push({
                    x: contexto.canvas.width,
                    y: Math.floor(Math.random() * 150) - 150,
                    palabra: nuevaPalabra
                });
            }
        }

        // Mostrar palabra
        contexto.fillStyle = "black";
        contexto.font = "20px Arial";
        contexto.fillText(
            tuberias[i].palabra,
            tuberias[i].x + 10,
            tuberias[i].y + altoNorte + 55
        );

        // COLISIÓN CON TUBERÍAS
        if (personaje.x + personaje.w >= tuberias[i].x && 
            personaje.x <= tuberias[i].x + anchoTub && 
            (personaje.y <= tuberias[i].y + altoNorte || personaje.y + personaje.h >= tuberias[i].y + constante)) {
            reiniciarJuego();
            return;
        }

        // PUNTUACIÓN Y AUDIO
        if (tuberias[i].x == personaje.x) {
            score++;
            punto.currentTime = 0;
            punto.play().catch(function(err){});

            hablar(tuberias[i].palabra);
            agregarPalabraAprendida(tuberias[i].palabra);
        }
    }

    // SUELO Y PERSONAJE
    var posicionSueloY = contexto.canvas.height - (suelo.height || ALTO_SUELO);
    contexto.drawImage(suelo, 0, posicionSueloY);
    contexto.drawImage(bird, personaje.x, personaje.y);

    // COLISIÓN CON SUELO Y TECHO
    if (personaje.y + personaje.h >= posicionSueloY || personaje.y <= 0) {
        reiniciarJuego();
        return;
    }

    // FÍSICA Y SCORE
    personaje.y += gravedad;
    contexto.fillStyle = "rgb(255, 255, 255)";
    contexto.font = "25px Arial";
    contexto.fillText("Score: " + score, 10, contexto.canvas.height - 40);
}

// VOZ DE API
function hablar(texto) {
    if ('speechSynthesis' in window && texto) {
        speechSynthesis.cancel();
        let voz = new SpeechSynthesisUtterance(texto);
        voz.lang = "en-US";
        voz.rate = 0.6;
        speechSynthesis.speak(voz);
    }
}

// ACUMULAR PALABRAS
function agregarPalabraAprendida(palabra) {
    if (!palabra) return;
    let lista = document.getElementById("listaPalabras");
    let div = document.createElement("div");

    div.className = "palabra";
    div.innerHTML = "<b>" + palabra + "</b> → " + traducciones[palabra];

    lista.appendChild(div);
    document.getElementById("contador").innerText = lista.children.length;
}
