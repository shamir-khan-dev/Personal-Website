document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Theme Switcher (Dark / Light Theme)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Retrieve saved theme preference, or fallback to system configuration
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        body.classList.add('light-theme');
        body.classList.remove('dark-theme');
    } else {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    // ==========================================================================
    // Mobile Navigation Drawer Toggle
    // ==========================================================================
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuToggle && navLinksContainer) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = navLinksContainer.classList.toggle('mobile-open');
            mobileMenuToggle.classList.toggle('open');
            
            // Toggle body scroll locking when mobile menu is active
            if (isOpen) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });

        // Close drawer when any nav link is selected
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('mobile-open');
                mobileMenuToggle.classList.remove('open');
                body.style.overflow = '';
            });
        });
    }

    // ==========================================================================
    // Header Scroll State
    // ==========================================================================
    const header = document.getElementById('header');
    const handleScrollHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScrollHeader);
    handleScrollHeader(); // Run on init in case user loaded partially scrolled

    // ==========================================================================
    // Intersection Observer for Content Scroll Reveals
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Stop observing once revealed to avoid re-triggering animations
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is centered
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // Active Link Tracking (Scroll Spy)
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href').replace('#', '');
                    if (href === id) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.25, // Active when at least 25% of section is visible
        rootMargin: '-80px 0px -25% 0px' // Adjust for sticky header height
    });

    sections.forEach(section => {
        spyObserver.observe(section);
    });

    // ==========================================================================
    // Project Category Filtering
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state class on filter buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const cardCategories = card.getAttribute('data-categories').split(' ');

                if (filterValue === 'all' || cardCategories.includes(filterValue)) {
                    card.classList.remove('hide');
                    // Small delay to trigger fade animation smoothly
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    // Match CSS transition length before hiding from layout
                    setTimeout(() => {
                        card.classList.add('hide');
                    }, 400);
                }
            });
        });
    });

    // ==========================================================================
    // Contact Form Interception & Mock Validation/Submit
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = contactForm.querySelector('.btn-submit');
    const submitBtnSpan = submitBtn.querySelector('span');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simple validation check
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showStatus('Please fill in all fields.', 'error');
                return;
            }

            // Disable submit button and show loading state
            submitBtn.disabled = true;
            submitBtnSpan.textContent = 'Sending...';
            formStatus.className = 'form-status-msg';
            formStatus.textContent = '';

            // Dispatch form data via FormSubmit AJAX API to forward to user's email
            fetch("https://formsubmit.co/ajax/shamirk2121@gmail.com", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            })
            .then(response => {
                if (response.ok) return response.json();
                throw new Error("FormSubmit response was not ok");
            })
            .then(data => {
                showStatus('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
            })
            .catch(error => {
                showStatus('Oops! Something went wrong. Please try again.', 'error');
                console.error("Error submitting form:", error);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtnSpan.textContent = 'Send Message';
            });
        });
    }

    const showStatus = (message, type) => {
        formStatus.textContent = message;
        formStatus.className = `form-status-msg ${type}`;
    };

    // ==========================================================================
    // Dynamic Footer Year
    // ==========================================================================
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});
