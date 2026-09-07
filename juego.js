// =====================================================================
// 1. CONFIGURACIÓN Y VARIABLES DEL JUEGO BIRD
// =====================================================================
var contexto = document.getElementById("lienzojuego").getContext("2d");
contexto.canvas.width = 300;
contexto.canvas.height = 530;

var categorias = {
    // NIVEL 1
    school: {
        palabras: ["teacher", "student", "pencil", "book", "classroom", "desk", "board", "ruler"],
        traducciones: {
            teacher: "Profesor", student: "Estudiante", pencil: "Lápiz", book: "Libro",
            classroom: "Salón", desk: "Escritorio", board: "Tablero", ruler: "Regla"
        }
    },
    // NIVEL 2
    house: {
        palabras: ["door", "window", "kitchen", "bed", "table", "chair", "garden", "roof"],
        traducciones: {
            door: "Puerta", window: "Ventana", kitchen: "Cocina", bed: "Cama",
            table: "Mesa", chair: "Silla", garden: "Jardín", roof: "Techo"
        }
    },
    // NIVEL 3
    fiesta: {
        palabras: ["party", "music", "cake", "balloon", "gift", "dance", "game", "snack"],
        traducciones: {
            party: "Fiesta", music: "Música", cake: "Pastel", balloon: "Globo",
            gift: "Regalo", dance: "Baile", game: "Juego", snack: "Bocadillo"
        }
    },
    // NIVEL 4
    animals: {
        palabras: ["dog", "cat", "bird", "fish", "horse", "rabbit", "lion", "monkey"],
        traducciones: {
            dog: "Perro", cat: "Gato", bird: "Pájaro", fish: "Pez",
            horse: "Caballo", rabbit: "Conejo", lion: "León", monkey: "Mono"
        }
    },
    // NIVEL 5
    colors: {
        palabras: ["red", "blue", "green", "yellow", "orange", "purple", "black", "white"],
        traducciones: {
            red: "Rojo", blue: "Azul", green: "Verde", yellow: "Amarillo",
            orange: "Naranja", purple: "Morado", black: "Negro", white: "Blanco"
        }
    },
    // NIVEL 6
    food: {
        palabras: ["apple", "banana", "bread", "milk", "cheese", "rice", "chicken", "water"],
        traducciones: {
            apple: "Manzana", banana: "Banano", bread: "Pan", milk: "Leche",
            cheese: "Queso", rice: "Arroz", chicken: "Pollo", water: "Agua"
        }
    },
    // NIVEL 7
    family: {
        palabras: ["mother", "father", "brother", "sister", "grandmother", "grandfather", "uncle", "aunt"],
        traducciones: {
            mother: "Madre", father: "Padre", brother: "Hermano", sister: "Hermana",
            grandmother: "Abuela", grandfather: "Abuelo", uncle: "Tío", aunt: "Tía"
        }
    },
    // NIVEL 8
    nature: {
        palabras: ["sun", "moon", "star", "tree", "flower", "river", "mountain", "cloud"],
        traducciones: {
            sun: "Sol", moon: "Luna", star: "Estrella", tree: "Árbol",
            flower: "Flor", river: "Río", mountain: "Montaña", cloud: "Nube"
        }
    },
    // NIVEL 9
    transport: {
        palabras: ["car", "bus", "train", "plane", "boat", "bike", "truck", "taxi"],
        traducciones: {
            car: "Carro", bus: "Bus", train: "Tren", plane: "Avión",
            boat: "Barco", bike: "Bicicleta", truck: "Camión", taxi: "Taxi"
        }
    }
};

var iconos = {
    school: "🏫", house: "🏠", fiesta: "🎉", animals: "🐶", 
    colors: "🎨", food: "🍎", family: "👨‍👩‍👧", 
    nature: "🌟", transport: "🚗"
};

var categoriaActual = "school";
var FPS = 60;
var score = 0;
var gravedad = 1.5;
var personaje = { x: 50, y: 150, w: 50, h: 50 };
var palabrasPendientes = [];
var traduccionesActuales = {};
var juegoGanado = false;
var tuberias = new Array();
var juegoIniciado = false;

