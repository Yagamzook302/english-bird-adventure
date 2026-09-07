/* =========================================================
   JUEGO 3: SPACE VOCABULARY SHOOTER (juego3.js)
   ========================================================= */

var game3 = {
    canvas: null,
    ctx: null,
    caratula: true,
    tecla: [],
    balas: [],
    letrasEnemigas: [],
    disparo: false,
    puntos: 0,
    finJuego: false,
    juegoIniciado: false,
    jugador: null,
    xJugador: 0,
    animId: null,

    // Vocabulario espacial
    palabrasEspacio: [
        { en: "TELESCOPE", es: "Telescopio" },
        { en: "SUN", es: "Sol" },
        { en: "EARTH", es: "Tierra" },
        { en: "MARS", es: "Marte" },
        { en: "MOON", es: "Luna" },
        { en: "STAR", es: "Estrella" },
        { en: "ROCKET", es: "Cohete" },
        { en: "GALAXY", es: "Galaxia" },
        { en: "PLANET", es: "Planeta" },
        { en: "COMET", es: "Cometa" }
    ],
    palabraActualObj: null,
    palabraActual: "",
    indiceLetraBuscada: 0,
    letrasAcertadas: [],
    
    // Configuración visual
    anchoCanvas: 800,
    altoCanvas: 500,
    anchoJuego: 560,
    anchoPanel: 240
};

// Teclas
const KEY_LEFT_3 = 37;
const KEY_RIGHT_3 = 39;
const BARRA_3 = 32;

/* --- Función de voz sintetizada --- */
function hablarLetraOTexto(texto) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        var msg = new SpeechSynthesisUtterance(texto);
        msg.lang = 'en-US';
        msg.rate = 0.9;
        window.speechSynthesis.speak(msg);
    }
}

/* --- Clases del juego --- */
function BalaSpace(x, y) {
    this.x = x;
    this.y = y;
    this.w = 5;
    this.h = 10;
    this.activa = true;

    this.dibujar = function () {
        game3.ctx.save();
        game3.ctx.fillStyle = "#00ffff";
        game3.ctx.shadowBlur = 10;
        game3.ctx.shadowColor = "#00ffff";
        game3.ctx.fillRect(this.x, this.y, this.w, this.h);
        this.y -= 7;
        game3.ctx.restore();
    };
}

function JugadorSpace(x) {
    this.x = x;
    this.y = 450;
    this.w = 36;
    this.h = 20;

    this.dibujar = function (xPos) {
        this.x = xPos;
        game3.ctx.save();
        game3.ctx.fillStyle = "#00ffea";
        game3.ctx.shadowBlur = 15;
        game3.ctx.shadowColor = "#00ffea";
        
        game3.ctx.beginPath();
        game3.ctx.moveTo(this.x + this.w / 2, this.y);
        game3.ctx.lineTo(this.x + this.w, this.y + this.h);
        game3.ctx.lineTo(this.x, this.y + this.h);
        game3.ctx.closePath();
        game3.ctx.fill();
        game3.ctx.restore();
    };
}

function LetraEnemiga(letra, x, y) {
    this.letra = letra;
    this.x = x;
    this.y = y;
    this.w = 32;
    this.h = 30;
    this.dx = 1.8;
    this.vive = true;

    this.dibujar = function () {
        this.x += this.dx;
        if (this.x > game3.anchoJuego - 40 || this.x < 10) {
            this.dx *= -1;
            this.y += 10;
        }

        game3.ctx.save();
        game3.ctx.fillStyle = "#112233";
        game3.ctx.strokeStyle = "#00ffea";
        game3.ctx.lineWidth = 2;
        game3.ctx.beginPath();
        if (game3.ctx.roundRect) {
            game3.ctx.roundRect(this.x, this.y, this.w, this.h, 6);
        } else {
            game3.ctx.rect(this.x, this.y, this.w, this.h);
        }
        game3.ctx.fill();
        game3.ctx.stroke();

        game3.ctx.fillStyle = "#ffffff";
        game3.ctx.font = "bold 18px Orbitron, monospace";
        game3.ctx.textAlign = "center";
        game3.ctx.textBaseline = "middle";
        game3.ctx.fillText(this.letra, this.x + this.w / 2, this.y + this.h / 2);
        game3.ctx.restore();
    };

    this.respawn = function() {
        this.x = Math.floor(Math.random() * (game3.anchoJuego - 80)) + 20;
        this.y = Math.floor(Math.random() * 80) + 30;
        this.vive = true;
    };
}

