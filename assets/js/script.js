document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("langToggle");

  // Set initial state based on current path
  toggle.checked = !window.location.pathname.includes("/en/");

  toggle.addEventListener("change", function () {
    const newPath = this.checked ? "/" : "/en/";
    window.location.href = newPath;
  });
});

const lang = document.documentElement.lang || "en";

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
