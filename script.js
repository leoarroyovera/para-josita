// Estado de la aplicación
let currentQuestion = 0;
let hasAccepted = false;
let isInLoop = false;
let firstNegativeResponse = true; // Flag para la primera respuesta negativa
let penaInterval = null; // Intervalo para la aparición continua de la imagen de pena
let confettiInterval = null; // Intervalo para confeti continuo

// Definición de preguntas
const questions = [
    "Entonces, ¿Quieres pololear conmigo?",
    "¿Estás Segura?",
    "¿En serio?",
    "¿Despues de todos estos años?"
];

// Últimas 3 preguntas para el loop
const loopQuestions = [
    "¿Acaso soy muy gordo para ti?",
    "¿Acaso soy muy feo para ti?",
    "¿Acaso soy demasiado hermoso para ti?",
    "¿Acaso soy muy blanco para ti?",
    "¿Acaso soy muy pobre para ti?",
    "¿Es porque no soy Luksic?",
    "¿Es porque no me parezco a Roman Reigns?",
    "¿Es porque no soy tan alto como tú?",
    "¿Es porque no soy tan guapo como tú?",
    "¿Es porque no soy tan inteligente como tú?",
    "¿Es porque no soy tan rico como tú?",
    "¿Es porque no soy tan fuerte como tú?",
    "¿Es porque no soy tan inteligente como tú?",
    "¿Es porque no soy tan rico como tú?",
    "¿Es porque no soy tan fuerte como tú?",
    "¿Es porque no huelo a poto como tú?"
];

// Elementos del DOM
const questionElement = document.getElementById('question');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const questionCard = document.getElementById('questionCard');
const buttonsContainer = document.querySelector('.buttons-container');
const celebrationSound = document.getElementById('celebrationSound');
const polaroidsContainer = document.querySelector('.polaroids-container');
const penaImage = document.getElementById('penaImage');
const heartImage = document.getElementById('heartImage');

// Función para cambiar de pregunta con transición suave
function changeQuestion(newQuestion) {
    // Fade out
    questionCard.classList.add('fade-out');
    
    setTimeout(() => {
        questionElement.textContent = newQuestion;
        questionCard.classList.remove('fade-out');
        questionCard.classList.add('fade-in');
        
        setTimeout(() => {
            questionCard.classList.remove('fade-in');
        }, 600);
    }, 300);
}

// Función para lanzar confeti
function launchConfetti(infinite = false) {
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    function launchConfettiBurst() {
        const particleCount = 50;

        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }

    if (infinite) {
        // Confeti continuo indefinido
        if (confettiInterval) {
            clearInterval(confettiInterval);
        }
        
        // Lanzar confeti cada 250ms indefinidamente
        confettiInterval = setInterval(launchConfettiBurst, 250);
    } else {
        // Confeti temporal (3 segundos)
        const duration = 3000;
        const animationEnd = Date.now() + duration;

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);
    }
}

// Función para reproducir sonido de celebración
function playCelebrationSound() {
    celebrationSound.currentTime = 0;
    celebrationSound.play().catch(error => {
        console.log('No se pudo reproducir el sonido:', error);
    });
}

// Función para obtener pregunta aleatoria del loop
function getRandomLoopQuestion() {
    const randomIndex = Math.floor(Math.random() * loopQuestions.length);
    return loopQuestions[randomIndex];
}

