/**
 * Husby Anlegg AS - Main JavaScript
 * Handles navigation, form submission, and interactions
 */

(function() {
    'use strict';

    // DOM Elements
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    /**
     * Mobile Navigation Toggle
     */
    function initMobileNav() {
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');

            // Update aria-expanded
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking on a link
        navMenu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    /**
     * Smooth Scroll for anchor links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');

                // Skip if it's just "#"
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();

                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Header scroll effect
     */
    function initHeaderScroll() {
        if (!header) return;

        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    }

    /**
     * Contact Form Handling
     */
    function initContactForm() {
        if (!contactForm) return;

        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            // Disable button and show loading state
            submitButton.disabled = true;
            submitButton.textContent = 'Sender...';

            // Collect form data
            const formData = {
                name: contactForm.name.value.trim(),
                email: contactForm.email.value.trim(),
                phone: contactForm.phone.value.trim(),
                address: contactForm.address ? contactForm.address.value.trim() : '',
                workType: contactForm.workType ? contactForm.workType.value : '',
                description: contactForm.description.value.trim(),
                wantSiteVisit: contactForm.siteVisit ? contactForm.siteVisit.checked : false,
                timestamp: new Date().toISOString()
            };

            // Validate required fields
            if (!formData.name || !formData.email || !formData.phone || !formData.description) {
                showFormMessage('Vennligst fyll ut alle påkrevde felt.', 'error');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                return;
            }

            // Validate email format
            if (!isValidEmail(formData.email)) {
                showFormMessage('Vennligst oppgi en gyldig e-postadresse.', 'error');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
                return;
            }

            try {
                // For now, we'll simulate a successful submission
                // In production, replace this with actual API call to Resend or similar

                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Log form data (for development)
                console.log('Form submitted:', formData);

                // Show success message
                showFormMessage(
                    'Takk for din henvendelse! Vi har mottatt meldingen din og tar kontakt så snart som mulig, vanligvis innen én arbeidsdag.',
                    'success'
                );

                // Reset form
                contactForm.reset();

                // Scroll to message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            } catch (error) {
                console.error('Form submission error:', error);
                showFormMessage(
                    'Beklager, noe gikk galt. Vennligst prøv igjen eller kontakt oss direkte på telefon.',
                    'error'
                );
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

    /**
     * Show form message
     */
    function showFormMessage(message, type) {
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.className = 'form-message ' + type;
        formMessage.style.display = 'block';

        // Hide message after 10 seconds for success
        if (type === 'success') {
            setTimeout(function() {
                formMessage.style.display = 'none';
            }, 10000);
        }
    }

    /**
     * Validate email format
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Add animation on scroll for elements
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.service-card, .why-us-item, .value-card, .project-card');

        if (!animatedElements.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(function(element) {
            element.classList.add('animate-on-scroll');
            observer.observe(element);
        });
    }

    /**
     * Handle service detail anchor links from other pages
     */
    function handleServiceAnchors() {
        // Check if there's a hash in the URL
        if (window.location.hash) {
            const target = document.querySelector(window.location.hash);
            if (target) {
                // Wait for page load, then scroll
                setTimeout(function() {
                    const headerHeight = header ? header.offsetHeight : 0;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }

    /**
     * Lazy load images
     */
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');

        if (!lazyImages.length) return;

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(function(img) {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(function(img) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            });
        }
    }

    /**
     * Phone number click tracking (for analytics)
     */
    function initPhoneTracking() {
        document.querySelectorAll('a[href^="tel:"]').forEach(function(link) {
            link.addEventListener('click', function() {
                // Track phone click event (integrate with analytics if needed)
                console.log('Phone link clicked:', this.href);
            });
        });
    }

    /**
     * Initialize all functions when DOM is ready
     */
    function init() {
        initMobileNav();
        initSmoothScroll();
        initHeaderScroll();
        initContactForm();
        initScrollAnimations();
        handleServiceAnchors();
        initLazyLoading();
        initPhoneTracking();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
