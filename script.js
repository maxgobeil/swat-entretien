document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("langToggle");

  // Set initial state based on current page
  toggle.checked = window.location.pathname.includes("/fr.html");

  toggle.addEventListener("change", function () {
    const newPath = this.checked ? "/fr.html" : "/index.html";
    window.location.href = newPath;
  });
});
