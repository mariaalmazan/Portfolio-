/* ─────────────────────────────────────────────────────────────────────────
   PORTFOLIO — main.js
   Cursor personalizado · Scroll reveal · Nav scroll state
   ───────────────────────────────────────────────────────────────────────── */

(function () {
    'use strict';

    /* ── Helpers ──────────────────────────────────────────────────────────── */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

    /* ── Custom Cursor ────────────────────────────────────────────────────── */
    const cursor         = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');

    if (cursor && cursorFollower && !isTouchDevice() && !prefersReducedMotion) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        let rafId;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top  = mouseY + 'px';
        });

        // El follower se mueve con un pequeño retraso suave
        function animateFollower() {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;
            cursorFollower.style.left = followerX + 'px';
            cursorFollower.style.top  = followerY + 'px';
            rafId = requestAnimationFrame(animateFollower);
        }
        animateFollower();

        // Hover state en elementos interactivos
        const interactiveEls = document.querySelectorAll('a, button, [role="button"]');
        interactiveEls.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor--hover');
                cursorFollower.classList.add('cursor--hover');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor--hover');
                cursorFollower.classList.remove('cursor--hover');
            });
        });

        // Ocultar cursor al salir de la ventana
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorFollower.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
            cursorFollower.style.opacity = '1';
        });
    } else {
        // En móvil/touch: ocultar los elementos de cursor
        if (cursor)         cursor.style.display = 'none';
        if (cursorFollower) cursorFollower.style.display = 'none';
    }

    /* ── Nav: añadir clase al hacer scroll ────────────────────────────────── */
    const nav = document.getElementById('nav') || document.querySelector('.nav, .project-nav');

    if (nav) {
        const onScroll = () => {
            nav.classList.toggle('scrolled', window.scrollY > 40);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll(); // estado inicial
    }

    /* ── Scroll Reveal ────────────────────────────────────────────────────── */
    if (!prefersReducedMotion) {
        const revealEls = document.querySelectorAll('[data-reveal]');

        if (revealEls.length > 0) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target); // sólo una vez
                        }
                    });
                },
                {
                    threshold: 0.08,
                    rootMargin: '0px 0px -40px 0px',
                }
            );

            revealEls.forEach(el => observer.observe(el));
        }
    } else {
        // Si prefiere movimiento reducido, mostrar todo directamente
        document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('visible'));
    }

    /* ── Smooth scroll para enlaces de anclaje ────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

})();