// RECURSOS BIRD
var bird = new Image(); bird.src = "imagenes/bird.png";
var background = new Image(); background.src = "imagenes/background.png";
var tuberiaNorte = new Image(); tuberiaNorte.src = "imagenes/tuberiaNorte.png";
var tuberiaSur = new Image(); tuberiaSur.src = "imagenes/tuberiaSur.png";
var suelo = new Image(); suelo.src = "imagenes/suelo.png";

// --- CONTROL DE ESTADO Y BOTONES BIRD ---
function prepararEstadoInicialBird() {
    juegoIniciado = false;
    reiniciarJuegoBird();
    mostrarBotonAccion("PLAY", false);
}

function iniciarOReiniciarBird() {
    reiniciarJuegoBird();
    juegoIniciado = true;
    ocultarBotonAccion();
}

function mostrarBotonAccion(texto, esRestart) {
    var btn = document.getElementById("btnAccionBird");
    if (!btn) return;
    btn.innerText = texto;
    if (esRestart) {
        btn.classList.add("restart");
    } else {
        btn.classList.remove("restart");
    }
    btn.classList.remove("oculto");
}

function ocultarBotonAccion() {
    var btn = document.getElementById("btnAccionBird");
    if (btn) btn.classList.add("oculto");
}

function generarBotonesCategorias() {
    var contenedor = document.getElementById("contenedorCategorias");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    Object.keys(categorias).forEach(function(llave) {
        var boton = document.createElement("button");
        boton.className = "btn-categoria" + (llave === categoriaActual ? " activa" : "");
        
        var nombreFormateado = llave.charAt(0).toUpperCase() + llave.slice(1);
        var icono = iconos[llave] || "📚";
        
        boton.innerHTML = icono + " " + nombreFormateado;

        boton.onclick = function() {
            cambiarCategoria(llave, boton);
        };

        contenedor.appendChild(boton);
    });
}

function cambiarCategoria(nombreCategoria, elementoBoton) {
    if (!categorias[nombreCategoria]) return;
    categoriaActual = nombreCategoria;
    var botones = document.querySelectorAll('.btn-categoria');
    botones.forEach(btn => btn.classList.remove('activa'));
    if (elementoBoton) elementoBoton.classList.add('activa');
    
    prepararEstadoInicialBird();
}

function obtenerPalabra() {
    if (palabrasPendientes.length === 0) {
        juegoGanado = true;
        return "";
    }
    return palabrasPendientes.shift();
}

function reiniciarJuegoBird() {
    personaje.y = 150;
    score = 0;
    juegoGanado = false;
    palabrasPendientes = [...categorias[categoriaActual].palabras];
    traduccionesActuales = categorias[categoriaActual].traducciones;

    tuberias = [];
    tuberias[0] = {
        x: contexto.canvas.width,
        y: Math.floor(Math.random() * 140) - 180,
        palabra: obtenerPalabra()
    };
    
    let lista = document.getElementById("listaPalabras");
    if (lista) lista.innerHTML = "";
    let contador = document.getElementById("contador");
    if (contador) contador.innerText = "0";
}

var audioInicializado = false;
function activarAudioCelular() {
    if (audioInicializado) return;
    if ('speechSynthesis' in window) {
        var v = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(v);
    }
    audioInicializado = true;
}

function presionar(e) {
    var vistaBird = document.getElementById("vistaBird");
    if (!vistaBird || vistaBird.classList.contains("oculto")) return;
    if (!juegoIniciado) return;
    if (e && e.cancelable) e.preventDefault();
    activarAudioCelular();
    personaje.y -= 33;
}

window.addEventListener("keydown", presionar);
var lienzo = document.getElementById("lienzojuego");
if (lienzo) {
    lienzo.addEventListener("touchstart", presionar, { passive: false });
    lienzo.addEventListener("mousedown", presionar);
}

