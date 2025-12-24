// Estado de la aplicación
let currentQuestion = 0;
let hasAccepted = false;
let isInLoop = false;

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
const celebrationSound = document.getElementById('celebrationSound');
const polaroidsContainer = document.querySelector('.polaroids-container');

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
function launchConfetti() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

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
        launchConfetti();
        playCelebrationSound();
        questionCard.classList.add('celebrating');
        setTimeout(() => {
            questionCard.classList.remove('celebrating');
        }, 1500);
        // Mantener la misma pregunta después de la celebración
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

// Las polaroids se animan automáticamente con CSS, no se necesita JavaScript adicional

