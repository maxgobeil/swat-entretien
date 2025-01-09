document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("langToggle");

  // Set initial state based on current path
  toggle.checked = !window.location.pathname.includes("/en/");

  toggle.addEventListener("change", function () {
    const newPath = this.checked ? "/" : "/en/";
    window.location.href = newPath;
  });
});
