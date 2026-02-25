// ========================================
// SABOR & BRASA - MAIN JAVASCRIPT
// ========================================

'use strict';

// ========================================
// PRELOADER
// ========================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1000);
    }
});

// ========================================
// INITIALIZE AOS (Animate On Scroll)
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            delay: 100,
        });
    }
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ========================================
// MENU PAGE - CATEGORY FILTERING
// ========================================
const initMenuFilters = () => {
    const menuLinks = document.querySelectorAll('.menu-nav .nav-link');
    const menuSections = document.querySelectorAll('.menu-section');
    
    if (menuLinks.length === 0) return;
    
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            menuLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get target category
            const targetCategory = link.getAttribute('data-category');
            
            // Show/hide sections with animation
            menuSections.forEach(section => {
                const sectionCategory = section.getAttribute('data-category');
                
                if (targetCategory === 'todos' || sectionCategory === targetCategory) {
                    section.style.display = 'block';
                    setTimeout(() => {
                        section.style.opacity = '1';
                        section.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    section.style.opacity = '0';
                    section.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        section.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Set initial state
    menuSections.forEach(section => {
        section.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });
};

// ========================================
// RESERVATION FORM - TIME SELECTOR
// ========================================
const initTimeSelector = () => {
    const timeButtons = document.querySelectorAll('.time-btn');
    const timeInput = document.getElementById('hora');
    
    if (timeButtons.length === 0) return;
    
    timeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove selected class from all buttons
            timeButtons.forEach(b => b.classList.remove('selected'));
            
            // Add selected class to clicked button
            btn.classList.add('selected');
            
            // Update hidden input value
            if (timeInput) {
                timeInput.value = btn.textContent.trim();
            }
        });
    });
};

// ========================================
// RESERVATION FORM - VALIDATION & SUBMIT
// ========================================
const initReservationForm = () => {
    const form = document.getElementById('reservationForm');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const fecha = document.getElementById('fecha').value;
        const hora = document.getElementById('hora').value;
        const personas = document.getElementById('personas').value;
        const mensaje = document.getElementById('mensaje').value.trim();
        
        // Validate required fields
        if (!nombre || !email || !telefono || !fecha || !hora || !personas) {
            showNotification('Por favor, complete todos los campos obligatorios.', 'error');
            return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor, ingrese un email válido.', 'error');
            return;
        }
        
        // Validate phone format (basic)
        const phoneRegex = /^[0-9\s\-\+\(\)]{9,}$/;
        if (!phoneRegex.test(telefono)) {
            showNotification('Por favor, ingrese un teléfono válido.', 'error');
            return;
        }
        
        // Validate date is not in the past
        const selectedDate = new Date(fecha);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            showNotification('Por favor, seleccione una fecha futura.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Procesando...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            showSuccessMessage({
                nombre,
                fecha,
                hora,
                personas
            });
            
            // Reset form
            form.reset();
            
            // Remove selected class from time buttons
            document.querySelectorAll('.time-btn').forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
        }, 2000);
    });
};

// ========================================
// SHOW SUCCESS MESSAGE
// ========================================
const showSuccessMessage = (data) => {
    const formCard = document.querySelector('.reservation-card');
    
    // Create success message
    const successHTML = `
        <div class="success-message">
            <div class="success-icon">✓</div>
            <h3 class="mb-3">¡Reserva Confirmada!</h3>
            <p class="mb-0">Hola <strong>${data.nombre}</strong>,</p>
            <p class="mb-0">Tu mesa para <strong>${data.personas} ${data.personas === '1' ? 'persona' : 'personas'}</strong></p>
            <p class="mb-0">El <strong>${formatDate(data.fecha)}</strong> a las <strong>${data.hora}</strong></p>
            <p class="mt-3 mb-0">Te hemos enviado un correo de confirmación.</p>
            <button class="btn btn-light btn-pill mt-4 px-4" onclick="location.reload()">
                Nueva Reserva
            </button>
        </div>
    `;
    
    // Replace form with success message
    formCard.innerHTML = successHTML;
    
    // Scroll to message
    formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// ========================================
// SHOW NOTIFICATION
// ========================================
const showNotification = (message, type = 'info') => {
    // Remove existing notifications
    const existing = document.querySelector('.notification-toast');
    if (existing) {
        existing.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification-toast notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'error' ? '✕' : 'ℹ'}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 15px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
};

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-icon {
        font-size: 1.2rem;
        font-weight: bold;
    }
`;
document.head.appendChild(style);

// ========================================
// FORMAT DATE
// ========================================
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('es-PE', options);
};

// ========================================
// SET MINIMUM DATE FOR RESERVATION
// ========================================
const setMinDate = () => {
    const dateInput = document.getElementById('fecha');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const year = tomorrow.getFullYear();
        const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const day = String(tomorrow.getDate()).padStart(2, '0');
        
        dateInput.min = `${year}-${month}-${day}`;
    }
};

// ========================================
// PARALLAX EFFECT ON SCROLL
// ========================================
const initParallax = () => {
    const hero = document.querySelector('.hero-restaurant');
    
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            hero.style.backgroundPositionY = `${scrolled * parallaxSpeed}px`;
        });
    }
};

// ========================================
// COUNTER ANIMATION FOR NUMBERS
// ========================================
const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
};

// ========================================
// MENU ITEM HOVER EFFECT (Optional Enhancement)
// ========================================
const initMenuItemEffects = () => {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0) scale(1)';
        });
    });
};

// ========================================
// INITIALIZE ALL FUNCTIONS
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    initMenuFilters();
    initTimeSelector();
    initReservationForm();
    setMinDate();
    initParallax();
    initMenuItemEffects();
});

// ========================================
// MOBILE MENU AUTO CLOSE
// ========================================
const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
const navbarCollapse = document.querySelector('.navbar-collapse');

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
            const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                toggle: false
            });
            bsCollapse.hide();
        }
    });
});

// ========================================
// EASTER EGG - Console Message
// ========================================
console.log('%c🍷 Sabor & Brasa', 'font-size: 24px; color: #D4AF37; font-weight: bold;');
console.log('%cExperiencia Gourmet by Jean Avalos', 'font-size: 14px; color: #666;');
console.log('%c¿Te gusta el código? Contáctanos al +51 912 453 016 para crear tu sitio web.', 'font-size: 12px; color: #999;');