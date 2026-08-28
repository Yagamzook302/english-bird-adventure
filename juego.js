// ---------------------------------------------------------------------
// CONTROL DE NAVEGACIÓN DE PANTALLAS
// ---------------------------------------------------------------------
function iniciarJuego(tipo) {
    if (tipo === 'bird') {
        document.getElementById('menuPrincipal').classList.add('oculto');
        document.getElementById('vistaBird').classList.remove('oculto');
        
        // ¡AGREGA ESTA LÍNEA PARA CREAR LOS BOTONES AL ENTRAR!
        generarBotonesCategorias(); 

        iniciarJuegoBird();
    } else if (tipo === 'match') {
        document.getElementById('menuPrincipal').classList.add('oculto');
        document.getElementById('vistaMatch').classList.remove('oculto');
        iniciarJuegoMatch();
    }
}

function volverAlMenu() {
    document.getElementById("vistaBird").classList.add("oculto");
    document.getElementById("vistaMatch").classList.add("oculto");
    document.getElementById("menuPrincipal").classList.remove("oculto");
}

// =====================================================================
// 1. LÓGICA DEL JUEGO BIRD (INGLÉS)
// =====================================================================
var contexto = document.getElementById("lienzojuego").getContext("2d");
contexto.canvas.width = 300;
contexto.canvas.height = 530;

var categorias = {

    // NIVEL 1
    school: {
        palabras: ["teacher", "student", "pencil", "book", "classroom", "desk", "board", "ruler"],
        traducciones: {
            teacher: "Profesor",
            student: "Estudiante",
            pencil: "Lápiz",
            book: "Libro",
            classroom: "Salón",
            desk: "Escritorio",
            board: "Tablero",
            ruler: "Regla"
        }
    },

    // NIVEL 2
    house: {
        palabras: ["door", "window", "kitchen", "bed", "table", "chair", "garden", "roof"],
        traducciones: {
            door: "Puerta",
            window: "Ventana",
            kitchen: "Cocina",
            bed: "Cama",
            table: "Mesa",
            chair: "Silla",
            garden: "Jardín",
            roof: "Techo"
        }
    },

    // NIVEL 3
    fiesta: {
        palabras: ["party", "music", "cake", "balloon", "gift", "dance", "game", "snack"],
        traducciones: {
            party: "Fiesta",
            music: "Música",
            cake: "Pastel",
            balloon: "Globo",
            gift: "Regalo",
            dance: "Baile",
            game: "Juego",
            snack: "Bocadillo"
        }
    },

    // NIVEL 4
    animals: {
        palabras: ["dog", "cat", "bird", "fish", "horse", "rabbit", "lion", "monkey"],
        traducciones: {
            dog: "Perro",
            cat: "Gato",
            bird: "Pájaro",
            fish: "Pez",
            horse: "Caballo",
            rabbit: "Conejo",
            lion: "León",
            monkey: "Mono"
        }
    },

    // NIVEL 5
    colors: {
        palabras: ["red", "blue", "green", "yellow", "orange", "purple", "black", "white"],
        traducciones: {
            red: "Rojo",
            blue: "Azul",
            green: "Verde",
            yellow: "Amarillo",
            orange: "Naranja",
            purple: "Morado",
            black: "Negro",
            white: "Blanco"
        }
    },

    // NIVEL 6
    food: {
        palabras: ["apple", "banana", "bread", "milk", "cheese", "rice", "chicken", "water"],
        traducciones: {
            apple: "Manzana",
            banana: "Banano",
            bread: "Pan",
            milk: "Leche",
            cheese: "Queso",
            rice: "Arroz",
            chicken: "Pollo",
            water: "Agua"
        }
    },

    // NIVEL 7
    family: {
        palabras: ["mother", "father", "brother", "sister", "grandmother", "grandfather", "uncle", "aunt"],
        traducciones: {
            mother: "Madre",
            father: "Padre",
            brother: "Hermano",
            sister: "Hermana",
            grandmother: "Abuela",
            grandfather: "Abuelo",
            uncle: "Tío",
            aunt: "Tía"
        }
    },

    // NIVEL 8
    body: {
        palabras: ["head", "eye", "ear", "nose", "mouth", "hand", "foot", "hair"],
        traducciones: {
            head: "Cabeza",
            eye: "Ojo",
            ear: "Oreja",
            nose: "Nariz",
            mouth: "Boca",
            hand: "Mano",
            foot: "Pie",
            hair: "Cabello"
        }
    },

    // NIVEL 9
    nature: {
        palabras: ["sun", "moon", "star", "tree", "flower", "river", "mountain", "cloud"],
        traducciones: {
            sun: "Sol",
            moon: "Luna",
            star: "Estrella",
            tree: "Árbol",
            flower: "Flor",
            river: "Río",
            mountain: "Montaña",
            cloud: "Nube"
        }
    },

    // NIVEL 10
    clothes: {
        palabras: ["shirt", "pants", "shoes", "hat", "dress", "jacket", "socks", "shorts"],
        traducciones: {
            shirt: "Camisa",
            pants: "Pantalón",
            shoes: "Zapatos",
            hat: "Sombrero",
            dress: "Vestido",
            jacket: "Chaqueta",
            socks: "Medias",
            shorts: "Pantaloneta"
        }
    },

    // NIVEL 11
    transport: {
        palabras: ["car", "bus", "train", "plane", "boat", "bike", "truck", "taxi"],
        traducciones: {
            car: "Carro",
            bus: "Bus",
            train: "Tren",
            plane: "Avión",
            boat: "Barco",
            bike: "Bicicleta",
            truck: "Camión",
            taxi: "Taxi"
        }
    },

    // NIVEL 12
    actions: {
        palabras: ["run", "jump", "walk", "eat", "drink", "read", "write", "sleep"],
        traducciones: {
            run: "Correr",
            jump: "Saltar",
            walk: "Caminar",
            eat: "Comer",
            drink: "Beber",
            read: "Leer",
            write: "Escribir",
            sleep: "Dormir"
        }
    }

};

