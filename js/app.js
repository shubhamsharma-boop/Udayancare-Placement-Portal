/*=========================================
UCPP - app.js
Version : 1.0
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    /*==============================
    Mobile Menu
    ==============================*/

    const mobileMenu = document.querySelector(".mobile-menu");
    const navbar = document.querySelector(".navbar");

    if (mobileMenu && navbar) {

        mobileMenu.addEventListener("click", () => {

            navbar.classList.toggle("active");

            mobileMenu.innerHTML = navbar.classList.contains("active")
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';

        });

    }

    /*==============================
    Mobile Dropdown
    ==============================*/

    const dropdowns = document.querySelectorAll(".dropdown");

    dropdowns.forEach(dropdown => {

        dropdown.addEventListener("click", function (e) {

            if (window.innerWidth <= 768) {

                e.preventDefault();

                this.classList.toggle("active");

            }

        });

    });

    /*==============================
    Sticky Header
    ==============================*/

    const header = document.querySelector(".header");

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            header.style.boxShadow = "0 5px 20px rgba(0,0,0,.10)";

        } else {

            header.style.boxShadow = "0 2px 10px rgba(0,0,0,.08)";

        }

    });

    /*==============================
    Active Navigation
    ==============================*/

    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".navbar a").forEach(link => {

        const href = link.getAttribute("href");

        if (href === currentPage || (currentPage === "" && href === "index.html")) {

            link.classList.add("active");

        }

    });

    /*==============================
    Counter Animation
    ==============================*/

    const counters = document.querySelectorAll(".counter");

    const animateCounter = (counter) => {

        const target = parseInt(counter.innerText.replace(/\D/g, ""));

        let count = 0;

        const speed = target / 80;

        const update = () => {

            if (count < target) {

                count += speed;

                counter.innerText = Math.ceil(count) + "+";

                requestAnimationFrame(update);

            } else {

                counter.innerText = target + "+";

            }

        };

        update();

    };

    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                animateCounter(entry.target);

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.5
    });

    counters.forEach(counter => {

        observer.observe(counter);

    });

    /*==============================
    Smooth Scroll
    ==============================*/

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", function (e) {

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {

                e.preventDefault();

                target.scrollIntoView({

                    behavior: "smooth"

                });

            }

        });

    });

    /*==============================
    Close Mobile Menu After Click
    ==============================*/

    document.querySelectorAll(".navbar a").forEach(link => {

        link.addEventListener("click", () => {

            if (window.innerWidth <= 768) {

                navbar.classList.remove("active");

                mobileMenu.innerHTML = '<i class="fa-solid fa-bars"></i>';

            }

        });

    });

});

/*=========================================
End of app.js
=========================================*/
