var freeze

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

  freeze = new Freezeframe({responsive: false, warning: false, trigger: false});
  currentMode = getCookie("gifs-toggle");
  if (currentMode === "playing") {
    setTimeout(() => freeze.start(), 1000)
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
    target.classList.add(newClass);
    target.classList.remove(oldClass);
  
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

function toggleGifs() {
  let currentMode = getCookie("gifs-toggle");
  if (currentMode !== "playing") {
    freeze.start()
    setCookie("gifs-toggle", "playing");
  } else {
    freeze.stop()
    setCookie("gifs-toggle", "paused");
  }
}

function toggleGif(imageElement) {
  const src = imageElement.getAttribute('src');
  
  if (/\.gif/i.test(src)) {
    // Pause: Replace with the first frame of the animated GIF
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageElement, 0, 0);
    
    // Replace the image source with the canvas data
    imageElement.setAttribute('data-animated-src', src);
    imageElement.setAttribute('src', canvas.toDataURL());
  } else {
    // Play: Replace with the original animated GIF
    const animatedSrc = imageElement.getAttribute('data-animated-src');
    if (animatedSrc) {
      imageElement.setAttribute('src', animatedSrc);
    }
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
