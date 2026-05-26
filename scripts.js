const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
const boton = document.getElementById('btnMensaje'); 
const titulo = document.getElementById('tituloElegante');
const audio = document.getElementById('musicaFondo'); 

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let t = 0; 
const speed = 0.019; 

// --- CORRECCIÓN: Escala adaptable según el tamaño de la pantalla ---
// Si es celular usa escala 9 o 10, si es PC usa tus 15 originales automáticamente
const esCelular = window.innerWidth < 768;
const scale = esCelular ? Math.min(window.innerWidth / 40, 10) : 15; 

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

ctx.strokeStyle = "#b91d1d"; 
ctx.lineWidth = esCelular ? 8 : 12; // Línea un poco más delgada en celular para que luzca fino
ctx.lineCap = "round";

const estrellas = [];
const colorAmarilloFosforito = "#e3ff00"; 

const corazonesFlotantes = [];
const coloresCorazones = ["#ff4d6d", "#ff758f", "#ff8fa3", "#ffb3c1"];

let entradaCorazonesOpacity = 0;

function inicializarCorazonesFlotantes() {
    // Ajustamos la separación vertical para móviles
    const factorEspacioY = esCelular ? 70 : 120;
    const desfasesY = [centerY + factorEspacioY, centerY, centerY - factorEspacioY]; 
    
    // Tamaños proporcionales a la pantalla para que no se vean gigantes en móviles
    const tamanosColumnas = esCelular ? 
        [
            [26, 20, 16], // Interna
            [14, 10, 8],  // Medio
            [22, 16, 12]  // Externa
        ] : 
        [
            [45, 35, 25], 
            [22, 16, 12], 
            [35, 25, 18]  
        ];
    
    // CORRECCIÓN: Separación horizontal adaptada al ancho del corazón en móvil
    const separacionCol = esCelular ? 40 : 90;
    const margenInicial = esCelular ? 20 : 40;

    const columnasIzquierda = [
        centerX - (24 * scale) - margenInicial,  
        centerX - (24 * scale) - margenInicial - separacionCol, 
        centerX - (24 * scale) - margenInicial - (separacionCol * 2)  
    ];
    
    const columnasDerecha = [
        centerX + (24 * scale) + margenInicial,  
        centerX + (24 * scale) + margenInicial + separacionCol, 
        centerX + (24 * scale) + margenInicial + (separacionCol * 2)  
    ];

    for (let col = 0; col < 3; col++) {
        for (let i = 0; i < 3; i++) {
            // Lado Izquierdo
            corazonesFlotantes.push({
                x: columnasIzquierda[col] + (Math.random() * 10 - 5), 
                y: desfasesY[i] + (Math.random() * 20 - 10), 
                sizeBase: tamanosColumnas[col][i], 
                sizeActualBucle: tamanosColumnas[col][i], 
                color: coloresCorazones[Math.floor(Math.random() * coloresCorazones.length)],
                velocidad: Math.random() * 0.6 + 0.5,
                rotacion: (Math.random() * 30 - 15) * Math.PI / 180 
            });
            // Lado Derecho
            corazonesFlotantes.push({
                x: columnasDerecha[col] + (Math.random() * 10 - 5), 
                y: desfasesY[i] + (Math.random() * 20 - 10), 
                sizeBase: tamanosColumnas[col][i], 
                sizeActualBucle: tamanosColumnas[col][i],
                color: coloresCorazones[Math.floor(Math.random() * coloresCorazones.length)],
                velocidad: Math.random() * 0.6 + 0.5,
                rotacion: (Math.random() * 30 - 15) * Math.PI / 180 
            });
        }
    }
}

function drawMiniHeart(size) {
    ctx.beginPath();
    ctx.moveTo(0, -size * 0.25);
    ctx.bezierCurveTo(size * 0.7, -size * 0.9, size * 1.1, -size * 0.1, 0, size * 0.85);
    ctx.bezierCurveTo(-size * 1.1, -size * 0.1, -size * 0.7, -size * 0.9, 0, -size * 0.25);
    ctx.closePath();
    ctx.fill();
}