/* --- Lógica principal --- */

function obtenerCanvasSpace() {
    // Busca id "canvasSpace" o alternativamente "lienzoSpace"
    return document.getElementById("canvasSpace") || document.getElementById("lienzoSpace");
}

function prepararVistaSpace() {
    game3.canvas = obtenerCanvasSpace();
    if (!game3.canvas) return;
    
    // Asignar dimensiones reales del canvas espacial
    game3.canvas.width = game3.anchoCanvas;
    game3.canvas.height = game3.altoCanvas;
    game3.ctx = game3.canvas.getContext("2d");

    var btnOverlay = document.getElementById("btnAccionSpace");
    if (btnOverlay) {
        btnOverlay.innerText = "PLAY";
        btnOverlay.style.display = "block";
    }

    game3.juegoIniciado = false;
    game3.finJuego = false;
    game3.puntos = 0;
    
    siguientePalabraSpace();
    pintarSpace();
}

function iniciarJuego3() {
    prepararVistaSpace();
}

// Alias de inicio para enlazar con la navegación principal
function comenzarPartidaSpace() {
    game3.canvas = obtenerCanvasSpace();
    if (game3.canvas) {
        game3.canvas.width = game3.anchoCanvas;
        game3.canvas.height = game3.altoCanvas;
        game3.ctx = game3.canvas.getContext("2d");
    }

    var btnOverlay = document.getElementById("btnAccionSpace");
    if (btnOverlay) btnOverlay.style.display = "none";

    game3.juegoIniciado = true;
    game3.finJuego = false;
    game3.puntos = 0;
    game3.balas = [];
    game3.xJugador = (game3.anchoJuego / 2) - 18;
    game3.jugador = new JugadorSpace(game3.xJugador);

    siguientePalabraSpace();

    if (game3.animId) cancelAnimationFrame(game3.animId);
    animarSpace();
}

function siguientePalabraSpace() {
    var rand = Math.floor(Math.random() * game3.palabrasEspacio.length);
    game3.palabraActualObj = game3.palabrasEspacio[rand];
    game3.palabraActual = game3.palabraActualObj.en;
    game3.indiceLetraBuscada = 0;
    
    game3.letrasAcertadas = new Array(game3.palabraActual.length).fill("_");
    generarOleadaLetras();
}

function generarOleadaLetras() {
    game3.letrasEnemigas = [];
    var abecedario = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var letrasParaMostrar = [];

    for (var i = 0; i < game3.palabraActual.length; i++) {
        letrasParaMostrar.push(game3.palabraActual[i]);
    }

    while (letrasParaMostrar.length < 12) {
        var lRandom = abecedario[Math.floor(Math.random() * abecedario.length)];
        letrasParaMostrar.push(lRandom);
    }

    letrasParaMostrar.sort(function() { return 0.5 - Math.random(); });

    var columnas = 4;
    for (var idx = 0; idx < letrasParaMostrar.length; idx++) {
        var col = idx % columnas;
        var fila = Math.floor(idx / columnas);
        var posX = 40 + col * 120;
        var posY = 35 + fila * 45;
        game3.letrasEnemigas.push(new LetraEnemiga(letrasParaMostrar[idx], posX, posY));
    }
}

function animarSpace() {
    if (game3.juegoIniciado && !game3.finJuego) {
        game3.animId = requestAnimationFrame(animarSpace);
        verificarTeclasSpace();
        pintarSpace();
        colisionesSpace();
    }
}

