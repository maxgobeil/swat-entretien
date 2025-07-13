document.addEventListener("DOMContentLoaded", function () {
  // Hamburger Menu Functionality
  const hamburgerMenu = document.getElementById("hamburgerMenu");
  const mobileNav = document.getElementById("mobileNav");

  if (hamburgerMenu && mobileNav) {
    hamburgerMenu.addEventListener("click", function () {
      this.classList.toggle("active");
      mobileNav.classList.toggle("active");

      // Prevent body scroll when menu is open
      if (mobileNav.classList.contains("active")) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });

    // Close mobile menu when clicking on a nav link
    const mobileNavLinks = mobileNav.querySelectorAll(".nav-link");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", function () {
        hamburgerMenu.classList.remove("active");
        mobileNav.classList.remove("active");
        document.body.style.overflow = "";
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (event) {
      if (
        !hamburgerMenu.contains(event.target) &&
        !mobileNav.contains(event.target)
      ) {
        hamburgerMenu.classList.remove("active");
        mobileNav.classList.remove("active");
        document.body.style.overflow = "";
      }
    });

    // Close mobile menu on window resize if screen becomes large
    window.addEventListener("resize", function () {
      if (window.innerWidth > 1200) {
        hamburgerMenu.classList.remove("active");
        mobileNav.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }
});

let form = document.getElementById("contactForm");
let formStatus = document.getElementById("formStatus");

const messages = {
  en: {
    success: "Message sent successfully!",
    error: "Oops! There was a problem submitting your form",
  },
  fr: {
    success: "Message envoyé avec succès!",
    error: "Oups! Un problème est survenu lors de l'envoi du formulaire",
  },
};

form.addEventListener("submit", function (e) {
  e.preventDefault();
  let data = new FormData(form);
  fetch(form.action, {
    method: form.method,
    body: data,
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        formStatus.innerHTML = messages[lang].success;
        formStatus.className = "form-status success";
        form.reset();
        document.querySelector(".submit-button").disabled = true;
        document.querySelector(".submit-button").style.backgroundColor = "#ccc";
      } else {
        response.json().then((data) => {
          if (Object.hasOwn(data, "errors")) {
            formStatus.innerHTML = data["errors"]
              .map((error) => error["message"])
              .join(", ");
          } else {
            formStatus.innerHTML = messages[lang].error;
          }
          formStatus.className = "form-status error";
        });
      }
    })
    .catch((error) => {
      formStatus.innerHTML = messages[lang].error;
      formStatus.className = "form-status error";
    });
});

// Testimonials Carousel
document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("testimonialsTrack");
  const dots = document.querySelectorAll(".dot");
  let currentSlide = 0;
  const slidesPerView =
    window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
  const totalSlides = Math.ceil(track.children.length / slidesPerView);

  function updateCarousel() {
    const slideWidth = 100 / slidesPerView;
    track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentSlide = index;
      updateCarousel();
    });
  });

  // Auto-advance carousel
  setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
  }, 5000);

  // Handle window resize
  window.addEventListener("resize", () => {
    const newSlidesPerView =
      window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
    if (newSlidesPerView !== slidesPerView) {
      location.reload(); // Simple solution for responsive changes
    }
  });

  // Initialize
  updateCarousel();
});

document.addEventListener("DOMContentLoaded", function () {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    const header = question.querySelector(".faq-question-header");
    const answer = question.querySelector(".faq-answer");

    header.addEventListener("click", function () {
      const isActive = question.classList.contains("active");

      // Close all other questions
      faqQuestions.forEach((q) => {
        if (q !== question) {
          q.classList.remove("active");
        }
      });

      // Toggle current question
      if (isActive) {
        question.classList.remove("active");
      } else {
        question.classList.add("active");
      }
    });
  });
});
