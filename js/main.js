/* Main JS - Farseen V2 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.registerPlugin(ScrollTrigger);

    // 2. Custom Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');

    // Check if device has mouse
    if (window.matchMedia("(pointer: fine)").matches) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot follows instantly
            gsap.to(cursorDot, {
                x: mouseX,
                y: mouseY,
                duration: 0,
                ease: 'none'
            });
        });

        // Circle follows with delay/lerp
        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.15;
            cursorY += (mouseY - cursorY) * 0.15;

            gsap.set(cursorCircle, {
                x: cursorX,
                y: cursorY
            });

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover Text Interactions
        const hoverEls = document.querySelectorAll('a, button, .menu-btn, .cat-header, .work-item');
        hoverEls.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // 3. Hero Animations & Text Lighting

    // Split text into spans
    const heroTitle = document.querySelector('.hero-title');
    // Preserve lines structure
    const lines = heroTitle.querySelectorAll('.line span');

    lines.forEach(lineSpan => {
        const text = lineSpan.textContent;
        lineSpan.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.classList.add('char');
            span.textContent = char;
            lineSpan.appendChild(span);
        });
    });

    const chars = document.querySelectorAll('.hero-title .char');

    // Loader & Initial Reveal
    function startLoader() {
        let count = 0;
        const counter = document.querySelector('.counter');
        const preloader = document.querySelector('.preloader');

        const interval = setInterval(() => {
            count += Math.floor(Math.random() * 5) + 1;
            if (count > 100) count = 100;

            counter.textContent = count + '%';

            if (count === 100) {
                clearInterval(interval);

                // Hide Loader
                gsap.to(preloader, {
                    y: '-100%',
                    duration: 1.5,
                    ease: 'power4.inOut',
                    onComplete: revealSite
                });
            }
        }, 30); // Speed
    }

    startLoader();

    function revealSite() {
        const tl = gsap.timeline();

        // Reveal Text
        tl.to('.line span', {
            y: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: 'power4.out'
        })
            // Reveal Nav & Footer
            .from('.navbar, .hero-footer, .cursor-dot', {
                opacity: 0,
                y: -20,
                duration: 1,
                ease: 'power3.out'
            }, '-=1')
            // Reveal Hero Image
            .to('.hero-col-img', {
                opacity: 1,
                duration: 1.5,
                ease: 'power2.out'
            }, '-=1.2');
    }

    // Lighting Interaction
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            chars.forEach(char => {
                const rect = char.getBoundingClientRect();
                const charX = rect.left + rect.width / 2;
                const charY = rect.top + rect.height / 2;

                const dist = Math.sqrt(Math.pow(mouseX - charX, 2) + Math.pow(mouseY - charY, 2));

                // Max distance for effect
                const maxDist = 400;

                if (dist < maxDist) {
                    // Map distance 0->maxDist to opacity 1->0.15
                    const intensity = 1 - (dist / maxDist);
                    const opacity = 0.15 + (0.85 * intensity); // Base 0.15 + boost
                    char.style.opacity = opacity;
                } else {
                    char.style.opacity = 0.15;
                }
            });
        });
    }

    // 4. Text Reveals on Scroll
    // 4. General Reveal on Scroll
    const revealElements = document.querySelectorAll('.reveal-text, .about-col'); // Add plain generic reveals here if any

    revealElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            y: 50,
            opacity: 0,
            duration: 1.0,
            ease: 'power3.out'
        });
    });

    // 4.1 Stats Animation (Staggered)
    const stats = document.querySelectorAll('.stat-item');
    if (stats.length > 0) {
        gsap.from(stats, {
            scrollTrigger: {
                trigger: '.stats-grid',
                start: 'top 85%',
                toggleActions: 'play none none reverse' // Ensure it plays when visible
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2, // Sequence them
            ease: 'power3.out'
        });
    }

    // 5. Capabilities: Thread Art Animation
    const capSection = document.querySelector('#expertise');

    // Abstract "Thread" Paths for 100x100 ViewBox
    // More detailed, realistic icons: Camera, Monitor, Pencil, Grid, Cube
    const capabilitiesData = [
        {
            title: "Content Creation",
            desc: "Crafting visual narratives through lens and light. We capture the essence of your brand with high-fidelity production.",
            tools: ["Photography", "Videography", "Cinematography", "Art Direction"],
            // Detailed Camera: Body, Lens, Flash, Shutter
            path: "M15,30 Q15,25 20,25 H80 Q85,25 85,30 V75 Q85,80 80,80 H20 Q15,80 15,75 Z M15,35 H85 M50,40 A15,15 0 1,0 50,70 A15,15 0 1,0 50,40 M50,48 A7,7 0 1,0 50,62 A7,7 0 1,0 50,48 M65,18 H80 V25 H65 Z M25,25 V20 H35 V25"
        },
        {
            title: "Video Editing",
            desc: "Weaving motion into emotion. High-end post-production that turns raw footage into compelling stories.",
            tools: ["Davinci Resolve", "Premiere Pro", "Final Cut Pro", "After Effects"],
            // Monitor with Play Button and Stand
            path: "M10,15 H90 V60 H10 Z M15,20 H85 V55 H15 Z M50,60 V75 M30,75 H70 M45,30 L60,37.5 L45,45 Z"
        },
        {
            title: "Design Graphics",
            desc: "Bold visual identities that leave a lasting mark. From logos to layouts, we design for impact.",
            tools: ["Photoshop", "Illustrator", "Corel Draw", "Indesign"],
            // Detailed Pen Tool / Pencil
            path: "M30,85 L20,100 L45,90 M30,85 L70,25 M45,90 L85,40 M70,25 L85,40 L90,30 L75,15 L70,25 M36,77 L51,82"
        },
        {
            title: "UI/UX & Web",
            desc: "Designing digital environments where form meets function. User-centric interfaces that convert.",
            tools: ["Figma", "Adobe XD", "HTML/CSS", "Web Design"],
            // Browser Window with Header and Grid Layout
            path: "M10,15 Q10,10 15,10 H85 Q90,10 90,15 V85 Q90,90 85,90 H15 Q10,90 10,85 Z M10,25 H90 M20,18 H22 M26,18 H28 M32,18 H34 M20,35 H50 V60 H20 Z M55,35 H80 V45 H55 Z M55,50 H80 V60 H55 Z M20,65 H80"
        },
        {
            title: "3D Design",
            desc: "Building immersive worlds and objects. Adding depth and dimension to your visual assets.",
            tools: ["Blender", "Lumion", "3D Modeling", "Rendering"],
            // Clear Isometric Cube
            path: "M50,10 L85,30 L85,70 L50,90 L15,70 L15,30 Z M15,30 L50,50 L85,30 M50,50 V90"
        }
    ];

    if (capSection) {
        capSection.innerHTML = '';

        // 1. Build Layout Structure
        const wrapper = document.createElement('div');
        wrapper.classList.add('thread-wrapper');

        // Add Sticky Section Header
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('expertise-header');
        headerDiv.innerHTML = '<span class="section-label">03 — Expertise</span>';

        // IMPORTANT: We append header to the LEFT column typically, 
        // BUT to make it sticky relative to the wrapper, we might need it inside the wrapper 
        // OR as the first item in the content column with position sticky.
        // Let's put it in the content column but ensure CSS handles the sticky part.

        // Left Col: Text Items
        const contentCol = document.createElement('div');
        contentCol.classList.add('thread-content-col');

        // Append Header to Content Col (it will be sticky within this col via CSS)
        contentCol.appendChild(headerDiv);

        capabilitiesData.forEach((cap, index) => {
            const item = document.createElement('div');
            item.classList.add('thread-item');
            item.dataset.index = index;

            // Generate Tools HTML
            const toolsHtml = cap.tools.map(tool => `<span class="tool-pill">${tool}</span>`).join('');

            item.innerHTML = `
                <h2 class="cap-title">${cap.title}</h2>
                <p class="cap-desc">${cap.desc}</p>
                <div class="cap-tools">${toolsHtml}</div>
            `;
            contentCol.appendChild(item);
        });

        // Right Col: Sticky SVG
        const stickyCol = document.createElement('div');
        stickyCol.classList.add('thread-sticky-col');

        // SVG Container
        const svgContainer = document.createElement('div');
        svgContainer.classList.add('thread-svg-container');

        // Render all paths (hidden)
        let pathsHtml = '';
        capabilitiesData.forEach((cap, index) => {
            pathsHtml += `<path id="thread-path-${index}" class="thread-path" d="${cap.path}" />`;
        });

        svgContainer.innerHTML = `
            <svg class="thread-svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                ${pathsHtml}
            </svg>
        `;

        stickyCol.appendChild(svgContainer);

        // Append cols to wrapper
        wrapper.appendChild(contentCol);
        wrapper.appendChild(stickyCol);
        capSection.appendChild(wrapper);

        // 2. Setup Animation
        const pathElements = document.querySelectorAll('.thread-path');
        let activePathIndex = -1;

        // Initialize paths: Calculate length and set to "undrawn" state
        pathElements.forEach(path => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.opacity = 1; // Keep opacity 1, we control visibility via draw
            // We can set opacity 0 initially if we want, but strokeDashoffset hides it effectively
        });

        const textItems = document.querySelectorAll('.thread-item');

        // Helper to handle class toggling
        function setActiveItem(index) {
            textItems.forEach((el, i) => {
                if (i === index) el.classList.add('active');
                else el.classList.remove('active');
            });
            switchShape(index);
        }

        textItems.forEach((item, index) => {
            ScrollTrigger.create({
                trigger: item,
                start: "top center",
                end: "bottom center",
                onEnter: () => setActiveItem(index),
                onEnterBack: () => setActiveItem(index),
            });
        });

        function switchShape(newIndex) {
            if (activePathIndex === newIndex) return;

            // 1. Undraw Old Shape
            if (activePathIndex >= 0) {
                const oldPath = pathElements[activePathIndex];
                const oldLen = oldPath.getTotalLength();

                // Reverse draw: 0 -> length
                gsap.to(oldPath, {
                    strokeDashoffset: oldLen,
                    duration: 0.5,
                    ease: "power2.in",
                    overwrite: true
                });
            }

            // 2. Draw New Shape
            const newPath = pathElements[newIndex];

            // Ensure we start from undrawn state (length)
            // But we don't want to snap if it's already drawing?
            // Safer to just set it if it's not currently animating
            // newPath.style.strokeDashoffset = newPath.getTotalLength();

            gsap.to(newPath, {
                strokeDashoffset: 0,
                duration: 1.2,
                ease: "power2.out",
                delay: 0.2, // Wait for undraw slightly
                overwrite: true
            });

            activePathIndex = newIndex;
        }
    }

    // 6. Works Gallery (Fisheye Effect)
    const worksGrid = document.getElementById('worksGrid');
    if (worksGrid) {
        // Image Assets to Duplicate
        const assetPath = 'assets/WORKS/';
        const workImages = [
            'Metal-Box-Mockup-Dark.jpg',
            'Free PSD Craft Paper Gift Box Mockup.jpg',
            'Rounded-Business-Card-Mockup.jpg',
            'qr-code-restaurant-menu2.jpg',
            'PaperBag_180x220x80_Mockup_1.jpg',
            'P8EEP31.jpg' // Reuse accessible images
        ];

        // Generate Grid Items (e.g., 48 items for a dense wall)
        // Repeat the array multiple times
        const totalItems = 48;
        let imgIndex = 0;

        for (let i = 0; i < totalItems; i++) {
            const item = document.createElement('div');
            item.classList.add('works-grid-item');

            const img = document.createElement('img');
            // Ensure we use valid images, cycling through
            img.src = assetPath + workImages[imgIndex % workImages.length];
            img.alt = 'Work Preview';

            item.appendChild(img);
            worksGrid.appendChild(item);
            imgIndex++;
        }

        // Fisheye Logic
        worksGrid.addEventListener('mousemove', (e) => {
            const items = document.querySelectorAll('.works-grid-item');

            items.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                const itemCenterX = itemRect.left + itemRect.width / 2;
                const itemcenterY = itemRect.top + itemRect.height / 2;

                const dist = Math.sqrt(
                    Math.pow(e.clientX - itemCenterX, 2) +
                    Math.pow(e.clientY - itemcenterY, 2)
                );

                // Effect Logic
                const maxDist = 300; // Radius of effect
                if (dist < maxDist) {
                    const scaleEffect = 1 + (0.5 * (1 - (dist / maxDist))); // Scale up to 1.5x
                    item.style.transform = `scale(${scaleEffect})`;
                    item.style.zIndex = 10; // Bring to front
                    item.style.filter = 'brightness(1) grayscale(0%)'; // Highlight
                } else {
                    item.style.transform = 'scale(1)';
                    item.style.zIndex = 1;
                    item.style.filter = 'brightness(0.6) grayscale(20%)'; // Dim
                }
            });
        });

        // Reset on leave
        worksGrid.addEventListener('mouseleave', () => {
            const items = document.querySelectorAll('.works-grid-item');
            items.forEach(item => {
                item.style.transform = 'scale(1)';
                item.style.zIndex = 1;
                item.style.filter = 'brightness(0.6) grayscale(20%)';
            });
        });

        // Button Reveal Animation at bottom
        gsap.from('.view-gallery-btn', {
            scrollTrigger: {
                trigger: '#works',
                start: "top center",
                end: "bottom bottom",
                toggleActions: "play reverse play reverse"
            },
            y: 100, // Up/Down reveal for sticky
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });

        // --- Page Transition Logic (Exit) ---
        const viewBtn = document.querySelector('.view-gallery-btn');
        if (viewBtn) {
            // Create overlay dynamically if not exists
            let overlay = document.querySelector('.page-transition-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'page-transition-overlay';
                document.body.appendChild(overlay);
            }

            viewBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetUrl = 'gallery.html'; // Hardcoded for this flow

                // Animate Overlay IN from LEFT
                gsap.to(overlay, {
                    x: '0%',
                    duration: 0.8,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        window.location.href = targetUrl;
                    }
                });
            });
        }
    }

    // 7. Clock
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        document.getElementById('timeDisplay').textContent = timeString + ' IST';
    }
    setInterval(updateTime, 1000);
    updateTime();

    // 8. Mobile Menu
    const menuBtn = document.querySelector('.menu-btn');
    const closeBtn = document.querySelector('.menu-close');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = document.querySelectorAll('.menu-link');

    menuBtn.addEventListener('click', () => menuOverlay.classList.add('active'));
    closeBtn.addEventListener('click', () => menuOverlay.classList.remove('active'));

    menuLinks.forEach(link => {
        link.addEventListener('click', () => menuOverlay.classList.remove('active'));
    });

    // 9. Showcase Dynamic Text & BG (Cursor Follow & Bounce Entrance)
    const showcaseSection = document.querySelector('.showcase-section');
    const showcaseItems = [
        'Create Content', 'Edit Videos', 'Design Graphics',
        'Do UI/UX', 'Develop Website', 'Design 3D Elements'
    ];

    // Fixed Style: #f05225, Playfair Italic (handled in CSS)

    const dynamicText = document.querySelector('.dynamic-text');
    const bgImages = document.querySelectorAll('.showcase-img');

    if (showcaseSection && dynamicText && bgImages.length > 0) {

        // --- 1. Bounce/Overlap Entrance (DISABLED FOR DEBUGGING) ---
        // Ensure the section overlaps the previous one slightly
        gsap.set(showcaseSection, {
            zIndex: 5,
            position: "relative"
        });

        // --- 1. 3D Scroll Entrance ---
        gsap.set(showcaseSection, {
            zIndex: 5,
            position: "relative",
            perspective: 1000 // Add perspective for 3D effect
        });

        gsap.from(showcaseSection, {
            scrollTrigger: {
                trigger: showcaseSection,
                start: "top bottom",
                end: "center center",
                scrub: 1, // Smooth scrub effect linked to scroll
            },
            y: 200,
            rotateX: 45, // Cool 3D tilt
            scale: 0.8,
            autoAlpha: 0,
            duration: 1.5,
            ease: "power3.out"
        });

        // --- 2. Image Trail Logic ---
        let zIndex = 1;
        let lastX = 0;
        let lastY = 0;
        let imgIndex = 0;

        // Hide all initially
        gsap.set(bgImages, { opacity: 0, scale: 0.8 });

        showcaseSection.addEventListener('mousemove', (e) => {
            const rect = showcaseSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Distance check
            const dist = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));

            // Drop image every 150px (increased gap for cleaner look)
            if (dist > 150) {
                const img = bgImages[imgIndex % bgImages.length];

                // Random Rotation (-20 to 20 deg)
                const rotation = Math.random() * 40 - 20;

                // Place Image
                gsap.set(img, {
                    x: x,
                    y: y,
                    xPercent: -50,
                    yPercent: -50,
                    rotation: rotation / 2, // Start with slight rotation
                    zIndex: zIndex++
                });

                // Animate In: Pop + slight rotate
                gsap.fromTo(img,
                    { opacity: 0, scale: 0.5, rotation: rotation - 10 },
                    {
                        opacity: 1,
                        scale: 1,
                        rotation: rotation,
                        duration: 0.6,
                        ease: "back.out(1.5)"
                    }
                );

                // Animate Out: Drift + Fade
                // Reusing separate GSAP tween to not overwrite placement
                gsap.to(img, {
                    y: `+=${Math.random() * 50 + 20}`, // Drift down slightly
                    opacity: 0,
                    delay: 0.6, // Stay visible briefly
                    duration: 1.0,
                    ease: "power2.out"
                });

                lastX = x;
                lastY = y;
                imgIndex++;
            }
        });

        // --- 3. Content Cycling (Text Only) ---
        let textIndex = 0;
        dynamicText.textContent = showcaseItems[0];

        setInterval(() => {
            textIndex = (textIndex + 1) % showcaseItems.length;

            // Fade text out/in
            gsap.to(dynamicText, {
                opacity: 0,
                duration: 0.2,
                onComplete: () => {
                    dynamicText.textContent = showcaseItems[textIndex];
                    gsap.to(dynamicText, { opacity: 1, duration: 0.2 });
                }
            });

        }, 2000);
    }
});