function verificarTeclasSpace() {
    if (game3.tecla[KEY_RIGHT_3]) game3.xJugador += 6;
    if (game3.tecla[KEY_LEFT_3]) game3.xJugador -= 6;

    if (game3.xJugador > game3.anchoJuego - 40) game3.xJugador = game3.anchoJuego - 40;
    if (game3.xJugador < 10) game3.xJugador = 10;

    if (game3.tecla[BARRA_3] && !game3.disparo) {
        game3.disparo = true;
        game3.balas.push(new BalaSpace(game3.xJugador + 15, 440));

        setTimeout(function () {
            game3.disparo = false;
        }, 220);
    }
}

function colisionesSpace() {
    for (var b = 0; b < game3.balas.length; b++) {
        var bala = game3.balas[b];
        if (!bala || !bala.activa) continue;

        for (var l = 0; l < game3.letrasEnemigas.length; l++) {
            var elem = game3.letrasEnemigas[l];
            if (!elem || !elem.vive) continue;

            if (bala.x > elem.x && bala.x < elem.x + elem.w &&
                bala.y > elem.y && bala.y < elem.y + elem.h) {
                
                bala.activa = false;
                hablarLetraOTexto(elem.letra);

                var letraEsperada = game3.palabraActual[game3.indiceLetraBuscada];

                if (elem.letra === letraEsperada) {
                    elem.vive = false;
                    game3.letrasAcertadas[game3.indiceLetraBuscada] = elem.letra;
                    game3.indiceLetraBuscada++;
                    game3.puntos += 20;

                    if (game3.indiceLetraBuscada >= game3.palabraActual.length) {
                        setTimeout(function() {
                            hablarLetraOTexto(game3.palabraActualObj.en);
                        }, 400);

                        setTimeout(function() {
                            siguientePalabraSpace();
                        }, 1800);
                    }
                } else {
                    game3.puntos = Math.max(0, game3.puntos - 5);
                    elem.respawn();
                }
            }
        }
    }

    for (var i = 0; i < game3.letrasEnemigas.length; i++) {
        if (game3.letrasEnemigas[i] && game3.letrasEnemigas[i].vive) {
            if (game3.letrasEnemigas[i].y >= 420) {
                gameOverSpace();
                break;
            }
        }
    }
}

function pintarSpace() {
    if (!game3.ctx) return;

    game3.ctx.clearRect(0, 0, game3.anchoCanvas, game3.altoCanvas);

    // Fondo
    game3.ctx.fillStyle = "#05050d";
    game3.ctx.fillRect(0, 0, game3.anchoJuego, game3.altoCanvas);

    // Divisoria
    game3.ctx.strokeStyle = "#00ffea";
    game3.ctx.lineWidth = 2;
    game3.ctx.beginPath();
    game3.ctx.moveTo(game3.anchoJuego, 0);
    game3.ctx.lineTo(game3.anchoJuego, game3.altoCanvas);
    game3.ctx.stroke();

    // Dibujar Jugador
    if (game3.jugador) {
        game3.jugador.dibujar(game3.xJugador);
    }

    // Dibujar Balas
    for (var i = 0; i < game3.balas.length; i++) {
        if (game3.balas[i] && game3.balas[i].activa) {
            game3.balas[i].dibujar();
            if (game3.balas[i].y < 0) game3.balas[i].activa = false;
        }
    }

    // Dibujar Letras
    for (var j = 0; j < game3.letrasEnemigas.length; j++) {
        if (game3.letrasEnemigas[j] && game3.letrasEnemigas[j].vive) {
            game3.letrasEnemigas[j].dibujar();
        }
    }

    pintarPanelDerechoSpace();
}

