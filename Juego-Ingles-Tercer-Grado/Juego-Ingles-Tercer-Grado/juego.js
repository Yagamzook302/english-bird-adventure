var contexto = document.getElementById("lienzojuego").getContext("2d")
contexto.canvas.width = 300
contexto.canvas.height = 530
//VARIABLES
var FPS = 60
var score = 0
var gravedad = 1.5
var personaje = {
    x:50,
    y:150,
    w:50,
    h:50
}

// Generador de palabras
var palabras = ["dog", "house", "sun", "bird", "green", "eye", "table", "classroom", "student", "water", "book", "school", "friend"];
var palabrasPendientes = [...palabras];
var juegoGanado = false;
var tuberias = new Array()
tuberias[0] = {
    x: contexto.canvas.width,
    y: 0,
    palabra: obtenerPalabra()
}
//Traducciones
var traducciones = {
    dog:"Perro",house:"Casa",sun:"Sol",bird:"Pájaro",green:"Verde",eye:"Ojo",table:"Mesa",classroom:"Salón",student:"Estudiante",water:"Agua",book:"Libro",school:"Escuela",friend:"Amigo"
};
function obtenerPalabra() {
    if (palabrasPendientes.length === 0) {
        juegoGanado = true;
        return "";
    }

    return palabrasPendientes.shift(); // toma la siguiente palabra y la elimina
}
// VARIABLES DE AUDIO
var punto = new Audio()
punto.src = "audios/punto.mp3"
//VARIABLE IMAGENES
var bird = new Image()
bird.src = "imagenes/bird.png"

var background = new Image()
background .src = "imagenes/background.png"

var tuberiaNorte = new Image()
tuberiaNorte.src = "imagenes/tuberiaNorte.png"

var tuberiaSur = new Image()
tuberiaSur.src = "imagenes/tuberiaSur.png"

var suelo = new Image()
suelo.src = "imagenes/suelo.png"
//CONTROL
function presionar(){
    personaje.y -=33
}



//BUCLE
setInterval(loop,1000/FPS)
function loop() {

    if(juegoGanado){
        contexto.drawImage(background,0,0);
        contexto.drawImage(suelo,0,contexto.canvas.height - suelo.height);
    
        contexto.fillStyle = "#ADFF2F";
        contexto.font = "bold 50px Arial";
        contexto.textAlign = "center";
        contexto.strokeStyle = "black";
        contexto.lineWidth = 4;
    
        contexto.strokeText(
            "YOU WIN!",
            contexto.canvas.width / 2,
            contexto.canvas.height / 2
        );
    
        contexto.fillText(
            "YOU WIN!",
            contexto.canvas.width / 2,
            contexto.canvas.height / 2
        );
    
        return;
    }
    contexto.clearRect(0,0,300,530)
        //FONDO
    contexto.drawImage(background,0,0)
    contexto.drawImage(suelo,0,contexto.canvas.height - suelo.height)
    //PERSONALE
    contexto.drawImage(bird,personaje.x,personaje.y)
    //GENERADOR DE TUBERÍA
    for(var i=0; i <tuberias.length; i++){
        var constante = tuberiaNorte.height + 110
        contexto.drawImage(tuberiaNorte,tuberias[i].x,tuberias[i].y)
        contexto.drawImage(tuberiaSur,tuberias[i].x,tuberias[i].y+constante)
        tuberias[i].x--

        //limitar error de generar tubería
        if(tuberias[i].y + tuberiaNorte.height > 110){
            tuberias[i].y = 0
        }

        //nueva tubería cada 50 px
        if (tuberias[i].x == 50 && !juegoGanado){

            var nuevaPalabra = obtenerPalabra();
        
            if(nuevaPalabra !== ""){
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
            tuberias[i].y + tuberiaNorte.height + 55
        );
        //COLISIONES
        if (personaje.x + bird.width >= tuberias[i].x && personaje.x <= tuberias[i].x + tuberiaNorte.width && (personaje.y <= tuberias[i].y + tuberiaNorte.height || personaje.y + bird.height >= tuberias[i].y + constante) || personaje.y + bird.height >= contexto.canvas.height - suelo.height){
            location.reload()
        }
        if(tuberias[i].x == personaje.x){
            score++;
            punto.play();
        
            hablar(tuberias[i].palabra);
            agregarPalabraAprendida(
                tuberias[i].palabra
            );
        }
    
    }
    //CONDICIONES
    personaje.y +=gravedad
    contexto.fillStyle = "rgb(255, 255, 255)"
    contexto.font = "25px Arial"
    contexto.fillText("Score: "+ score,10,contexto.canvas.height-40)

    if(juegoGanado){

        contexto.fillStyle = "#ADFF2F"; // amarillo verdoso
    
        contexto.font = "bold 50px Arial";
    
        contexto.textAlign = "center";
    
        contexto.strokeStyle = "black";
        contexto.lineWidth = 4;
    
        contexto.strokeText(
            "YOU WIN!",
            contexto.canvas.width / 2,
            contexto.canvas.height / 2
        );
    
        contexto.fillText(
            "YOU WIN!",
            contexto.canvas.width / 2,
            contexto.canvas.height / 2
        );
    }
}



//Función de voz de API
function hablar(texto){
    let voz = new SpeechSynthesisUtterance(texto);

    voz.lang = "en-EN"; // Inglés
    voz.rate = 0.6;     // velocidad de lectura
    voz.pitch = 1;      // Nivel de voz

    speechSynthesis.speak(voz);
}

//Función de acumular palabras en Index
function agregarPalabraAprendida(palabra){

    let lista = document.getElementById("listaPalabras");

    let div = document.createElement("div");

    div.className = "palabra";

    div.innerHTML =
        "<b>" + palabra + "</b> → " +
        traducciones[palabra];

    lista.appendChild(div);
    document.getElementById("contador").innerText =
        lista.children.length;
}


window.addEventListener("keydown",presionar)