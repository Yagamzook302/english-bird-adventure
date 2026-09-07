// =====================================================================
// 3. LÓGICA DEL JUEGO HANGMAN (JUEGO2.JS)
// =====================================================================

var palabrasHangman = [
    ["apple", "Una fruta roja o verde"],
    ["teacher", "Persona que enseña en la escuela"],
    ["window", "Elemento de la casa para ver hacia afuera"],
    ["yellow", "El color del sol"],
    ["garden", "Lugar con flores y plantas"],
    ["rabbit", "Un animal de orejas largas"],
    ["chicken", "Un animal de granja o comida"],
    ["mother", "Miembro de la familia"],
    ["mountain", "Gran elevación de tierra"],
    ["plane", "Medio de transporte aéreo"]
];

var palabraHangman = "";
var randHangman;
var ocultaHangman = [];
var contHangman = 6;

function generaPalabraHangman() {
    randHangman = Math.floor(Math.random() * palabrasHangman.length);
    palabraHangman = palabrasHangman[randHangman][0].toUpperCase();
}

function pintarGuionesHangman(num) {
    ocultaHangman = [];
    for (var i = 0; i < num; i++) {
        ocultaHangman[i] = "_";
    }
    document.getElementById("palabra").innerHTML = ocultaHangman.join(" ");
}

function generaABCHangman(a, z) {
    var contenedor = document.getElementById("abcdario");
    contenedor.innerHTML = "";
    var i = a.charCodeAt(0), j = z.charCodeAt(0);
    for (; i <= j; i++) {
        var letra = String.fromCharCode(i).toUpperCase();
        contenedor.innerHTML += "<button value='" + letra + "' onclick='intentoHangman(\"" + letra + "\")' class='letra-btn' id='btn-" + letra + "'>" + letra + "</button>";
    }
}

function intentoHangman(letra) {
    var btn = document.getElementById("btn-" + letra);
    if (btn) btn.disabled = true;

    if (palabraHangman.indexOf(letra) !== -1) {
        for (var i = 0; i < palabraHangman.length; i++) {
            if (palabraHangman[i] === letra) ocultaHangman[i] = letra;
        }
        document.getElementById("palabra").innerHTML = ocultaHangman.join(" ");
        mostrarMensajeTemporal("Bien!", "verde");
        if (typeof hablar === 'function') hablar(letra.toLowerCase());
    } else {
        contHangman--;
        document.getElementById("intentos").innerHTML = contHangman;
        
        // Cambia la imagen según los intentos restantes
        var img = document.getElementById("ahorcadoImg");
        if (img) img.src = "imagenes/ahorcado_" + contHangman + ".png";

        mostrarMensajeTemporal("Fallo!", "rojo");
    }
    compruebaFinHangman();
}

function mostrarMensajeTemporal(txt, tipo) {
    var elem = document.getElementById("acierto");
    elem.innerHTML = txt;
    elem.className = "acierto " + tipo;
    setTimeout(function () { elem.className = ""; elem.innerHTML = ""; }, 800);
}

function pista() {
    document.getElementById("hueco-pista").innerHTML = "Pista: " + palabrasHangman[randHangman][1];
}

function compruebaFinHangman() {
    var msg = document.getElementById("msg-final");
    var buttons = document.getElementsByClassName('letra-btn');

    if (ocultaHangman.indexOf("_") === -1) {
        msg.innerHTML = "🎉 ¡Felicidades!";
        msg.className = "zoom-in verde";
        bloquearTecladoHangman(buttons);
        hablar(palabraHangman);
    } else if (contHangman <= 0) {
        msg.innerHTML = "❌ Game Over (" + palabraHangman + ")";
        msg.className = "zoom-in rojo";
        bloquearTecladoHangman(buttons);
    }
}

function bloquearTecladoHangman(buttons) {
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    }
}

function inicioHangman() {
    contHangman = 6;
    document.getElementById("intentos").innerHTML = contHangman;
    document.getElementById("msg-final").innerHTML = "";
    document.getElementById("msg-final").className = "";
    document.getElementById("hueco-pista").innerHTML = "";
    
    // Reiniciar la imagen a la inicial (6 intentos)
    var img = document.getElementById("ahorcadoImg");
    if (img) img.src = "imagenes/ahorcado_6.png";

    generaPalabraHangman();
    pintarGuionesHangman(palabraHangman.length);
    generaABCHangman("a", "z");
}