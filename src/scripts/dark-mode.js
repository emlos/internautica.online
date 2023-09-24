document.addEventListener("DOMContentLoaded", (event) => {
  let currentMode = getCookie("toggle");
  if (currentMode === "dark") {
    applyDarkMode();
  } else {
    applyLightMode();
  }
});

function applyDarkMode() {
  document.body.classList.add("dark-mode");
  document.body.classList.remove("light-mode");
}
function applyLightMode() {
  document.body.classList.add("light-mode");
  document.body.classList.remove("dark-mode");
}

function changeColor() {
  let currentMode = getCookie("toggle");
  if (currentMode !== "dark") {
    applyDarkMode();
    setCookie("toggle", "dark");
  } else {
    applyLightMode();
    setCookie("toggle", "light");
  }
}

function setCookie(name, value) {
  document.cookie = name + "=" + value + "; path=/";
}
// Function to get a cookie
function getCookie(name) {
  const value = "; " + document.cookie;
  const parts = value.split("; " + name + "=");
  if (parts.length === 2) return parts.pop().split(";").shift();
}
