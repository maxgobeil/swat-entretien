// ============================================================================
// MAIN APPLICATION CLASS
// ============================================================================
class SWATApp {
  constructor() {
    this.init();
  }

  init() {
    this.initMobileMenu();
    this.initFormValidation();
    this.initTestimonialsCarousel();
    this.initFAQAccordion();
  }

  // ============================================================================
  // MOBILE MENU MANAGEMENT
  // ============================================================================
  initMobileMenu() {
    const hamburgerMenu = document.getElementById("hamburgerMenu");
    const mobileNav = document.getElementById("mobileNav");

    if (!hamburgerMenu || !mobileNav) return;

    // Toggle menu
    hamburgerMenu.addEventListener("click", () => {
      this.toggleMobileMenu(hamburgerMenu, mobileNav);
    });

    // Close menu when clicking nav links
    const mobileNavLinks = mobileNav.querySelectorAll(".nav-link");
    mobileNavLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.closeMobileMenu(hamburgerMenu, mobileNav);
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (event) => {
      if (
        !hamburgerMenu.contains(event.target) &&
        !mobileNav.contains(event.target)
      ) {
        this.closeMobileMenu(hamburgerMenu, mobileNav);
      }
    });

    // Close menu on window resize
    window.addEventListener("resize", () => {
      if (window.innerWidth > 1200) {
        this.closeMobileMenu(hamburgerMenu, mobileNav);
      }
    });
  }

  toggleMobileMenu(hamburgerMenu, mobileNav) {
    hamburgerMenu.classList.toggle("active");
    mobileNav.classList.toggle("active");

    // Prevent body scroll when menu is open
    document.body.style.overflow = mobileNav.classList.contains("active")
      ? "hidden"
      : "";
  }

  closeMobileMenu(hamburgerMenu, mobileNav) {
    hamburgerMenu.classList.remove("active");
    mobileNav.classList.remove("active");
    document.body.style.overflow = "";
  }

  // ============================================================================
  // FORM VALIDATION SYSTEM
  // ============================================================================
  initFormValidation() {
    const forms = ["contactForm", "quoteForm", "careerApplicationForm"];

    forms.forEach((formId) => {
      const form = document.getElementById(formId);
      if (form) {
        new FormValidator(formId);
      }
    });
  }

  // ============================================================================
  // TESTIMONIALS CAROUSEL
  // ============================================================================
  initTestimonialsCarousel() {
    const track = document.getElementById("testimonialsTrack");
    const prevBtn = document.querySelector(".prev-arrow");
    const nextBtn = document.querySelector(".next-arrow");

    if (!track || !prevBtn || !nextBtn) return;

    const carousel = new TestimonialsCarousel(track, prevBtn, nextBtn);
    carousel.init();
  }

  // ============================================================================
  // FAQ ACCORDION
  // ============================================================================
  initFAQAccordion() {
    const faqQuestions = document.querySelectorAll(".faq-question");

    if (!faqQuestions.length) return;

    const faq = new FAQAccordion(faqQuestions);
    faq.init();
  }
}

// ============================================================================
// FORM VALIDATOR CLASS
// ============================================================================
class FormValidator {
  constructor(formId, options = {}) {
    this.form = document.getElementById(formId);
    this.originalButtonText =
      this.form.querySelector('button[type="submit"]')?.innerHTML || "Envoyer";
    this.options = {
      validateOnInput: true,
      showRealTimeValidation: true,
      ...options,
    };

    if (this.form) {
      this.init();
    }
  }

  init() {
    this.setupValidation();
    this.setupFormSubmission();
  }

  setupValidation() {
    const inputs = this.form.querySelectorAll("input, textarea, select");

    inputs.forEach((input) => {
      input.classList.add("form-input");

      if (this.options.showRealTimeValidation) {
        input.addEventListener("blur", () => this.validateField(input));
        input.addEventListener("input", () => this.clearFieldError(input));
      }

      if (input.hasAttribute("required")) {
        this.addRequiredIndicator(input);
      }
    });
  }