// Manejo del botón SI
btnYes.addEventListener('click', () => {
    if (currentQuestion === 0 && !hasAccepted) {
        // Primera pregunta - respuesta SI
        hasAccepted = true;
        launchConfetti(true); // Confeti indefinido
        playCelebrationSound();
        
        // Activar animación de salto en las polaroids
        activatePolaroidsJumping();
        
        // Ocultar pregunta y botones con animación
        questionCard.classList.add('hide');
        if (buttonsContainer) buttonsContainer.classList.add('hide');
        
        // Mostrar corazón con animación después de que desaparezca la pregunta
        setTimeout(() => {
            if (heartImage) {
                heartImage.classList.add('show');
            }
        }, 400);
        
        return;
    }
    
    if (currentQuestion === 1) {
        // "¿Estás Segura?" - SI -> "¿En serio?"
        currentQuestion = 2;
        changeQuestion(questions[currentQuestion]);
        return;
    }
    
    if (currentQuestion === 2) {
        // "¿En serio?" - SI -> "¿Despues de todos estos años?"
        currentQuestion = 3;
        isInLoop = true;
        changeQuestion(questions[currentQuestion]);
        return;
    }
    
    if (currentQuestion === 3 || isInLoop) {
        // "¿Despues de todos estos años?" o cualquier pregunta del loop
        // Ir a una pregunta aleatoria del loop
        // Invertir fondo y activar modo negativo cuando se elige SI en el loop
        document.body.classList.add('inverted');
        questionCard.classList.add('negative');
        if (polaroidsContainer) polaroidsContainer.classList.add('negative');
        
        // Asegurar que la animación de pena esté activa
        startPenaAnimation();
        
        const randomQuestion = getRandomLoopQuestion();
        changeQuestion(randomQuestion);
        return;
    }
});

// Manejo del botón NO
btnNo.addEventListener('click', () => {
    if (currentQuestion === 0) {
        // Primera pregunta - NO -> "¿Estás Segura?"
        // Invertir fondo y activar modo negativo cuando se elige NO en la primera pregunta
        document.body.classList.add('inverted');
        questionCard.classList.add('negative');
        if (polaroidsContainer) polaroidsContainer.classList.add('negative');
        
        // Iniciar aparición continua de la imagen de pena
        startPenaAnimation();
        
        currentQuestion = 1;
        changeQuestion(questions[currentQuestion]);
        return;
    }
    
    if (currentQuestion === 1) {
        // "¿Estás Segura?" - NO -> volver a la primera pregunta
        // Restaurar fondo normal y quitar modo negativo
        document.body.classList.remove('inverted');
        questionCard.classList.remove('negative');
        if (polaroidsContainer) polaroidsContainer.classList.remove('negative');
        stopPenaAnimation();
        currentQuestion = 0;
        changeQuestion(questions[currentQuestion]);
        return;
    }
    
    if (currentQuestion === 2) {
        // "¿En serio?" - NO -> volver a la primera pregunta
        // Restaurar fondo normal y quitar modo negativo
        document.body.classList.remove('inverted');
        questionCard.classList.remove('negative');
        if (polaroidsContainer) polaroidsContainer.classList.remove('negative');
        stopPenaAnimation();
        currentQuestion = 0;
        changeQuestion(questions[currentQuestion]);
        return;
    }
    
    if (currentQuestion === 3 || isInLoop) {
        // "¿Despues de todos estos años?" o cualquier pregunta del loop - NO -> volver a la primera pregunta
        // Restaurar fondo normal y quitar modo negativo
        document.body.classList.remove('inverted');
        questionCard.classList.remove('negative');
        if (polaroidsContainer) polaroidsContainer.classList.remove('negative');
        stopPenaAnimation();
        currentQuestion = 0;
        isInLoop = false;
        changeQuestion(questions[currentQuestion]);
        return;
    }
});

// Prevenir que el sonido falle silenciosamente en algunos navegadores
celebrationSound.addEventListener('error', (e) => {
    console.log('El archivo de audio no se encontró. Asegúrate de tener celebration.mp3 en la carpeta.');
});

// Función para mostrar la imagen de pena con animación de vuelo
function showPenaImage() {
    if (!penaImage) return;
    
    // Decidir de qué lado viene y hacia dónde va
    const side = Math.random() < 0.5 ? 'left' : 'right';
    const startX = side === 'left' ? '-20%' : '120%';
    const endX = side === 'left' ? '120%' : '-20%';
    const startY = Math.random() * 60 + 20; // Entre 20% y 80%
    const endY = Math.random() * 60 + 20; // Entre 20% y 80%
    
    // Posición inicial
    penaImage.style.left = startX;
    penaImage.style.top = startY + '%';
    penaImage.style.transform = 'translate(-50%, -50%) scale(0.5)';
    penaImage.style.opacity = '0';
    
    // Mostrar la imagen
    penaImage.classList.add('show');
    
    // Forzar reflow para que la animación funcione
    void penaImage.offsetWidth;
    
    // Animar hacia la posición final
    setTimeout(() => {
        penaImage.style.left = endX;
        penaImage.style.top = endY + '%';
        penaImage.style.transform = 'translate(-50%, -50%) scale(1)';
        penaImage.style.opacity = '1';
    }, 50);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        penaImage.style.opacity = '0';
        penaImage.style.transform = 'translate(-50%, -50%) scale(0.5)';
        
        setTimeout(() => {
            penaImage.classList.remove('show');
        }, 500);
    }, 3000);
}

