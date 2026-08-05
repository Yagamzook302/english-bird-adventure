var contexto = document.getElementById("lienzojuego").getContext("2d")
contexto.canvas.width = 300
contexto.canvas.height = 530

// ---------------------------------------------------------------------
// BASE DE DATOS DE VOCABULARIO POR CATEGORÍAS
// ---------------------------------------------------------------------
var categorias = {
    school: {
        palabras: ["teacher", "student", "pencil", "book", "classroom", "desk", "board", "ruler"],
        traducciones: {
            teacher: "Profesor", student: "Estudiante", pencil: "Lápiz", book: "Libro",
            classroom: "Salón", desk: "Escritorio", board: "Tablero", ruler: "Regla"
        }
    },
    house: {
        palabras: ["door", "window", "kitchen", "bed", "table", "chair", "garden", "roof"],
        traducciones: {
            door: "Puerta", window: "Ventana", kitchen: "Cocina", bed: "Cama",
            table: "Mesa", chair: "Silla", garden: "Jardín", roof: "Techo"
        }
    },
    fiesta: {
        palabras: ["party", "music", "cake", "balloon", "gift", "dance", "game", "snack"],
        traducciones: {
            party: "Fiesta", music: "Música", cake: "Pastel", balloon: "Globo",
            gift: "Regalo", dance: "Baile", game: "Juego", snack: "Bocadillo"
        }
    }
};

// Categoría seleccionada por defecto
var categoriaActual = "school";

// ---------------------------------------------------------------------
// VARIABLES Y ESTADO DEL JUEGO
// ---------------------------------------------------------------------
var FPS = 60;
var score = 0;
var gravedad = 1.5;
var personaje = { x: 50, y: 150, w: 50, h: 50 };

var palabrasPendientes = [];
var traduccionesActuales = {};
var juegoGanado = false;
var tuberias = new Array();

// CAMBIAR DE CATEGORÍA DESDE LOS BOTONES
function cambiarCategoria(nombreCategoria, elementoBoton) {
    if (!categorias[nombreCategoria]) return;
    
    categoriaActual = nombreCategoria;

    // Actualizar estilo visual de los botones
    var botones = document.querySelectorAll('.btn-categoria');
    botones.forEach(btn => btn.classList.remove('activa'));
    if (elementoBoton) elementoBoton.classList.add('activa');

    // Reiniciar el juego con el nuevo vocabulario
    reiniciarJuego();
}

function obtenerPalabra() {
    if (palabrasPendientes.length === 0) {
        juegoGanado = true;
        return "";
    }
    return palabrasPendientes.shift();
}

// REINICIO DE JUEGO
function reiniciarJuego() {
    personaje.y = 150;
    score = 0;
    juegoGanado = false;
    
    // Carga las palabras de la categoría activa
    palabrasPendientes = [...categorias[categoriaActual].palabras];
    traduccionesActuales = categorias[categoriaActual].traducciones;

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

// Cargar estado inicial
reiniciarJuego();

// RECURSOS
var punto = new Audio();
punto.src = "audios/punto.mp3";

var bird = new Image();
bird.src = "imagenes/bird.png";

var background = new Image();
background.src = "imagenes/background.png";

var tuberiaNorte = new Image();
tuberiaNorte.src = "imagenes/tuberiaNorte.png";

var tuberiaSur = new Image();
tuberiaSur.src = "imagenes/tuberiaSur.png";

var suelo = new Image();
suelo.src = "imagenes/suelo.png";

// CONTROLES Y AUDIOS
var audioInicializado = false;

function activarAudioCelular() {
    if (audioInicializado) return;
    punto.play().then(function() {
        punto.pause();
        punto.currentTime = 0;
    }).catch(function(e){});

    if ('speechSynthesis' in window) {
        var v = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(v);
    }
    audioInicializado = true;
}

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

    contexto.clearRect(0, 0, 300, 530);
    contexto.drawImage(background, 0, 0);
    contexto.drawImage(suelo, 0, contexto.canvas.height - suelo.height);
    contexto.drawImage(bird, personaje.x, personaje.y);

    for (var i = 0; i < tuberias.length; i++) {
        var constante = tuberiaNorte.height + 110;

        contexto.drawImage(tuberiaNorte, tuberias[i].x, tuberias[i].y);
        contexto.drawImage(tuberiaSur, tuberias[i].x, tuberias[i].y + constante);
        tuberias[i].x--;
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

// VOZ Y PANEL
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
    let traduccion = traduccionesActuales[palabra] || "";
    div.innerHTML = "<b>" + palabra + "</b> → " + traduccion;

    lista.appendChild(div);

    let contador = document.getElementById("contador");
    if (contador) contador.innerText = lista.children.length;
}
