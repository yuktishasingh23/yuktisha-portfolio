/* PORTFOLIO INTERACTIONS */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* TYPING ANIMATION */
const typingText = document.getElementById("typing-text");

if (typingText) {
    const phrases = [
        "Aspiring Software Developer",
        "Computer Science Student",
        "Web Development Enthusiast"
    ];

    let phraseIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;

    if (prefersReducedMotion) {
        typingText.textContent = phrases[0];
    } else {
        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];
            characterIndex += isDeleting ? -1 : 1;
            typingText.textContent = currentPhrase.substring(0, characterIndex);

            let delay = isDeleting ? 50 : 100;

            if (!isDeleting && characterIndex === currentPhrase.length) {
                isDeleting = true;
                delay = 1500;
            } else if (isDeleting && characterIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 400;
            }

            window.setTimeout(typeEffect, delay);
        }

        typeEffect();
    }
}

/* MAGNETIC BUTTONS */
if (!prefersReducedMotion && supportsFinePointer) {
    document.querySelectorAll(".magnetic-btn").forEach(button => {
        button.addEventListener("mousemove", event => {
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        button.addEventListener("mouseleave", () => {
            button.style.transform = "translate(0, 0)";
        });
    });
}

/* 3D PROJECT CARD TILT AND SPOTLIGHT */
if (!prefersReducedMotion && supportsFinePointer) {
    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("mousemove", event => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            if (centerX && centerY) {
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            }

            card.style.setProperty("--mouse-x", `${x}px`);
            card.style.setProperty("--mouse-y", `${y}px`);
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
        });
    });
}

/* SCROLL REVEAL AND STAGGERED CARD REVEAL */
if ("IntersectionObserver" in window) {
    const revealElements = document.querySelectorAll(".reveal");

    if (prefersReducedMotion) {
        revealElements.forEach(element => element.classList.add("active"));
    } else {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                entry.target.classList.toggle("active", entry.isIntersecting);
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -30px 0px"
        });

        revealElements.forEach(element => revealObserver.observe(element));
    }

    const animatedCards = document.querySelectorAll(".skill-card, .education-card, .project-card");

    if (prefersReducedMotion) {
        animatedCards.forEach(card => card.classList.add("show-card"));
    } else {
        const cardObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                entry.target.classList.toggle("show-card", entry.isIntersecting);
            });
        }, { threshold: 0.15 });

        animatedCards.forEach(card => cardObserver.observe(card));
    }
} else {
    document.querySelectorAll(".reveal").forEach(element => element.classList.add("active"));
    document.querySelectorAll(".skill-card, .education-card, .project-card").forEach(card => card.classList.add("show-card"));
}

/* MOUSE-FOLLOWING PAGE SPOTLIGHT */
if (!prefersReducedMotion && supportsFinePointer) {
    document.addEventListener("mousemove", event => {
        document.body.style.setProperty("--mouse-x", `${event.clientX}px`);
        document.body.style.setProperty("--mouse-y", `${event.clientY}px`);
    });
}

/* ACTIVE NAVIGATION */
if ("IntersectionObserver" in window) {
    const navigationSections = document.querySelectorAll("main section[id]");
    const navigationLinks = document.querySelectorAll("nav a[href^='#']");

    const navigationObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            navigationLinks.forEach(link => {
                link.classList.toggle("active-nav", link.getAttribute("href") === `#${entry.target.id}`);
                link.classList.toggle("active-link", link.getAttribute("href") === `#${entry.target.id}`);
            });
        });
    }, {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0
    });

    navigationSections.forEach(section => navigationObserver.observe(section));
}

/* BACK TO TOP BUTTON */
const backToTopButton = document.getElementById("back-to-top");

if (backToTopButton) {
    function updateBackToTop() {
        backToTopButton.classList.toggle("visible", window.scrollY > 400);
    }

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();

    backToTopButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });
    });
}

/* LOADING SCREEN */
function hidePortfolioLoader() {
    const loader = document.getElementById("portfolio-loader");
    if (loader) loader.classList.add("loader-hidden");
}

if (document.readyState === "complete") {
    hidePortfolioLoader();
} else {
    window.addEventListener("load", hidePortfolioLoader, { once: true });
}

/* ANIMATED STATISTICS */
const statisticCounters = document.querySelectorAll(".counter");

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    statisticCounters.forEach(counter => {
        counter.textContent = counter.dataset.target || "0";
    });
} else {
    const statisticsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = Number(counter.dataset.target);
            const duration = 1500;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                counter.textContent = String(Math.floor(progress * target));
                if (progress < 1) requestAnimationFrame(updateCounter);
            }

            requestAnimationFrame(updateCounter);
            statisticsObserver.unobserve(counter);
        });
    }, { threshold: 0.5 });

    statisticCounters.forEach(counter => statisticsObserver.observe(counter));
}

/* SCROLL PROGRESS BAR */
const scrollProgressBar = document.getElementById("scroll-progress");

function updateScrollProgress() {
    if (!scrollProgressBar) return;

    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    scrollProgressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

/* BUTTON RIPPLE EFFECT */
document.querySelectorAll(".ripple-btn").forEach(button => {
    button.addEventListener("click", event => {
        if (prefersReducedMotion) return;

        const rect = button.getBoundingClientRect();
        const rippleSize = Math.max(rect.width, rect.height) * 2;
        const ripple = document.createElement("span");
        const clickX = event.clientX ? event.clientX - rect.left : rect.width / 2;
        const clickY = event.clientY ? event.clientY - rect.top : rect.height / 2;

        ripple.className = "ripple-circle";
        ripple.style.width = `${rippleSize}px`;
        ripple.style.height = `${rippleSize}px`;
        ripple.style.left = `${clickX - rippleSize / 2}px`;
        ripple.style.top = `${clickY - rippleSize / 2}px`;
        button.appendChild(ripple);

        ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
    });
});
