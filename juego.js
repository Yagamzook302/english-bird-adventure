var contexto = document.getElementById("lienzojuego").getContext("2d")
contexto.canvas.width = 300
contexto.canvas.height = 530

// VARIABLES
var FPS = 60
var score = 0
var gravedad = 1.5
var personaje = {
    x: 50,
    y: 150,
    w: 50,
    h: 50
}

// Generador de palabras
var palabras = ["dog", "house", "sun", "bird", "green", "eye", "table", "classroom", "student", "water", "book", "school", "friend"];
var palabrasPendientes = [...palabras];
var juegoGanado = false;
var tuberias = new Array();

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

// REINICIO DE JUEGO
function reiniciarJuego() {
    personaje.y = 150;
    score = 0;
    juegoGanado = false;
    palabrasPendientes = [...palabras];
    tuberias = [];
    tuberias[0] = {
        x: contexto.canvas.width,
        y: 0,
        palabra: obtenerPalabra()
    };
    let lista = document.getElementById("listaPalabras");
    if (lista) lista.innerHTML = "";
    let contador = document.getElementById("contador");
    if (contador) contador.innerText = "0";
}

reiniciarJuego();

// RECURSOS
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

// DESBLOQUEO DE AUDIO Y SÍNTESIS EN MÓVILES
var audioInicializado = false;

function activarAudioCelular() {
    if (audioInicializado) return;

    // Desbloquear audio MP3
    punto.play().then(function() {
        punto.pause();
        punto.currentTime = 0;
    }).catch(function(e){});

    // Desbloquear motor de voz (Voice API)
    if ('speechSynthesis' in window) {
        var v = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(v);
    }

    audioInicializado = true;
}

// CONTROL
function presionar(e) {
    if (e && e.cancelable) e.preventDefault();
    activarAudioCelular();
    personaje.y -= 33;
}

window.addEventListener("keydown", presionar);
document.getElementById("lienzojuego").addEventListener("touchstart", presionar, { passive: false });
document.getElementById("lienzojuego").addEventListener("mousedown", presionar);

// BUCLE PRINCIPAL
window.onload = function() {
    setInterval(loop, 1000 / FPS);
};

function loop() {

    if (juegoGanado) {
        contexto.drawImage(background, 0, 0);
        contexto.drawImage(suelo, 0, contexto.canvas.height - suelo.height);

        contexto.fillStyle = "#ADFF2F";
        contexto.font = "bold 50px Arial";
        contexto.textAlign = "center";
        contexto.strokeStyle = "black";
        contexto.lineWidth = 4;

        contexto.strokeText("YOU WIN!", contexto.canvas.width / 2, contexto.canvas.height / 2);
        contexto.fillText("YOU WIN!", contexto.canvas.width / 2, contexto.canvas.height / 2);
        return;
    }

    contexto.clearRect(0, 0, 300, 530)
    
    contexto.drawImage(background, 0, 0)
    contexto.drawImage(suelo, 0, contexto.canvas.height - suelo.height)
    contexto.drawImage(bird, personaje.x, personaje.y)

    for (var i = 0; i < tuberias.length; i++) {
        var constante = tuberiaNorte.height + 110;

        contexto.drawImage(tuberiaNorte, tuberias[i].x, tuberias[i].y)
        contexto.drawImage(tuberiaSur, tuberias[i].x, tuberias[i].y + constante)
        tuberias[i].x--

        tuberias[i].y = 0;

        if (tuberias[i].x == 50 && !juegoGanado) {
            var nuevaPalabra = obtenerPalabra();
            if (nuevaPalabra !== "") {
                tuberias.push({
                    x: contexto.canvas.width,
                    y: 0,
                    palabra: nuevaPalabra
                });
            }
        }

        contexto.fillStyle = "black";
        contexto.font = "20px Arial";
        contexto.fillText(
            tuberias[i].palabra,
            tuberias[i].x + 10,
            tuberias[i].y + tuberiaNorte.height + 55
        );

        if (personaje.x + bird.width >= tuberias[i].x && 
            personaje.x <= tuberias[i].x + tuberiaNorte.width && 
            (personaje.y <= tuberias[i].y + tuberiaNorte.height || personaje.y + bird.height >= tuberias[i].y + constante)) {
            reiniciarJuego();
            return;
        }

        if (tuberias[i].x == personaje.x) {
            score++;
            punto.currentTime = 0;
            punto.play().catch(function(e){});

            hablar(tuberias[i].palabra);
            agregarPalabraAprendida(tuberias[i].palabra);
        }
    }

    var altoSuelo = suelo.height > 0 ? suelo.height : 112;
    if (personaje.y + bird.height >= contexto.canvas.height - altoSuelo || personaje.y <= 0) {
        reiniciarJuego();
        return;
    }

    personaje.y += gravedad;
    contexto.fillStyle = "rgb(255, 255, 255)";
    contexto.font = "25px Arial";
    contexto.fillText("Score: " + score, 10, contexto.canvas.height - 40);
}

// SÍNTESIS DE VOZ COMPATIBLE MÓVIL
function hablar(texto) {
    if ('speechSynthesis' in window && texto) {
        var voz = new SpeechSynthesisUtterance(texto);
        voz.lang = "en-US";
        voz.rate = 0.7;
        window.speechSynthesis.speak(voz);
    }
}

function agregarPalabraAprendida(palabra) {
    if (!palabra) return;
    let lista = document.getElementById("listaPalabras");
    if (!lista) return;

    let div = document.createElement("div");
    div.className = "palabra";
    div.innerHTML = "<b>" + palabra + "</b> → " + traducciones[palabra];

    lista.appendChild(div);

    let contador = document.getElementById("contador");
    if (contador) contador.innerText = lista.children.length;
}
