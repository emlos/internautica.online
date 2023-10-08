document.addEventListener("DOMContentLoaded", (event) => {
  let currentMode = getCookie("d-l-toggle");
  if (currentMode === "dark") {
    applyDarkMode();
  } else {
    applyLightMode();
  }
  currentMode = getCookie("font-toggle");
  if (currentMode === "dyslexic") {
    setDyslexicFont();
  } else {
    setSerifFont();
  }
});

function applyDarkMode() {
  toggleMode(document.body, "dark-mode", "light-mode");

  let elements =
    document.querySelector(".column") != null
      ? document.querySelector(".column")
      : [];
  for (let index = 0; index < elements.length; index++) {
    toggleMode(elements[index], "dark-mode", "light-mode");
  }
}
function applyLightMode() {
  toggleMode(document.body, "light-mode", "dark-mode");

  let elements =
    document.querySelector(".column") != null
      ? document.querySelector(".column")
      : [];
  for (let index = 0; index < elements.length; index++) {
    toggleMode(elements[index], "light-mode", "dark-mode");
  }
}

function setSerifFont() {
  toggleMode(document.body, "serif-font", "dyslexic-font");
}

function setDyslexicFont() {
  toggleMode(document.body, "dyslexic-font", "serif-font");
}

function toggleMode(target, newClass, oldClass) {
  //let target = document.getElementById("test")
  if (target != null) {
    target.classList.add(newClass);
    target.classList.remove(oldClass);
  } else {
    console.error(target);
    console.error("no such class exist");
  }
}

function changeColor() {
  let currentMode = getCookie("d-l-toggle");
  if (currentMode !== "dark") {
    applyDarkMode();
    setCookie("d-l-toggle", "dark");
  } else {
    applyLightMode();
    setCookie("d-l-toggle", "light");
  }
}

function changeFont() {
  let currentMode = getCookie("font-toggle");
  if (currentMode !== "dyslexic") {
    setDyslexicFont();
    setCookie("font-toggle", "dyslexic");
  } else {
    setSerifFont();
    setCookie("font-toggle", "serif");
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
