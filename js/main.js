/* -------------------------------------------

Name:         Wasker
Version:      1.0
Developer:    Nazar Miller (millerDigitalDesign)
Portfolio:    https://themeforest.net/user/millerdigitaldesign/portfolio?ref=MillerDigitalDesign

p.s. I am available for Freelance hire (UI design, web development). email: miller.themes@gmail.com

------------------------------------------- */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";


    /* -------------------------------------------
        Copy Rigth year
    ------------------------------------------- */
    // Get the current year
    const currentYear = new Date().getFullYear();

    // Set the current year to the span with id 'year'
    document.getElementById('year').textContent = currentYear;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    /* -------------------------------------------
        mobile window
    ------------------------------------------- */

    function setHeight() {
        var vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setHeight();
    window.addEventListener('resize', setHeight);

    /* -------------------------------------------
       Preloader
    ------------------------------------------- */
    let preloaderPercent = document.querySelector('.mil-percent');
    let preloaderLine = document.querySelector('.mil-preload-line');
    let preloader = document.querySelector('.mil-preloader');
    let progress = 0;

    function updatePreloader() {
        if (progress <= 100) {
            preloaderPercent.textContent = progress;
            preloaderLine.style.width = progress + "%";
            progress += 5;
        } else {
            clearInterval(preloaderInterval);
            preloader.classList.add('mil-complete');
        }
    }

    let preloaderInterval = setInterval(updatePreloader, 100);


    /* -------------------------------------------
       Page Transition
    ------------------------------------------- */
    const options = {
        containers: ['#swupMain', '#swupMenu'],
        animateHistoryBrowsing: true,
        linkSelector: 'a:not([data-no-swup])',
        plugins: [new SwupBodyClassPlugin()]
    };

    const swup = new Swup(options);

    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function (event) {
            const url = this.href;

            fetch(url)
                .then(response => response.text())
                .then(html => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    const bodyClass = doc.body.className;

                    if (bodyClass.includes('mil-fw-page')) {
                        const rightPart = document.querySelector('.mil-right-part');
                        rightPart.classList.add('mil-go');

                        setTimeout(() => {
                            rightPart.classList.remove('mil-go');
                        }, 400);
                    }
                })
                .catch(error => console.error('Помилка при завантаженні сторінки:', error));
        });
    });

    const clonedBlock = document.querySelector('.mil-cloned');
    const cloneDestination = document.querySelector('.mil-cv-clone-here');
    if (clonedBlock && cloneDestination) {
        const clonedElement = clonedBlock.cloneNode(true);
        cloneDestination.appendChild(clonedElement);

        const bannerBg = clonedElement.querySelector('.mil-banner-bg');
        if (bannerBg) {
            bannerBg.classList.add('mil-fw-banner');
        }
    }

    /* -------------------------------------------
       Menu
    ------------------------------------------- */
    const menuBtn = document.querySelector('.mil-menu-btn');
    const mainMenu = document.querySelector('.mil-main-menu');
    const overlay = document.querySelector('.mil-overlay');
    const menuLinks = document.querySelectorAll('.mil-main-menu a');

    function toggleMenu() {
        menuBtn.classList.toggle('mil-active');
        mainMenu.classList.toggle('mil-active');
        overlay.classList.toggle('mil-active');
    }

    menuBtn.addEventListener('click', toggleMenu);

    overlay.addEventListener('click', () => {
        if (overlay.classList.contains('mil-active')) {
            toggleMenu();
        }
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainMenu.classList.contains('mil-active')) {
                toggleMenu();
            }
        });
    });


    /* -------------------------------------------
       Typing Text
    ------------------------------------------- */
    const textElements = document.querySelectorAll(".mil-typing");
    const strings = ["Dreamer 😊" , "Systems engineering",  "Full Stack Developer"];
    const typeSpeed = 70;
    const backSpeed = 20;
    const backDelay = 1500;

    textElements.forEach(textElement => {
        typeText(textElement, strings);
    });

    function typeText(textElement, strings) {
        let currentStringIndex = 0;
        let currentCharIndex = 0;
        let isDeleting = false;

        function type() {
            const currentString = strings[currentStringIndex];
            const displayedText = currentString.substring(0, isDeleting ? currentCharIndex-- : currentCharIndex++);
            textElement.textContent = displayedText;

            if (!isDeleting && currentCharIndex === currentString.length) {
                setTimeout(() => isDeleting = true, backDelay);
            } else if (isDeleting && currentCharIndex === 0) {
                isDeleting = false;
                currentStringIndex = (currentStringIndex + 1) % strings.length;
            }

            const delay = isDeleting ? backSpeed : typeSpeed;
            setTimeout(type, delay);
        }

        type();
    }

    /* -------------------------------------------
       Progress Bar
    ------------------------------------------- */
    document.querySelectorAll('.mil-progress-prog').forEach(box => {
        const size = box.getAttribute('data-size');
        if (size) box.style.setProperty('--size', size);
    });

    /* -------------------------------------------
       Fancybox
    ------------------------------------------- */
    Fancybox.bind("[data-fancybox='gallery'], [data-fancybox='certificate']", {
        hideScrollbar: false,
        idle: false,
        Carousel: {
            transition: "slide",
        },
    });

    document.querySelectorAll('.mil-zoom').forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault();
            const parentCard = button.closest('.mil-work-card, .mil-pub-img');
            const image = parentCard?.querySelector('a[data-fancybox="gallery"]');
            if (image) image.click();
        });
    });

    Fancybox.defaults.Hash = false;

    /* -------------------------------------------
       Isotope
    ------------------------------------------- */
    const grid = document.querySelector('.mil-grid');
    if (grid) {
        const iso = new Isotope(grid, {
            itemSelector: '.mil-grid-item',
            percentPosition: true,
            transitionDuration: '0.4s',
            masonry: {
                columnWidth: '.mil-grid-sizer',
            }
        });

        const filterLinks = document.querySelectorAll('.mil-filter a');
        filterLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                const filterValue = this.getAttribute('data-filter');
                handleFilterClick(iso, filterValue, e);
            });
        });
    }

    function handleFilterClick(iso, filterValue) {
        gsap.to('.mil-half-1', {
            scrollTop: 0,
            duration: .3,
            ease: 'sine',
            onComplete: () => ScrollTrigger.refresh()
        });

        iso.arrange({
            filter: filterValue
        });

        const filterLinks = document.querySelectorAll('.mil-filter a');
        filterLinks.forEach(link => link.classList.remove('mil-current'));

        event.currentTarget.classList.add('mil-current');
    }

    /* -------------------------------------------
       Sliders
    ------------------------------------------- */
    initSlider('.mil-projects-slider', {
        parallax: true,
        autoHeight: true,
        spaceBetween: 15,
        slidesPerView: 1,
        speed: 800,
        navigation: {
            prevEl: '.mil-project-prev',
            nextEl: '.mil-project-next',
        },
        breakpoints: {
            992: {
                slidesPerView: 2,
            },
        },
    });

    const sliders = document.querySelectorAll('.mil-reviews-slider');
    const paginations = document.querySelectorAll('.mil-reviews-pagination');

    sliders.forEach((slider, index) => {
        const pagination = paginations[index];

        const prevButton = document.querySelectorAll('.mil-review-prev')[index];
        const nextButton = document.querySelectorAll('.mil-review-next')[index];

        initSlider(slider, {
            parallax: true,
            autoHeight: true,
            spaceBetween: 15,
            slidesPerView: 1,
            speed: 800,
            pagination: {
                el: pagination,
                clickable: true,
            },
            navigation: {
                prevEl: prevButton,
                nextEl: nextButton,
            },
        });
    });

    function initSlider(slider, options) {
        if (slider) {
            new Swiper(slider, options);
        }
    }

    /* -------------------------------------------
        Scroll Animation
    ------------------------------------------- */
    const appearance = document.querySelectorAll(".mil-up");
    const scaleImage = document.querySelectorAll(".mil-scale-img");
    const addClassElements = document.querySelectorAll('.mil-add-class');

    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= -90 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left >= 0 &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }


    const filteredAppearance = Array.from(appearance).filter(el => !isInViewport(el));
    const filteredAddClassElements = Array.from(addClassElements).filter(el => !isInViewport(el));

    filteredAppearance.forEach(section => handleScrollAnimation(section, createScrollTrigger));
    filteredAddClassElements.forEach(element => handleClassToggle(element));

    scaleImage.forEach(section => handleScaleAnimation(section));

    function handleScrollAnimation(section, callback) {
        const container = section.closest('.mil-half-1') || section.closest('.mil-half-2');
        callback(section, container);
    }

    function handleScaleAnimation(section) {
        const container = section.closest('.mil-half-1') || section.closest('.mil-half-2');
        const value1 = Math.max(0.95, section.getAttribute("data-value-1"));
        const value2 = section.getAttribute("data-value-2");
        createScaleAnimation(section, value1, value2, container);
    }

    function handleClassToggle(element) {
        const container = element.closest('.mil-half-1') || element.closest('.mil-half-2');
        createClassToggleScrollTrigger(element, container);
    }

    function createScrollTrigger(section, scroller) {
        gsap.fromTo(section, {
            opacity: 0,
            y: 40,
            scale: 0.95,
            pointerEvents: 'none',
        }, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.4,
            onComplete: () => {
                setTimeout(() => {
                    section.style.pointerEvents = 'all';
                }, 100);
            },
            scrollTrigger: {
                trigger: section,
                scroller: scroller,
                toggleActions: 'play none none reverse',
                start: 'top+=90px bottom',
                onEnter: () => section.style.pointerEvents = 'none',
                onLeaveBack: () => section.style.pointerEvents = 'none',
            }
        });
    }

    function createClassToggleScrollTrigger(element, scroller) {
        ScrollTrigger.create({
            trigger: element,
            scroller: scroller,
            toggleActions: 'play none none reverse',
            onEnter: () => addClassToElement(element),
            onLeaveBack: () => removeClassFromElement(element)
        });
    }

    function createScaleAnimation(section, value1, value2, scroller) {
        const startValue = window.innerWidth < 1200 ? 'top-=100 bottom-=100%' : 'top bottom-=100%';

        gsap.fromTo(section, {
            scale: value1,
            y: '0%',
        }, {
            scale: value2,
            y: '10%',
            scrollTrigger: {
                scroller: scroller,
                trigger: section,
                start: startValue,
                scrub: true,
                toggleActions: 'play none none reverse',
            }
        });
    }

    function addClassToElement(element) {
        element.classList.add('mil-active');
    }

    function removeClassFromElement(element) {
        element.classList.remove('mil-active');
    }


    /*----------------------------------------------------------
    ------------------------------------------------------------

    REINIT

    ------------------------------------------------------------
    ----------------------------------------------------------*/
    document.addEventListener("swup:contentReplaced", function () {

        /* -------------------------------------------
           mobile window
        ------------------------------------------- */

        function setHeight() {
            var vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
        setHeight();
        window.addEventListener('resize', setHeight);

        /* -------------------------------------------
           Page Transition
        ------------------------------------------- */

        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function (event) {
                const url = this.href;

                fetch(url)
                    .then(response => response.text())
                    .then(html => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, 'text/html');
                        const bodyClass = doc.body.className;

                        if (bodyClass.includes('mil-fw-page')) {
                            const rightPart = document.querySelector('.mil-right-part');
                            rightPart.classList.add('mil-go');

                            setTimeout(() => {
                                rightPart.classList.remove('mil-go');
                            }, 400);
                        }
                    })
                    .catch(error => console.error('Помилка при завантаженні сторінки:', error));
            });
        });

        const clonedBlock = document.querySelector('.mil-cloned');
        const cloneDestination = document.querySelector('.mil-cv-clone-here');
        if (clonedBlock && cloneDestination) {
            const clonedElement = clonedBlock.cloneNode(true);
            cloneDestination.appendChild(clonedElement);

            const bannerBg = clonedElement.querySelector('.mil-banner-bg');
            if (bannerBg) {
                bannerBg.classList.add('mil-fw-banner');
            }
        }

        /* -------------------------------------------
           Menu
        ------------------------------------------- */
        const menuBtn = document.querySelector('.mil-menu-btn');
        const mainMenu = document.querySelector('.mil-main-menu');
        const overlay = document.querySelector('.mil-overlay');
        const menuLinks = document.querySelectorAll('.mil-main-menu a');

        function toggleMenu() {
            menuBtn.classList.toggle('mil-active');
            mainMenu.classList.toggle('mil-active');
            overlay.classList.toggle('mil-active');
        }

        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainMenu.classList.contains('mil-active')) {
                    toggleMenu();
                }
            });
        });

        /* -------------------------------------------
           Progress Bar
        ------------------------------------------- */
        document.querySelectorAll('.mil-progress-prog').forEach(box => {
            const size = box.getAttribute('data-size');
            if (size) box.style.setProperty('--size', size);
        });

        /* -------------------------------------------
           Fancybox
        ------------------------------------------- */
        Fancybox.bind("[data-fancybox='gallery'], [data-fancybox='certificate']", {
            hideScrollbar: false,
            idle: false,
            Carousel: {
                transition: "slide",
            },
        });

        document.querySelectorAll('.mil-zoom').forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                const parentCard = button.closest('.mil-work-card');
                const image = parentCard?.querySelector('a[data-fancybox="gallery"]');
                if (image) image.click();
            });
        });

        Fancybox.defaults.Hash = false;

        /* -------------------------------------------
           Isotope
        ------------------------------------------- */
        const grid = document.querySelector('.mil-grid');
        if (grid) {
            const iso = new Isotope(grid, {
                itemSelector: '.mil-grid-item',
                percentPosition: true,
                transitionDuration: '0.4s',
                masonry: {
                    columnWidth: '.mil-grid-sizer',
                }
            });

            const filterLinks = document.querySelectorAll('.mil-filter a');
            filterLinks.forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    const filterValue = this.getAttribute('data-filter');
                    handleFilterClick(iso, filterValue, e);
                });
            });
        }

        function handleFilterClick(iso, filterValue) {
            gsap.to('.mil-half-1', {
                scrollTop: 0,
                duration: .3,
                ease: 'sine',
                onComplete: () => ScrollTrigger.refresh()
            });

            iso.arrange({
                filter: filterValue
            });

            const filterLinks = document.querySelectorAll('.mil-filter a');
            filterLinks.forEach(link => link.classList.remove('mil-current'));

            event.currentTarget.classList.add('mil-current');
        }

        /* -------------------------------------------
           Sliders
        ------------------------------------------- */
        initSlider('.mil-projects-slider', {
            parallax: true,
            autoHeight: true,
            spaceBetween: 15,
            slidesPerView: 1,
            speed: 800,
            navigation: {
                prevEl: '.mil-project-prev',
                nextEl: '.mil-project-next',
            },
            breakpoints: {
                992: {
                    slidesPerView: 2,
                },
            },
        });

        const sliders = document.querySelectorAll('.mil-reviews-slider');
        const paginations = document.querySelectorAll('.mil-reviews-pagination');

        sliders.forEach((slider, index) => {
            const pagination = paginations[index];
            const prevButton = document.querySelectorAll('.mil-review-prev')[index];
            const nextButton = document.querySelectorAll('.mil-review-next')[index];

            initSlider(slider, {
                parallax: true,
                autoHeight: true,
                spaceBetween: 15,
                slidesPerView: 1,
                speed: 800,
                pagination: {
                    el: pagination,
                    clickable: true,
                },
                navigation: {
                    prevEl: prevButton,
                    nextEl: nextButton,
                },
            });
        });

        function initSlider(slider, options) {
            if (slider) {
                new Swiper(slider, options);
            }
        }

        /* -------------------------------------------
            Scroll Animation
        ------------------------------------------- */
        const appearance = document.querySelectorAll(".mil-up");
        const scaleImage = document.querySelectorAll(".mil-scale-img");
        const addClassElements = document.querySelectorAll('.mil-add-class');

        function isInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= -90 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.left >= 0 &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }

        const filteredAppearance = Array.from(appearance).filter(el => !isInViewport(el));
        const filteredAddClassElements = Array.from(addClassElements).filter(el => !isInViewport(el));

        filteredAppearance.forEach(section => handleScrollAnimation(section, createScrollTrigger));
        filteredAddClassElements.forEach(element => handleClassToggle(element));

        scaleImage.forEach(section => handleScaleAnimation(section));

        function handleScrollAnimation(section, callback) {
            const container = section.closest('.mil-half-1') || section.closest('.mil-half-2');
            callback(section, container);
        }

        function handleScaleAnimation(section) {
            const container = section.closest('.mil-half-1') || section.closest('.mil-half-2');
            const value1 = Math.max(0.95, section.getAttribute("data-value-1"));
            const value2 = section.getAttribute("data-value-2");
            createScaleAnimation(section, value1, value2, container);
        }

        function handleClassToggle(element) {
            const container = element.closest('.mil-half-1') || element.closest('.mil-half-2');
            createClassToggleScrollTrigger(element, container);
        }

        function createScrollTrigger(section, scroller) {
            gsap.fromTo(section, {
                opacity: 0,
                y: 40,
                scale: 0.95,
                pointerEvents: 'none',
            }, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.4,
                onComplete: () => {
                    setTimeout(() => {
                        section.style.pointerEvents = 'all';
                    }, 100);
                },
                scrollTrigger: {
                    trigger: section,
                    scroller: scroller,
                    toggleActions: 'play none none reverse',
                    start: 'top+=90px bottom',
                    onEnter: () => section.style.pointerEvents = 'none',
                    onLeaveBack: () => section.style.pointerEvents = 'none',
                }
            });
        }

        function createClassToggleScrollTrigger(element, scroller) {
            ScrollTrigger.create({
                trigger: element,
                scroller: scroller,
                toggleActions: 'play none none reverse',
                onEnter: () => addClassToElement(element),
                onLeaveBack: () => removeClassFromElement(element)
            });
        }

        function createScaleAnimation(section, value1, value2, scroller) {
            const startValue = window.innerWidth < 1200 ? 'top-=100 bottom-=100%' : 'top bottom-=100%';

            gsap.fromTo(section, {
                scale: value1,
                y: '0%',
            }, {
                scale: value2,
                y: '10%',
                scrollTrigger: {
                    scroller: scroller,
                    trigger: section,
                    start: startValue,
                    scrub: true,
                    toggleActions: 'play none none reverse',
                }
            });
        }

        function addClassToElement(element) {
            element.classList.add('mil-active');
        }

        function removeClassFromElement(element) {
            element.classList.remove('mil-active');
        }

    }); 

});