function pintarPanelDerechoSpace() {
    var xPanel = game3.anchoJuego + 15;
    game3.ctx.save();
    
    // SCORE
    game3.ctx.fillStyle = "#00ffea";
    game3.ctx.font = "bold 13px Orbitron, sans-serif";
    game3.ctx.fillText("SCORE", xPanel, 30);
    game3.ctx.fillStyle = "#ffffff";
    game3.ctx.font = "bold 22px Orbitron, sans-serif";
    game3.ctx.fillText(game3.puntos, xPanel, 55);

    // CATEGORY
    game3.ctx.fillStyle = "#ff007f";
    game3.ctx.font = "bold 12px Orbitron, sans-serif";
    game3.ctx.fillText("CATEGORY:", xPanel, 95);
    game3.ctx.fillStyle = "#ffffff";
    game3.ctx.font = "13px Orbitron, sans-serif";
    game3.ctx.fillText("Space & Galaxy", xPanel, 115);

    // TARGET WORD
    game3.ctx.fillStyle = "#00ffea";
    game3.ctx.font = "bold 12px Orbitron, sans-serif";
    game3.ctx.fillText("TARGET WORD:", xPanel, 160);
    game3.ctx.fillStyle = "#ffea00";
    game3.ctx.font = "bold 20px Orbitron, sans-serif";
    game3.ctx.fillText(game3.palabraActualObj ? game3.palabraActualObj.es : "", xPanel, 185);

    // PALABRA EN CONSTRUCCIÓN
    game3.ctx.fillStyle = "#ffffff";
    game3.ctx.font = "bold 22px monospace";
    game3.ctx.fillText(game3.letrasAcertadas.join(" "), xPanel, 230);

    // DESTACADO DE LA LETRA OBJETIVO
    if (game3.indiceLetraBuscada < game3.palabraActual.length) {
        var letraBuscada = game3.palabraActual[game3.indiceLetraBuscada];

        game3.ctx.fillStyle = "#00ffea";
        game3.ctx.font = "bold 12px Orbitron, sans-serif";
        game3.ctx.fillText("SHOOT LETTER:", xPanel, 290);

        game3.ctx.fillStyle = "rgba(0, 255, 234, 0.15)";
        game3.ctx.strokeStyle = "#00ffea";
        game3.ctx.lineWidth = 2;
        game3.ctx.shadowBlur = 12;
        game3.ctx.shadowColor = "#00ffea";
        game3.ctx.beginPath();
        if (game3.ctx.roundRect) {
            game3.ctx.roundRect(xPanel + 20, 310, 60, 60, 10);
        } else {
            game3.ctx.rect(xPanel + 20, 310, 60, 60);
        }
        game3.ctx.fill();
        game3.ctx.stroke();

        game3.ctx.fillStyle = "#ffea00";
        game3.ctx.font = "bold 36px Orbitron, sans-serif";
        game3.ctx.textAlign = "center";
        game3.ctx.textBaseline = "middle";
        game3.ctx.fillText(letraBuscada, xPanel + 50, 340);
    }

    game3.ctx.restore();
}

function gameOverSpace() {
    game3.finJuego = true;
    game3.juegoIniciado = false;

    game3.ctx.save();
    game3.ctx.fillStyle = "rgba(5, 5, 13, 0.88)";
    game3.ctx.fillRect(0, 0, game3.anchoCanvas, game3.altoCanvas);

    game3.ctx.fillStyle = "#ff0055";
    game3.ctx.font = "bold 38px Orbitron, sans-serif";
    game3.ctx.textAlign = "center";
    game3.ctx.shadowBlur = 15;
    game3.ctx.shadowColor = "#ff0055";
    game3.ctx.fillText("GAME OVER", game3.anchoCanvas / 2, 210);

    game3.ctx.fillStyle = "#ffffff";
    game3.ctx.font = "18px Orbitron, sans-serif";
    game3.ctx.shadowBlur = 0;
    game3.ctx.fillText("Score: " + game3.puntos, game3.anchoCanvas / 2, 260);

    game3.ctx.restore();

    var btnOverlay = document.getElementById("btnAccionSpace");
    if (btnOverlay) {
        btnOverlay.innerText = "RETRY";
        btnOverlay.style.display = "block";
    }

    hablarLetraOTexto("Game Over");
}

/* --- Listeners --- */
document.addEventListener("keydown", function (e) {
    game3.tecla[e.keyCode] = true;
});

document.addEventListener("keyup", function (e) {
    game3.tecla[e.keyCode] = false;
});