  addRequiredIndicator(input) {
    const label = input.previousElementSibling;
    if (label?.tagName === "LABEL") {
      label.innerHTML += ' <span class="required">*</span>';
    }
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    // Required field validation
    if (field.hasAttribute("required") && !value) {
      isValid = false;
      errorMessage = "Ce champ est obligatoire";
    }

    // Email validation
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = "Veuillez entrer une adresse email valide";
      }
    }

    // Phone validation
    if (field.type === "tel" && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))) {
        isValid = false;
        errorMessage = "Veuillez entrer un numéro de téléphone valide";
      }
    }

    // Text length validation
    if ((field.type === "text" || field.tagName === "TEXTAREA") && value) {
      if (value.length < 2) {
        isValid = false;
        errorMessage = "Ce champ doit contenir au moins 2 caractères";
      }
      if (field.maxLength && value.length > field.maxLength) {
        isValid = false;
        errorMessage = `Ce champ ne peut pas dépasser ${field.maxLength} caractères`;
      }
    }

    // Show/hide error
    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  }

  showFieldError(field, message) {
    this.clearFieldError(field);

    field.classList.add("error");

    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.textContent = message;

    field.parentNode.appendChild(errorDiv);
  }

  clearFieldError(field) {
    field.classList.remove("error");
    const errorDiv = field.parentNode.querySelector(".field-error");
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  validateForm() {
    const inputs = this.form.querySelectorAll("input, textarea, select");
    let isValid = true;

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  setupFormSubmission() {
    this.form.addEventListener("submit", (e) => {
      if (!this.validateForm()) {
        e.preventDefault();
        this.showFormError("Veuillez corriger les erreurs dans le formulaire");
        return false;
      }

      this.showLoadingState();
      this.handleFormSubmission();
    });
  }

  showFormError(message) {
    const statusDiv = this.form.parentNode.querySelector(".form-status");
    if (statusDiv) {
      statusDiv.innerHTML = message;
      statusDiv.className = "form-status error";
      statusDiv.style.display = "block";
    }
  }

  showLoadingState() {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Envoi en cours...";
      submitBtn.style.backgroundColor = "#ccc";
    }
  }

  async handleFormSubmission() {
    try {
      const formData = new FormData(this.form);
      const response = await fetch(this.form.action, {
        method: this.form.method,
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        this.showSuccess();
        this.form.reset();
      } else {
        const data = await response.json();
        this.showError(data.errors || "Erreur lors de l'envoi");
      }
    } catch (error) {
      this.showError("Erreur de connexion");
    } finally {
      this.hideLoadingState();
    }
  }

  showSuccess() {
    const statusDiv = this.form.parentNode.querySelector(".form-status");
    if (statusDiv) {
      statusDiv.innerHTML = "Message envoyé avec succès!";
      statusDiv.className = "form-status success";
      statusDiv.style.display = "block";
    }
  }

  showError(message) {
    const statusDiv = this.form.parentNode.querySelector(".form-status");
    if (statusDiv) {
      statusDiv.innerHTML =
        typeof message === "string"
          ? message
          : message.map((e) => e.message).join(", ");
      statusDiv.className = "form-status error";
      statusDiv.style.display = "block";
    }
  }

  hideLoadingState() {
    const submitBtn = this.form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = this.originalButtonText;
      submitBtn.style.backgroundColor = "";
    }
  }
}

// ============================================================================
// TESTIMONIALS CAROUSEL CLASS
// ============================================================================
class TestimonialsCarousel {
  constructor(track, prevBtn, nextBtn) {
    this.track = track;
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
    this.currentSlide = 0;
    this.totalSlides = track.children.length;
    this.autoAdvanceInterval = null;
  }

  init() {
    this.setupEventListeners();
    this.updateCarousel();
    this.startAutoAdvance();
  }

  setupEventListeners() {
    this.prevBtn.addEventListener("click", () => {
      this.prevSlide();
      this.resetAutoAdvance(); // Reset timer when manually navigating
    });

    this.nextBtn.addEventListener("click", () => {
      this.nextSlide();
      this.resetAutoAdvance(); // Reset timer when manually navigating
    });
  }

  prevSlide() {
    this.currentSlide =
      this.currentSlide > 0 ? this.currentSlide - 1 : this.totalSlides - 1;
    this.updateCarousel();
  }

  nextSlide() {
    this.currentSlide =
      this.currentSlide < this.totalSlides - 1 ? this.currentSlide + 1 : 0;
    this.updateCarousel();
  }

  updateCarousel() {
    const translateX = -(this.currentSlide * 25); // Each slide is 25% of the track
    this.track.style.transform = `translateX(${translateX}%)`;

    // Update button states
    this.prevBtn.disabled = this.currentSlide === 0;
    this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
  }

  startAutoAdvance() {
    this.autoAdvanceInterval = setInterval(() => {
      this.nextSlide();
    }, 5000); // 5 seconds
  }

  resetAutoAdvance() {
    // Clear existing interval and restart
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
    }
    this.startAutoAdvance();
  }
}

// ============================================================================
// FAQ ACCORDION CLASS
// ============================================================================
class FAQAccordion {
  constructor(questions) {
    this.questions = questions;
  }

  init() {
    this.questions.forEach((question) => {
      const header = question.querySelector(".faq-question-header");
      if (header) {
        header.addEventListener("click", () => this.toggleQuestion(question));
      }
    });
  }

  toggleQuestion(clickedQuestion) {
    const isActive = clickedQuestion.classList.contains("active");

    // Close all other questions
    this.questions.forEach((question) => {
      if (question !== clickedQuestion) {
        question.classList.remove("active");
      }
    });

    // Toggle current question
    if (isActive) {
      clickedQuestion.classList.remove("active");
    } else {
      clickedQuestion.classList.add("active");
    }
  }
}

// ============================================================================
// INITIALIZE APPLICATION
// ============================================================================
document.addEventListener("DOMContentLoaded", () => {
  new SWATApp();
});
