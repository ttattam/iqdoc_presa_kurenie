let currentSlide = 1;
const totalSlides = 9;

// DOM elements
const slides = document.querySelectorAll('.slide');
const currentSlideSpan = document.querySelector('.current-slide');
const totalSlidesSpan = document.querySelector('.total-slides');
const progressFill = document.querySelector('.progress-fill');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// Initialize presentation
function initPresentation() {
    updateSlideDisplay();
    updateProgress();
    updateNavigationButtons();
    
    // Set total slides
    totalSlidesSpan.textContent = totalSlides;
    
    // Add keyboard event listeners
    document.addEventListener('keydown', handleKeyPress);
    
    // Add touch/swipe support for mobile
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Only handle horizontal swipes
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide(); // Swipe left -> next slide
            } else {
                previousSlide(); // Swipe right -> previous slide
            }
        }
    });
    
    // Add mouse wheel support
    document.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY > 0) {
            nextSlide();
        } else {
            previousSlide();
        }
    }, { passive: false });
}

// Handle keyboard navigation
function handleKeyPress(e) {
    switch(e.key) {
        case 'ArrowRight':
        case ' ': // Spacebar
        case 'Enter':
            e.preventDefault();
            nextSlide();
            break;
        case 'ArrowLeft':
        case 'Backspace':
            e.preventDefault();
            previousSlide();
            break;
        case 'Home':
            e.preventDefault();
            goToSlide(1);
            break;
        case 'End':
            e.preventDefault();
            goToSlide(totalSlides);
            break;
        case 'Escape':
            e.preventDefault();
            toggleFullscreen();
            break;
        default:
            // Handle number keys (1-9)
            const slideNumber = parseInt(e.key);
            if (slideNumber >= 1 && slideNumber <= totalSlides) {
                e.preventDefault();
                goToSlide(slideNumber);
            }
            break;
    }
}

// Go to next slide
function nextSlide() {
    if (currentSlide < totalSlides) {
        currentSlide++;
        updateSlideDisplay();
        updateProgress();
        updateNavigationButtons();
        addSlideAnimation('next');
    }
}

// Go to previous slide
function previousSlide() {
    if (currentSlide > 1) {
        currentSlide--;
        updateSlideDisplay();
        updateProgress();
        updateNavigationButtons();
        addSlideAnimation('prev');
    }
}

// Go to specific slide
function goToSlide(slideNumber) {
    if (slideNumber >= 1 && slideNumber <= totalSlides && slideNumber !== currentSlide) {
        const direction = slideNumber > currentSlide ? 'next' : 'prev';
        currentSlide = slideNumber;
        updateSlideDisplay();
        updateProgress();
        updateNavigationButtons();
        addSlideAnimation(direction);
    }
}

// Update slide display
function updateSlideDisplay() {
    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index + 1 === currentSlide) {
            slide.classList.add('active');
        }
    });
    
    currentSlideSpan.textContent = currentSlide;
}

// Update progress bar
function updateProgress() {
    const progressPercentage = (currentSlide / totalSlides) * 100;
    progressFill.style.width = `${progressPercentage}%`;
}

// Update navigation buttons
function updateNavigationButtons() {
    prevBtn.disabled = currentSlide === 1;
    nextBtn.disabled = currentSlide === totalSlides;
}

// Add slide animation effects
function addSlideAnimation(direction) {
    const activeSlide = document.querySelector('.slide.active');
    
    if (direction === 'next') {
        activeSlide.style.transform = 'translateX(-50px)';
        setTimeout(() => {
            activeSlide.style.transform = 'translateX(0)';
        }, 100);
    } else {
        activeSlide.style.transform = 'translateX(50px)';
        setTimeout(() => {
            activeSlide.style.transform = 'translateX(0)';
        }, 100);
    }
}

// Toggle fullscreen mode
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen().catch(err => {
            console.log(`Error attempting to exit fullscreen: ${err.message}`);
        });
    }
}

// Auto-advance slides (optional - can be enabled)
function startAutoAdvance(intervalSeconds = 10) {
    const autoAdvanceInterval = setInterval(() => {
        if (currentSlide < totalSlides) {
            nextSlide();
        } else {
            clearInterval(autoAdvanceInterval);
        }
    }, intervalSeconds * 1000);
    
    // Clear auto-advance on user interaction
    document.addEventListener('click', () => clearInterval(autoAdvanceInterval), { once: true });
    document.addEventListener('keydown', () => clearInterval(autoAdvanceInterval), { once: true });
    document.addEventListener('touchstart', () => clearInterval(autoAdvanceInterval), { once: true });
}

// Add some interactive effects
function addInteractiveEffects() {
    // Parallax effect for background
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        document.body.style.backgroundPosition = `${mouseX * 20}px ${mouseY * 20}px`;
    });
    
    // Add hover effects to stat items
    const statItems = document.querySelectorAll('.stat-item, .disease-item, .money-item, .method, .victim-group');
    statItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05) translateY(-5px)';
            item.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1) translateY(0)';
            item.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
        });
    });
}

// Add typing effect for titles
function addTypingEffect() {
    const titles = document.querySelectorAll('h1');
    
    titles.forEach(title => {
        const text = title.textContent;
        title.textContent = '';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter(title, text, 0, 100);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(title);
    });
}

function typeWriter(element, text, index, speed) {
    if (index < text.length) {
        element.textContent += text.charAt(index);
        setTimeout(() => typeWriter(element, text, index + 1, speed), speed);
    }
}

// Add slide transition sounds (optional)
function playTransitionSound() {
    // Create a subtle sound effect
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    initPresentation();
    addInteractiveEffects();
    
    // Uncomment to enable auto-advance
    // startAutoAdvance(15);
    
    // Add sound to slide transitions
    const originalNextSlide = nextSlide;
    const originalPreviousSlide = previousSlide;
    
    window.nextSlide = function() {
        playTransitionSound();
        originalNextSlide();
    };
    
    window.previousSlide = function() {
        playTransitionSound();
        originalPreviousSlide();
    };
});

// Expose functions globally for HTML onclick handlers
window.nextSlide = nextSlide;
window.previousSlide = previousSlide;
window.goToSlide = goToSlide; 