function crearEstrella(x, y) {
    return {
        x: x,
        y: y,
        size: Math.random() * (esCelular ? 4 : 6) + 3, 
        anguloParpadeo: Math.random() * Math.PI * 2,
        velocidadParpadeo: Math.random() * 0.1 + 0.05
    };
}

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

let animacionActiva = true;
boton.addEventListener('click', () => {
    animacionActiva = false;
});

window.addEventListener('click', () => {
    if (audio && audio.paused) {
        audio.play().catch(e => console.log("Permisos de reproducción pendientes"));
    }
}, { once: true });

setTimeout(() => {
    if(titulo) titulo.style.opacity = "1";
}, 200);

inicializarCorazonesFlotantes();

function draw() {
    if (!animacionActiva) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (entradaCorazonesOpacity < 1) {
        entradaCorazonesOpacity += 0.01; 
    }

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#b91d1d";
    ctx.lineWidth = esCelular ? 8 : 12;
    ctx.lineCap = "round";
    
    ctx.beginPath();
    for (let i = 0; i <= t; i += speed) {
        let tempX = 16 * Math.pow(Math.sin(i), 3);
        let tempY = -(13 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(i * 3) - Math.cos(i * 4));
        let dX = centerX + tempX * scale;
        let dY = centerY + tempY * scale;
        if (i === 0) ctx.moveTo(dX, dY);
        else ctx.lineTo(dX, dY);
    }
    ctx.stroke();
    ctx.restore();

    let currentX = 16 * Math.pow(Math.sin(t), 3);
    let currentY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const drawX = centerX + currentX * scale;
    const drawY = centerY + currentY * scale;

    if (Math.random() < 0.4 && t <= 2 * Math.PI) {
        estrellas.push(crearEstrella(drawX, drawY));
    }

    estrellas.forEach(estrella => {
        estrella.anguloParpadeo += estrella.velocidadParpadeo;
        let opacidadActual = (Math.sin(estrella.anguloParpadeo) + 1) / 2; 
        
        ctx.save();
        ctx.globalAlpha = opacidadActual;
        ctx.fillStyle = colorAmarilloFosforito;
        ctx.shadowColor = colorAmarilloFosforito;
        ctx.shadowBlur = 10;
        
        drawStar(estrella.x, estrella.y, 5, estrella.size, estrella.size / 2);
        ctx.restore();
    });

    corazonesFlotantes.forEach(corazon => {
        corazon.y -= corazon.velocidad;

        const limiteSuperior = centerY - (14 * scale); 
        const limiteInferior = centerY + (14 * scale);  
        
        let porcentajeSubida = (limiteInferior - corazon.y) / (limiteInferior - limiteSuperior);
        if (porcentajeSubida < 0) porcentajeSubida = 0;
        if (porcentajeSubida > 1) porcentajeSubida = 1;

        let opacidadCorazon = (1 - porcentajeSubida) * entradaCorazonesOpacity;
        let tamanoActual = corazon.sizeBase * (1 - porcentajeSubida * 0.4);

        if (corazon.y <= limiteSuperior) {
            corazon.y = limiteInferior;
            corazon.sizeBase = corazon.sizeActualBucle; 
            opacidadCorazon = 1 * entradaCorazonesOpacity;
            tamanoActual = corazon.sizeActualBucle;
            corazon.rotacion = (Math.random() * 30 - 15) * Math.PI / 180;
        }

        ctx.save();
        ctx.translate(corazon.x, corazon.y);
        ctx.rotate(corazon.rotacion);
        
        ctx.globalAlpha = opacidadCorazon;
        ctx.fillStyle = corazon.color;
        ctx.shadowColor = corazon.color;
        ctx.shadowBlur = esCelular ? 8 : 15; 
        
        drawMiniHeart(tamanoActual);
        ctx.restore();
    });

    t += speed;

    if (t <= 2 * Math.PI + speed) {
        requestAnimationFrame(draw);
    } else {
        fillHeart();
    }
}