function loop() {
    var vistaBird = document.getElementById("vistaBird");
    if (!vistaBird || vistaBird.classList.contains("oculto")) return;

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
        
        juegoIniciado = false;
        mostrarBotonAccion("RESTART", true);
        return;
    }

    contexto.clearRect(0, 0, 300, 530);
    contexto.drawImage(background, 0, 0);
    contexto.drawImage(suelo, 0, contexto.canvas.height - suelo.height);
    contexto.drawImage(bird, personaje.x, personaje.y);

    if (!juegoIniciado) return;

    for (var i = 0; i < tuberias.length; i++) {
        var altoNorte = tuberiaNorte.height || 242;
        var constante = altoNorte + 110;

        contexto.drawImage(tuberiaNorte, tuberias[i].x, tuberias[i].y);
        contexto.drawImage(tuberiaSur, tuberias[i].x, tuberias[i].y + constante);
        tuberias[i].x--;

        if (tuberias[i].x == 50 && !juegoGanado) {
            var nuevaPalabra = obtenerPalabra();
            if (nuevaPalabra !== "") {
                tuberias.push({
                    x: contexto.canvas.width,
                    y: Math.floor(Math.random() * 140) - 180,
                    palabra: nuevaPalabra
                });
            }
        }

        contexto.fillStyle = "black";
        contexto.font = "20px Arial";
        contexto.fillText(tuberias[i].palabra, tuberias[i].x + 10, tuberias[i].y + altoNorte + 55);

        if (personaje.x + bird.width >= tuberias[i].x && 
            personaje.x <= tuberias[i].x + tuberiaNorte.width && 
            (personaje.y <= tuberias[i].y + altoNorte || personaje.y + bird.height >= tuberias[i].y + constante)) {
            juegoIniciado = false;
            mostrarBotonAccion("RESTART", true);
            return;
        }

        if (tuberias[i].x == personaje.x) {
            score++;
            hablar(tuberias[i].palabra);
            agregarPalabraAprendida(tuberias[i].palabra);
        }
    }

    var altoSuelo = suelo.height > 0 ? suelo.height : 112;
    if (personaje.y + bird.height >= contexto.canvas.height - altoSuelo || personaje.y <= 0) {
        juegoIniciado = false;
        mostrarBotonAccion("RESTART", true);
        return;
    }

    personaje.y += gravedad;
    contexto.fillStyle = "rgb(255, 255, 255)";
    contexto.font = "25px Arial";
    contexto.fillText("Score: " + score, 10, contexto.canvas.height - 40);
}

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

// =====================================================================
// 2. LÓGICA DEL JUEGO MATCH
// =====================================================================
var nivelesMatch = {
    numeros: [
        { texto: "1", parId: "1", audio: "one" },     { texto: "One(1)", parId: "1", audio: "one" },
        { texto: "2", parId: "2", audio: "two" },     { texto: "Two(2)", parId: "2", audio: "two" },
        { texto: "3", parId: "3", audio: "three" },   { texto: "Three(3)", parId: "3", audio: "three" },
        { texto: "4", parId: "4", audio: "four" },    { texto: "Four(4)", parId: "4", audio: "four" },
        { texto: "5", parId: "5", audio: "five" },    { texto: "Five(5)", parId: "5", audio: "five" },
        { texto: "8", parId: "8", audio: "eight" },   { texto: "Eight(8)", parId: "8", audio: "eight" },
        { texto: "9", parId: "9", audio: "nine" },    { texto: "Nine(9)", parId: "nine" },
        { texto: "10", parId: "10", audio: "ten" },   { texto: "Ten(10)", parId: "10", audio: "ten" }
    ],
    multiplicaciones: [
        { texto: "2 × 2", parId: "m1", audio: "four" },      { texto: "Four(4)", parId: "m1", audio: "four" },
        { texto: "3 × 2", parId: "m2", audio: "six" },       { texto: "Six(6)", parId: "m2", audio: "six" },
        { texto: "4 × 2", parId: "m3", audio: "eight" },     { texto: "Eight(8)", parId: "m3", audio: "eight" },
        { texto: "3 × 3", parId: "m4", audio: "nine" },      { texto: "Nine(9)", parId: "m4", audio: "nine" },
        { texto: "5 × 2", parId: "m5", audio: "ten" },       { texto: "Ten(10)", parId: "m5", audio: "ten" },
        { texto: "4 × 3", parId: "m6", audio: "twelve" },    { texto: "Twelve(12)", parId: "m6", audio: "twelve" },
        { texto: "5 × 3", parId: "m7", audio: "fifteen" },   { texto: "Fifteen(15)", parId: "m7", audio: "fifteen" },
        { texto: "4 × 5", parId: "m8", audio: "twenty" },    { texto: "Twenty(20)", parId: "m8", audio: "twenty" }
    ]
};

var nivelMatchActual = "numeros";
var primeraCarta = null;
var segundaCarta = null;
var bloqueado = false;

