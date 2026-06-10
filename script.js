/**
 * SPORT GYM - MOTOR DE INTERACTIVIDAD Y ANIMACIONES (JAVASCRIPT)
 * Controla: Preloader, Menú móvil, Navegación scroll, Intersection Observer y Formulario.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. CONTROL DEL PRELOADER
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
            }, 600); // Pequeña holgura para una entrada súper fluida
        });
    }

    // 2. CABECERA DINÁMICA (SCROLL EFFECT)
    const header = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 3. MENÚ DE NAVEGACIÓN MÓVIL (HAMBURGUER)
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.contains('open');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Cerrar menú al hacer clic en un enlace de navegación
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
    }

    function openMobileMenu() {
        mobileMenuBtn.classList.add('open');
        navMenu.classList.add('open');
        document.body.style.overflow = 'hidden'; // Previene scroll del fondo
    }

    function closeMobileMenu() {
        mobileMenuBtn.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = 'auto'; // Restaura scroll
    }

    // 4. ANIMACIONES DE ENTRADA AL HACER SCROLL (INTERSECTION OBSERVER)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    if ('IntersectionObserver' in window) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Una vez revelado, dejamos de observarlo para optimizar rendimiento
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null, // viewport
            threshold: 0.15, // Se activa cuando el 15% del elemento es visible
            rootMargin: '0px 0px -50px 0px' // Margen inferior para disparar ligeramente antes
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback para navegadores antiguos que no soportan IntersectionObserver
        revealElements.forEach(element => {
            element.classList.add('revealed');
        });
    }

    // 5. ENLACES ACTIVOS EN EL NAV MENÚ AL HACER SCROLL
    const sections = document.querySelectorAll('section[id]');

    // Solo activar la lógica si existen secciones en la página (evita errores en páginas separadas)
    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            let scrollY = window.pageYOffset;

            sections.forEach(current => {
                const sectionHeight = current.offsetHeight;
                const sectionTop = current.offsetTop - 120; // Compensación del Header
                const sectionId = current.getAttribute('id');

                const navLink = document.querySelector('.nav-menu a[href*=' + sectionId + ']');
                if (!navLink) return;

                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLink.classList.add('active');
                } else {
                    navLink.classList.remove('active');
                }
            });
        });
    }

    // 6. VALIDACIÓN Y ENVÍO DEL FORMULARIO DE CONTACTO
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Ocultar mensajes previos de estado
            formSuccess.classList.add('hidden');
            formError.classList.add('hidden');

            // Feedback visual: mostrar spinner y deshabilitar botón
            const btnText = submitBtn.querySelector('.btn-text');
            const loaderIcon = submitBtn.querySelector('.loader-icon');
            
            btnText.classList.add('hidden');
            loaderIcon.classList.remove('hidden');
            submitBtn.setAttribute('disabled', 'true');

            // Obtener valores del formulario
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const interest = document.getElementById('interest').value;
            const message = document.getElementById('message').value.trim();

            // Simulación de envío AJAX
            setTimeout(() => {
                // Validación básica de campos vacíos
                if (name === '' || email === '' || phone === '' || interest === '' || message === '') {
                    // Restaurar botón
                    btnText.classList.remove('hidden');
                    loaderIcon.classList.add('hidden');
                    submitBtn.removeAttribute('disabled');
                    
                    formError.textContent = 'Por favor, rellena todos los campos requeridos.';
                    formError.classList.remove('hidden');
                    return;
                }

                // Éxito en la simulación
                btnText.classList.remove('hidden');
                loaderIcon.classList.add('hidden');
                submitBtn.removeAttribute('disabled');
                
                formSuccess.classList.remove('hidden');
                contactForm.reset();

                // Prefil y redirección opcional a WhatsApp con los datos completados
                // Esto eleva increíblemente la UX al permitir que la interesada termine de cerrar el trato por WhatsApp
                let waMessageText = `¡Hola Sport Gym! Mi nombre es *${name}*.\n`;
                waMessageText += `📧 Correo: ${email}\n`;
                waMessageText += `📱 Teléfono: ${phone}\n`;
                
                let selectedPlanText = '';
                if (interest === 'dia') selectedPlanText = 'Plan por Día ($50)';
                else if (interest === 'semanal') selectedPlanText = 'Plan Semanal ($150)';
                else if (interest === 'mensual') selectedPlanText = 'Plan Mensual ($400)';
                else selectedPlanText = 'Consulta General';
                
                waMessageText += `💪 Interés: *${selectedPlanText}*\n`;
                waMessageText += `💬 Mensaje: ${message}`;

                const encodedWaMessage = encodeURIComponent(waMessageText);
                const waRedirectUrl = `https://wa.me/523881018275?text=${encodedWaMessage}`;

                // Redirigir suavemente después de 1.5 segundos para que vean el mensaje de éxito en la web
                setTimeout(() => {
                    window.open(waRedirectUrl, '_blank');
                }, 1500);

            }, 1800); // 1.8 segundos de simulación de servidor para dar sensación de procesamiento real
        });
    }

    // 7. BOTÓN "CONOCER MÁS" - navegar a la página separada
    const btnConocerMas = document.getElementById('btn-conocer-mas');
    if (btnConocerMas) {
        btnConocerMas.addEventListener('click', (e) => {
            e.preventDefault();
            // En la versión multipágina, redirigimos a la página de nosotras
            window.location.href = 'nosotras.html';
        });
    }
});
