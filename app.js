/* -------------------------------------------------------------
   INTERACTIVE PORTFOLIO ENGINE - ANANTHAPADMANABHAN
   ------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    initScrollReveal();
    initInteractiveStepper();
    initTerminalTyping();
    initCard3DTilt();
    initProjectFilters();
    initSmoothScroll();
    initMobileMenu();
    initScrollspy();
    initBackToTop();
});

/* -------------------------------------------------------------
   1. SCROLL REVEAL SYSTEM (INTERSECTION OBSERVER)
   ------------------------------------------------------------- */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".scroll-reveal");
    
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Stop observing once revealed to maintain layout performance
                observer.unobserve(entry.target);
            }
        });
    };
    
    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // Viewport
        threshold: 0.15, // Trigger when 15% visible
        rootMargin: "0px 0px -50px 0px"
    });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

/* -------------------------------------------------------------
   2. INTERACTIVE STEPPER / METHODOLOGY PROCESS
   ------------------------------------------------------------- */
function initInteractiveStepper() {
    const steps = document.querySelectorAll(".step-item");
    const contents = document.querySelectorAll(".step-content");
    
    steps.forEach(step => {
        step.addEventListener("click", () => {
            const stepNum = step.getAttribute("data-step");
            
            // Remove active classes from all steps
            steps.forEach(s => s.classList.remove("active"));
            // Add active class to clicked step
            step.classList.add("active");
            
            // Deactivate and fade out current contents
            contents.forEach(content => {
                content.classList.remove("active");
            });
            
            // Activate and fade in targeted content
            const targetContent = document.getElementById(`step-content-${stepNum}`);
            if (targetContent) {
                targetContent.classList.add("active");
            }
        });
    });
}

/* -------------------------------------------------------------
   3. ANIMATED TERMINAL TYPING SIMULATION
   ------------------------------------------------------------- */
function initTerminalTyping() {
    const terminalBody = document.querySelector(".terminal-body");
    const codeContainer = document.querySelector(".terminal-code");
    
    if (!terminalBody || !codeContainer) return;
    
    // Hold the original content and clear it
    const originalHTML = codeContainer.innerHTML;
    codeContainer.innerHTML = "";
    
    let isTyped = false;
    
    // Start typing when the terminal section becomes visible
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isTyped) {
                isTyped = true;
                typeCode();
                observer.unobserve(entry.target);
            }
        });
    };
    
    const terminalObserver = new IntersectionObserver(observerCallback, {
        threshold: 0.5
    });
    
    terminalObserver.observe(terminalBody);
    
    function typeCode() {
        let currentHTML = "";
        let charIndex = 0;
        
        const htmlChunks = originalHTML.split(/(<[^>]*>|[^<]+)/g).filter(Boolean);
        
        function printNextChunk() {
            if (charIndex < htmlChunks.length) {
                const chunk = htmlChunks[charIndex];
                
                if (chunk.startsWith("<")) {
                    currentHTML += chunk;
                    charIndex++;
                    printNextChunk(); 
                } else {
                    let textIndex = 0;
                    
                    function printTextChar() {
                        if (textIndex < chunk.length) {
                            currentHTML += chunk[textIndex];
                            codeContainer.innerHTML = currentHTML;
                            textIndex++;
                            setTimeout(printTextChar, 2);
                        } else {
                            charIndex++;
                            setTimeout(printNextChunk, 5);
                        }
                    }
                    printTextChar();
                }
            }
        }
        
        printNextChunk();
    }
}

/* -------------------------------------------------------------
   4. 3D GLASS CARD MAGNETIC PARALLAX TILT
   ------------------------------------------------------------- */
function initCard3DTilt() {
    const cards = document.querySelectorAll(".project-card, .leadership-card");
    
    cards.forEach(card => {
        let rect = null;
        
        card.addEventListener("mouseenter", () => {
            rect = card.getBoundingClientRect();
        });
        
        card.addEventListener("mousemove", (e) => {
            if (!rect) {
                rect = card.getBoundingClientRect();
            }
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = ((y - centerY) / centerY) * 5;
            const tiltY = ((x - centerX) / centerX) * -5;
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
            
            const glow = card.querySelector(".project-card-glow");
            if (glow) {
                glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(228, 63, 90, 0.2) 0%, transparent 65%)`;
            }
        });
        
        card.addEventListener("mouseleave", () => {
            rect = null;
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
            
            const glow = card.querySelector(".project-card-glow");
            if (glow) {
                glow.style.background = "radial-gradient(circle at 100% 0%, rgba(228, 63, 90, 0.15) 0%, transparent 60%)";
            }
        });
    });
}

/* -------------------------------------------------------------
   5. INTERACTIVE MASTER ENGINEERING FILTERING
   ------------------------------------------------------------- */
function initProjectFilters() {
    const tabs = document.querySelectorAll(".filter-tab");
    const cards = document.querySelectorAll(".index-card");
    
    if (tabs.length === 0 || cards.length === 0) return;
    
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active classes
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const filterValue = tab.getAttribute("data-filter");
            
            cards.forEach(card => {
                const category = card.getAttribute("data-category");
                
                if (filterValue === "all" || category === filterValue) {
                    card.classList.remove("hidden");
                    // Micro-interaction trigger to animate insertion beautifully
                    card.style.opacity = "0";
                    setTimeout(() => {
                        card.style.opacity = "1";
                    }, 50);
                } else {
                    card.classList.add("hidden");
                }
            });
        });
    });
}

/* -------------------------------------------------------------
   6. SMOOTH INTER-SECTION SCROLL NAVIGATION
   ------------------------------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 90; // Height of fixed header
                const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
}

/* -------------------------------------------------------------
   7. MOBILE NAVIGATION OVERLAY DRAWER
   ------------------------------------------------------------- */
function initMobileMenu() {
    const toggleBtn = document.querySelector(".mobile-nav-toggle");
    const navMenu = document.querySelector(".nav");
    const navLinks = document.querySelectorAll(".nav-link");

    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
        toggleBtn.setAttribute("aria-expanded", !isExpanded);
        toggleBtn.classList.toggle("active");
        navMenu.classList.toggle("active");
        document.body.classList.toggle("no-scroll");
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
        if (navMenu.classList.contains("active") && !navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
            toggleBtn.setAttribute("aria-expanded", "false");
            toggleBtn.classList.remove("active");
            navMenu.classList.remove("active");
            document.body.classList.remove("no-scroll");
        }
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            toggleBtn.setAttribute("aria-expanded", "false");
            toggleBtn.classList.remove("active");
            navMenu.classList.remove("active");
            document.body.classList.remove("no-scroll");
        });
    });
}

/* -------------------------------------------------------------
   8. ACTIVE SECTION LINK HIGHLIGHTING (SCROLLSPY)
   ------------------------------------------------------------- */
function initScrollspy() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");
    
    if (sections.length === 0 || navLinks.length === 0) return;

    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 120; // Scroll offset matching header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    });
}

/* -------------------------------------------------------------
   9. FLOATING BACK TO TOP TRIGGER
   ------------------------------------------------------------- */
function initBackToTop() {
    const backToTopBtn = document.getElementById("back-to-top");
    if (!backToTopBtn) return;
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    });
    
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