// Función para iniciar la animación continua de la imagen de pena
function startPenaAnimation() {
    if (!penaImage) return;
    
    // Si ya está activo, no hacer nada
    if (penaInterval) return;
    
    // Mostrar la primera imagen inmediatamente si es la primera vez
    if (firstNegativeResponse) {
        showPenaImage();
        firstNegativeResponse = false;
    }
    
    // Iniciar el intervalo para mostrar la imagen cada 3.5 segundos
    penaInterval = setInterval(() => {
        showPenaImage();
    }, 3500); // 3.5 segundos para que termine una animación antes de empezar la siguiente
}

// Función para detener la animación continua de la imagen de pena
function stopPenaAnimation() {
    if (penaInterval) {
        clearInterval(penaInterval);
        penaInterval = null;
    }
    
    // Ocultar la imagen si está visible
    if (penaImage) {
        penaImage.classList.remove('show');
        penaImage.style.opacity = '0';
    }
}

// Función para activar animación de salto en las polaroids
function activatePolaroidsJumping() {
    const polaroids = document.querySelectorAll('.polaroid');
    polaroids.forEach((polaroid, index) => {
        // Agregar delay aleatorio diferente para cada polaroid
        const randomDelay = Math.random() * 0.5; // Delay entre 0 y 0.5 segundos
        polaroid.style.setProperty('--jump-delay', randomDelay + 's');
        polaroid.classList.add('jumping');
    });
}

// Función para crear decoración de corazones en la parte inferior
function createHeartsDecoration() {
    const heartsContainer = document.getElementById('heartsDecoration');
    if (!heartsContainer) return;
    
    // Número de corazones a crear (aumentado para cubrir toda la pantalla)
    const isMobile = window.innerWidth <= 768;
    const numHearts = isMobile ? 80 : 120;
    
    // Obtener dimensiones del contenedor
    const containerHeight = window.innerHeight;
    const containerWidth = window.innerWidth;
    
    for (let i = 0; i < numHearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'decorative-heart';
        
        const img = document.createElement('img');
        img.src = 'corazon_base.png';
        img.alt = 'Corazón decorativo';
        heart.appendChild(img);
        
        // Tamaño aleatorio (algunos más grandes para cubrir más área)
        const sizeVariation = Math.random();
        const size = isMobile 
            ? (sizeVariation < 0.3 ? Math.random() * 60 + 40 : Math.random() * 40 + 20)  // 40-100px o 20-60px en móvil
            : (sizeVariation < 0.3 ? Math.random() * 80 + 60 : Math.random() * 50 + 30); // 60-140px o 30-80px en desktop
        
        heart.style.width = size + 'px';
        heart.style.height = size + 'px';
        
        // Posición aleatoria horizontal
        heart.style.left = Math.random() * 100 + '%';
        
        // Posición vertical aleatoria en toda la pantalla
        heart.style.top = Math.random() * containerHeight + 'px';
        
        // Rotación aleatoria limitada a máximo 90 grados (-45 a +45 para que no se vean invertidos)
        const rotation = (Math.random() * 90) - 45; // Entre -45 y +45 grados
        heart.style.transform = `rotate(${rotation}deg)`;
        
        // Algunos corazones tienen efecto de latido (30% de probabilidad)
        if (Math.random() < 0.3) {
            heart.classList.add('beating');
            // Delay aleatorio para que no todos laten al mismo tiempo
            heart.style.setProperty('--beat-delay', Math.random() * 2 + 's');
        }
        
        heartsContainer.appendChild(heart);
    }
}

// Crear decoración de corazones al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    createHeartsDecoration();
});

// Las polaroids se animan automáticamente con CSS, no se necesita JavaScript adicional