function cambiarNivelMatch(nivel, boton) {
    nivelMatchActual = nivel;
    var botones = document.querySelectorAll('#vistaMatch .btn-categoria');
    botones.forEach(btn => btn.classList.remove('activa'));
    if (boton) boton.classList.add('activa');
    iniciarJuegoMatch();
}

function iniciarJuegoMatch() {
    var tablero = document.getElementById("tableroCartas");
    if (!tablero) return;

    tablero.innerHTML = "";
    primeraCarta = null;
    segundaCarta = null;
    bloqueado = false;

    var datosCartas = nivelesMatch[nivelMatchActual] || nivelesMatch.numeros;
    var cartasMezcladas = [...datosCartas].sort(() => Math.random() - 0.5);

    cartasMezcladas.forEach(item => {
        var cardEl = document.createElement("div");
        cardEl.className = "carta";
        cardEl.dataset.parId = item.parId;
        cardEl.dataset.texto = item.texto;
        cardEl.dataset.audio = item.audio;
        cardEl.innerHTML = "?";
        
        cardEl.onclick = function() { seleccionarCarta(cardEl); };
        tablero.appendChild(cardEl);
    });
}

function seleccionarCarta(carta) {
    if (bloqueado || carta === primeraCarta || carta.classList.contains("revelada") || carta.classList.contains("emparejada")) return;

    activarAudioCelular();

    carta.classList.add("revelada");
    carta.innerHTML = carta.dataset.texto;

    if (!primeraCarta) {
        primeraCarta = carta;
    } else {
        segundaCarta = carta;
        comprobarPareja();
    }
}

function comprobarPareja() {
    if (primeraCarta.dataset.parId === segundaCarta.dataset.parId) {
        primeraCarta.classList.add("emparejada");
        segundaCarta.classList.add("emparejada");

        hablar(primeraCarta.dataset.audio);

        primeraCarta = null;
        segundaCarta = null;
    } else {
        bloqueado = true;
        setTimeout(() => {
            if (primeraCarta) {
                primeraCarta.classList.remove("revelada");
                primeraCarta.innerHTML = "?";
            }
            if (segundaCarta) {
                segundaCarta.classList.remove("revelada");
                segundaCarta.innerHTML = "?";
            }
            primeraCarta = null;
            segundaCarta = null;
            bloqueado = false;
        }, 1000);
    }
}

// =====================================================================
// 3. NAVEGACIÓN GLOBAL Y CARGA INICIAL
// =====================================================================
window.addEventListener('DOMContentLoaded', function() {
    try {
        generarBotonesCategorias();
        prepararEstadoInicialBird();
    } catch(e) {}
    
    setInterval(loop, 1000 / FPS);
});

function iniciarJuego(tipo) {
    var menu = document.getElementById("menuPrincipal");
    if (menu) menu.classList.add("oculto");

    var vistas = document.querySelectorAll(".vista-juego");
    vistas.forEach(function(vista) {
        vista.classList.add("oculto");
    });

    juegoIniciado = false;

    if (tipo === 'bird') {
        var vistaBird = document.getElementById("vistaBird");
        if (vistaBird) vistaBird.classList.remove("oculto");
        generarBotonesCategorias();
        prepararEstadoInicialBird();
    } 
    else if (tipo === 'match') {
        var vistaMatch = document.getElementById("vistaMatch");
        if (vistaMatch) vistaMatch.classList.remove("oculto");
        var btnInicial = vistaMatch ? vistaMatch.querySelector('.btn-categoria') : null;
        cambiarNivelMatch('numeros', btnInicial);
    } 
    else if (tipo === 'hangman') {
        var vistaHangman = document.getElementById("vistaHangman");
        if (vistaHangman) vistaHangman.classList.remove("oculto");
        if (typeof inicioHangman === "function") inicioHangman();
    } 
    else if (tipo === 'space') {
        var vistaSpace = document.getElementById("vistaSpace");
        if (vistaSpace) vistaSpace.classList.remove("oculto");
        if (typeof comenzarPartidaSpace === "function") comenzarPartidaSpace();
    }
}

function volverAlMenu() {
    var vistas = document.querySelectorAll(".vista-juego");
    vistas.forEach(function(vista) {
        vista.classList.add("oculto");
    });

    juegoIniciado = false;

    var menu = document.getElementById("menuPrincipal");
    if (menu) menu.classList.remove("oculto");
}
