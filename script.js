document.addEventListener('DOMContentLoaded', () => {
            const themeToggle = document.getElementById('theme-toggle');
            const sunIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>`;
            const moonIcon = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`;
            
            // Check for saved theme preference or use system preference
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
                themeToggle.innerHTML = sunIcon;
            } else {
                document.documentElement.classList.remove('dark');
                themeToggle.innerHTML = moonIcon;
            }

            // Theme toggle functionality
            themeToggle.addEventListener('click', () => {
                if (document.documentElement.classList.contains('dark')) {
                    document.documentElement.classList.remove('dark');
                    localStorage.theme = 'light';
                    themeToggle.innerHTML = moonIcon;
                } else {
                    document.documentElement.classList.add('dark');
                    localStorage.theme = 'dark';
                    themeToggle.innerHTML = sunIcon;
                }
            });

            // Sticky header
            const header = document.getElementById('header');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('sticky-nav');
                } else {
                    header.classList.remove('sticky-nav');
                }
            });
            
            // Mobile menu toggle
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            const menuOpenIcon = document.getElementById('menu-open-icon');
            const menuCloseIcon = document.getElementById('menu-close-icon');
            
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                menuOpenIcon.classList.toggle('hidden');
                menuCloseIcon.classList.toggle('hidden');
            });
            
            // Close mobile menu when a link is clicked
            document.querySelectorAll('.mobile-link').forEach(link => {
                link.addEventListener('click', () => {
                   mobileMenu.classList.add('hidden');
                   menuOpenIcon.classList.remove('hidden');
                   menuCloseIcon.classList.add('hidden');
                });
            });

            // Scroll animations
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1
            });

            document.querySelectorAll('.reveal').forEach(el => {
                observer.observe(el);
            });

            // Testimonial Slider
            const testimonialContainer = document.getElementById('testimonial-container');
            const prevButton = document.getElementById('prev-testimonial');
            const nextButton = document.getElementById('next-testimonial');
            const slides = document.querySelectorAll('.testimonial-slide');
            let currentIndex = 0;

            function updateSlider() {
                testimonialContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
            }

            prevButton.addEventListener('click', () => {
                currentIndex = (currentIndex > 0) ? currentIndex - 1 : slides.length - 1;
                updateSlider();
            });

            nextButton.addEventListener('click', () => {
                currentIndex = (currentIndex < slides.length - 1) ? currentIndex + 1 : 0;
                updateSlider();
            });

            // Contact Form Submission
            const form = document.getElementById('contact-form');
            const formStatus = document.getElementById('form-status');

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const object = {};
                formData.forEach((value, key) => {
                    object[key] = value;
                });
                
                // --- IMPORTANT ---
                // You must replace "YOUR_ACCESS_KEY_HERE" with your actual access key from web3forms.com
                if (object.access_key === '57b0798a-5a39-44cf-852a-610879c2d6ef') {
                    formStatus.innerHTML = `<p class="text-yellow-500 font-semibold">Please add your Access Key in the HTML file to enable form submission.</p>`;
                    return;
                }
                
                const json = JSON.stringify(object);
                formStatus.innerHTML = '<p class="text-sky-500">Sending...</p>';

                try {
                    const response = await fetch('https://api.web3forms.com/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: json
                    });

                    const result = await response.json();
                    
                    if (result.success) {
                        formStatus.innerHTML = '<p class="text-green-500 font-semibold">Message sent successfully!</p>';
                        form.reset();
                    } else {
                        console.error('Submission failed:', result);
                        formStatus.innerHTML = `<p class="text-red-500 font-semibold">${result.message || 'An error occurred.'}</p>`;
                    }
                } catch (error) {
                    console.error('Error submitting form:', error);
                    formStatus.innerHTML = '<p class="text-red-500 font-semibold">An error occurred while sending the message.</p>';
                }
            });
        });