var iconos = {
    school: "🏫", house: "🏠", fiesta: "🎉", animals: "🐶", 
    colors: "🎨", food: "🍎", family: "👨‍👩‍👧", body: "🖐️", 
    nature: "🌟", clothes: "👕", transport: "🚗", actions: "🏃"
};

function generarBotonesCategorias() {
    var contenedor = document.getElementById("contenedorCategorias");
    if (!contenedor) return;

    contenedor.innerHTML = ""; // Limpiar antes de rellenar

    Object.keys(categorias).forEach(function(llave) {
        var boton = document.createElement("button");
        // Soporta la clase de activo
        boton.className = "btn-categoria" + (llave === categoriaActual ? " activa" : "");
        
        var nombreFormateado = llave.charAt(0).toUpperCase() + llave.slice(1);
        var icono = iconos[llave] || "📚";
        
        boton.innerHTML = icono + " " + nombreFormateado;

        boton.onclick = function() {
            // Llama a tu función existente de cambio de categoría
            if (typeof cambiarCategoria === "function") {
                cambiarCategoria(llave, boton);
            }
        };

        contenedor.appendChild(boton);
    });
}

var categoriaActual = "school";
var FPS = 60;
var score = 0;
var gravedad = 1.5;
var personaje = { x: 50, y: 150, w: 50, h: 50 };
var palabrasPendientes = [];
var traduccionesActuales = {};
var juegoGanado = false;
var tuberias = new Array();

function cambiarCategoria(nombreCategoria, elementoBoton) {
    if (!categorias[nombreCategoria]) return;
    categoriaActual = nombreCategoria;
    var botones = document.querySelectorAll('.btn-categoria');
    botones.forEach(btn => btn.classList.remove('activa'));
    if (elementoBoton) elementoBoton.classList.add('activa');
    reiniciarJuegoBird();
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

// RECURSOS BIRD
var punto = new Audio(); punto.src = "audios/punto.mp3";
var bird = new Image(); bird.src = "imagenes/bird.png";
var background = new Image(); background.src = "imagenes/background.png";
var tuberiaNorte = new Image(); tuberiaNorte.src = "imagenes/tuberiaNorte.png";
var tuberiaSur = new Image(); tuberiaSur.src = "imagenes/tuberiaSur.png";
var suelo = new Image(); suelo.src = "imagenes/suelo.png";

var audioInicializado = false;
function activarAudioCelular() {
    if (audioInicializado) return;
    punto.play().then(function() { punto.pause(); punto.currentTime = 0; }).catch(function(e){});
    if ('speechSynthesis' in window) {
        var v = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(v);
    }
    audioInicializado = true;
}

function presionar(e) {
    if (document.getElementById("vistaBird").classList.contains("oculto")) return;
    if (e && e.cancelable) e.preventDefault();
    activarAudioCelular();
    personaje.y -= 33;
}

window.addEventListener("keydown", presionar);
document.getElementById("lienzojuego").addEventListener("touchstart", presionar, { passive: false });
document.getElementById("lienzojuego").addEventListener("mousedown", presionar);

window.onload = function() {
    setInterval(loop, 1000 / FPS);
};

function loop() {
    if (document.getElementById("vistaBird").classList.contains("oculto")) return;

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
            reiniciarJuegoBird();
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
        reiniciarJuegoBird();
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
// 2. LÓGICA DEL JUEGO MATCH (NÚMEROS EN INGLÉS Y AUDIO)
// =====================================================================

// Parejas de números (Cifra vs Nombre en inglés)
var datosCartas = [
    { texto: "1", parId: "1", audio: "one" },     { texto: "One", parId: "1", audio: "one" },
    { texto: "2", parId: "2", audio: "two" },     { texto: "Two", parId: "2", audio: "two" },
    { texto: "3", parId: "3", audio: "three" },   { texto: "Three", parId: "3", audio: "three" },
    { texto: "4", parId: "4", audio: "four" },    { texto: "Four", parId: "4", audio: "four" },
    { texto: "5", parId: "5", audio: "five" },    { texto: "Five", parId: "5", audio: "five" },
    { texto: "8", parId: "8", audio: "eight" },   { texto: "Eight", parId: "8", audio: "eight" }
];

var primeraCarta = null;
var segundaCarta = null;
var bloqueado = false;

function iniciarJuegoMatch() {
    var tablero = document.getElementById("tableroCartas");
    tablero.innerHTML = "";
    primeraCarta = null;
    segundaCarta = null;
    bloqueado = false;

    // Mezclar aleatoriamente las cartas
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

    // Activar sintetizador en el primer clic si estamos en móvil
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
        // Marcamos como acierto
        primeraCarta.classList.add("emparejada");
        segundaCarta.classList.add("emparejada");

        // Reproducir sonido de éxito y pronunciar el número en inglés
        punto.currentTime = 0;
        punto.play().catch(function(e){});
        hablar(primeraCarta.dataset.audio);

        primeraCarta = null;
        segundaCarta = null;
    } else {
        bloqueado = true;
        setTimeout(() => {
            primeraCarta.classList.remove("revelada");
            segundaCarta.classList.remove("revelada");
            primeraCarta.innerHTML = "?";
            segundaCarta.innerHTML = "?";
            primeraCarta = null;
            segundaCarta = null;
            bloqueado = false;
        }, 1000);
    }
}
