// Variables globales
let completedSteps = new Set();
const totalSteps = 5;

// DOM Elements
let progressBar;
let completeButtons;
let stepCards;

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Función principal de inicialización
function initializeApp() {
    // Inicializar elementos DOM
    progressBar = document.getElementById('progressBar');
    completeButtons = document.querySelectorAll('.complete-btn');
    stepCards = document.querySelectorAll('.step-card');

    setupCompleteButtons();
    setupScrollAnimations();
    updateProgressBar();
    loadProgress();

    // Animación inicial de entrada
    animateOnLoad();

    console.log('🚀 Aplicación de IA iniciada correctamente');
}

// Configurar botones de completado
function setupCompleteButtons() {
    completeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const stepNumber = parseInt(this.getAttribute('data-step'));
            toggleStepCompletion(stepNumber, this);
        });
    });
}

// Alternar completado de paso
function toggleStepCompletion(stepNumber, button) {
    const stepCard = document.querySelector(`[data-step="${stepNumber}"]`);

    if (!stepCard || !button) {
        console.error('No se encontró el paso o botón', stepNumber);
        return;
    }

    if (completedSteps.has(stepNumber)) {
        // Desmarcar como completado
        completedSteps.delete(stepNumber);
        stepCard.classList.remove('completed');
        button.classList.remove('completed');
        button.innerHTML = '✓ Marcar como completado';

        // Animación de descompletado
        animateStepUncompleted(stepCard);
    } else {
        // Marcar como completado
        completedSteps.add(stepNumber);
        stepCard.classList.add('completed');
        button.classList.add('completed');
        button.innerHTML = '🎉 ¡Completado!';

        // Animación de completado
        animateStepCompleted(stepCard);

        // Efecto de celebración
        showCelebrationEffect(button);
    }

    updateProgressBar();
    saveProgress();
}

// Actualizar barra de progreso
function updateProgressBar() {
    if (!progressBar) return;

    const progressPercentage = (completedSteps.size / totalSteps) * 100;
    progressBar.style.width = progressPercentage + '%';

    // Efecto visual según el progreso
    if (progressPercentage === 100) {
        progressBar.style.background = 'linear-gradient(90deg, #10b981 0%, #059669 100%)';
        showCompletionMessage();
    } else if (progressPercentage >= 60) {
        progressBar.style.background = 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)';
    } else {
        progressBar.style.background = 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)';
    }
}

// Configurar animaciones de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    stepCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease-out';
        observer.observe(card);
    });
}

// Animación inicial de carga
function animateOnLoad() {
    const heroContent = document.querySelector('.hero-content');
    const introCard = document.querySelector('.intro-card');

    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(-30px)';

        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 100);
    }

    if (introCard) {
        setTimeout(() => {
            introCard.style.transform = 'scale(0.95)';
            introCard.style.transition = 'all 0.6s ease-out';

            setTimeout(() => {
                introCard.style.transform = 'scale(1)';
            }, 200);
        }, 300);
    }
}

// Animación de paso completado
function animateStepCompleted(stepCard) {
    if (!stepCard) return;

    stepCard.style.transform = 'scale(1.02)';
    stepCard.style.transition = 'all 0.3s ease-out';

    setTimeout(() => {
        stepCard.style.transform = 'scale(1)';
    }, 300);

    // Efecto de brillo
    stepCard.style.boxShadow = '0 0 20px rgba(67, 233, 123, 0.4)';

    setTimeout(() => {
        stepCard.style.boxShadow = '';
    }, 1000);
}

// Animación de paso descompletado
function animateStepUncompleted(stepCard) {
    if (!stepCard) return;

    stepCard.style.transform = 'scale(0.98)';
    stepCard.style.transition = 'all 0.3s ease-out';

    setTimeout(() => {
        stepCard.style.transform = 'scale(1)';
    }, 300);
}

// Mostrar efecto de celebración
function showCelebrationEffect(button) {
    if (!button) return;

    button.classList.add('celebration-effect');

    setTimeout(() => {
        button.classList.remove('celebration-effect');
    }, 1000);

    // Vibración sutil (si el navegador lo soporta)
    if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
    }
}

// Mostrar mensaje de completación total
function showCompletionMessage() {
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            color: white;
            padding: 2rem;
            border-radius: 1rem;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            z-index: 1000;
            max-width: 400px;
            animation: celebration-popup 0.5s ease-out;
        ">
            <h2 style="margin: 0 0 1rem 0; font-size: 1.5rem;">🎉 ¡Felicidades!</h2>
            <p style="margin: 0; opacity: 0.9;">Has completado todo el proceso formativo de IA. ¡Estás lista para dominar el mundo de la inteligencia artificial!</p>
        </div>
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
        "></div>
    `;

    // Añadir estilos de animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes celebration-popup {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(message);

    // Cerrar al hacer clic
    message.addEventListener('click', function() {
        message.remove();
        style.remove();
    });

    // Auto cerrar después de 5 segundos
    setTimeout(() => {
        if (message.parentNode) {
            message.remove();
            style.remove();
        }
    }, 5000);
}

// Guardar progreso en localStorage
function saveProgress() {
    try {
        const progressData = {
            completedSteps: Array.from(completedSteps),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('ai-learning-progress', JSON.stringify(progressData));
    } catch (error) {
        console.warn('No se pudo guardar el progreso:', error);
    }
}

// Cargar progreso desde localStorage
function loadProgress() {
    try {
        const savedProgress = localStorage.getItem('ai-learning-progress');
        if (savedProgress) {
            const progressData = JSON.parse(savedProgress);

            progressData.completedSteps.forEach(stepNumber => {
                completedSteps.add(stepNumber);

                const stepCard = document.querySelector(`[data-step="${stepNumber}"]`);
                const button = document.querySelector(`.complete-btn[data-step="${stepNumber}"]`);

                if (stepCard && button) {
                    stepCard.classList.add('completed');
                    button.classList.add('completed');
                    button.innerHTML = '🎉 ¡Completado!';
                }
            });

            updateProgressBar();
        }
    } catch (error) {
        console.warn('No se pudo cargar el progreso guardado:', error);
    }
}

// Funciones de utilidad
function resetProgress() {
    completedSteps.clear();
    stepCards.forEach(card => card.classList.remove('completed'));
    completeButtons.forEach(button => {
        button.classList.remove('completed');
        button.innerHTML = '✓ Marcar como completado';
    });
    updateProgressBar();
    saveProgress();
}

// Exponer funciones globalmente para depuración
window.AILearningApp = {
    resetProgress,
    completedSteps,
    totalSteps
};

// Manejar errores globales
window.addEventListener('error', function(event) {
    console.error('Error en la aplicación:', event.error);
});

// Smooth scrolling para navegación interna
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});