let fillOpacity = 0;
let botonMostrado = false; 

function fillHeart() {
    if (!animacionActiva) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (fillOpacity < 0.7) { 
        fillOpacity += 0.005;
    }
    
    ctx.save();
    ctx.globalAlpha = fillOpacity;
    ctx.fillStyle = "#ff4d6d";
    ctx.beginPath();
    for (let i = 0; i <= 2 * Math.PI + speed; i += speed) {
        let tempX = 16 * Math.pow(Math.sin(i), 3);
        let tempY = -(13 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(i * 3) - Math.cos(i * 4));
        let dX = centerX + tempX * scale;
        let dY = centerY + tempY * scale;
        if (i === 0) ctx.moveTo(dX, dY);
        else ctx.lineTo(dX, dY);
    }
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#b91d1d";
    ctx.lineWidth = esCelular ? 8 : 12;
    ctx.beginPath();
    for (let i = 0; i <= 2 * Math.PI + speed; i += speed) {
        let tempX = 16 * Math.pow(Math.sin(i), 3);
        let tempY = -(13 * Math.cos(i) - 5 * Math.cos(2 * i) - 2 * Math.cos(i * 3) - Math.cos(i * 4));
        let dX = centerX + tempX * scale;
        let dY = centerY + tempY * scale;
        if (i === 0) ctx.moveTo(dX, dY);
        else ctx.lineTo(dX, dY);
    }
    ctx.stroke();
    ctx.restore();

    estrellas.forEach(estrella => {
        estrella.anguloParpadeo += estrella.velocidadParpadeo;
        let opacidadActual = (Math.sin(estrella.anguloParpadeo) + 1) / 2;
        ctx.save();
        ctx.globalAlpha = opacidadActual;
        ctx.fillStyle = colorAmarilloFosforito;
        ctx.shadowColor = colorAmarilloFosforito;
        ctx.shadowBlur = 10;
        drawStar(estrella.x, estrella.y, 5, estrella.size, estrella.size / 2);
        ctx.restore();
    });

    corazonesFlotantes.forEach(corazon => {
        corazon.y -= corazon.velocidad;

        const limiteSuperior = centerY - (14 * scale);
        const limiteInferior = centerY + (14 * scale);
        
        let porcentajeSubida = (limiteInferior - corazon.y) / (limiteInferior - limiteSuperior);
        if (porcentajeSubida < 0) porcentajeSubida = 0;
        if (porcentajeSubida > 1) porcentajeSubida = 1;

        let opacidadCorazon = (1 - porcentajeSubida) * entradaCorazonesOpacity;
        let tamanoActual = corazon.sizeBase * (1 - porcentajeSubida * 0.4);

        if (corazon.y <= limiteSuperior) {
            corazon.y = limiteInferior;
            corazon.sizeBase = corazon.sizeActualBucle; 
            opacidadCorazon = 1 * entradaCorazonesOpacity;
            tamanoActual = corazon.sizeActualBucle;
            corazon.rotacion = (Math.random() * 30 - 15) * Math.PI / 180;
        }

        ctx.save();
        ctx.translate(corazon.x, corazon.y);
        ctx.rotate(corazon.rotacion);
        
        ctx.globalAlpha = opacidadCorazon;
        ctx.fillStyle = corazon.color;
        ctx.shadowColor = corazon.color;
        ctx.shadowBlur = esCelular ? 8 : 15; 
        
        drawMiniHeart(tamanoActual);
        ctx.restore();
    });

    if (fillOpacity >= 0.7 && !botonMostrado) {
        boton.style.display = "block";
        boton.style.left = (centerX - boton.offsetWidth / 2) + "px";
        boton.style.top = (centerY - boton.offsetHeight / 2) + "px";
        botonMostrado = true; 
    }

    requestAnimationFrame(fillHeart);
}

draw();
