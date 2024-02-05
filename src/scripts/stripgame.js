const STATUS = {};

var CONTAINER; //eh bad practice
const bubble = document.createElement("div");

const outfitnames = Object.keys(OUTFITS);

var initialsMoved = 0;

function start() {
  //add base
  CONTAINER = document.getElementById("draggable-image-container");
  const base = document.createElement("img");
  base.classList.add("image");
  base.id = "base-undress";
  base.src = trim(BASE); //remove dots or whatevrr

  //add wardrobe
  const wardrobe = document.createElement("img");
  wardrobe.classList.add("image", "wardrobe");
  wardrobe.src = trim(WARDROBE); //remove dots or whatevrr

  //speechbubbles
  const bubbleImage = document.createElement("img");
  bubbleImage.id = "bubble-image";
  bubbleImage.src = trim(BUBBLE);
  //image loading
  bubbleImage.onload = function () {
    bubble.style.width = bubbleImage.naturalWidth + "px";
    bubble.style.height = bubbleImage.naturalHeight + "px";
  };
  if (bubbleImage.complete) {
    bubbleImage.style.width = image.naturalWidth + "px";
    bubbleImage.style.height = image.naturalHeight + "px";
  }

  const bubbleText = document.createElement("p");
  bubbleText.id = "bubble-text";
  bubbleText.classList.add("typewriter");
  bubble.style.display = "none";
  bubble.id = "bubble-container";

  bubble.appendChild(bubbleImage);
  bubble.appendChild(bubbleText);

  CONTAINER.appendChild(bubble);
  CONTAINER.appendChild(base);
  CONTAINER.appendChild(wardrobe);

  makeMinigameImages(
    CONTAINER,
    STANDARD,
    0,
    base.offsetLeft,
    "image",
    "draggable-image",
    "initial-draggable"
  );

  makeDraggable();
}

function unlockExtras() {
  let offset = 900;
  Object.keys(OUTFITS).forEach((key, item) => {
    //console.log(offset)
    makeMinigameImages(
      CONTAINER,
      OUTFITS[key],
      0,
      offset,
      "image",
      "draggable-image",
      "outfit-draggable",
      key + "-outfit-draggable"
    );
    offset += 300;
  });

  //console.log("unlock!");
  makeMinigameImages(
    CONTAINER,
    EXTRAS,
    5,
    0,
    "image",
    "draggable-image",
    "extra-draggable"
  );

  makeDraggable();

  document.querySelectorAll('.unlockable-button').forEach(btm =>{
    btm.style.display = 'inline-block'
  })
}

function makeMinigameImages(
  container,
  set,
  offset,
  initialOffset,
  ...classes
) {
  var totalOffsetX = initialOffset;
  set.forEach((filename) => {
    var zindex = parseInt(filename.split("/").at(-1).split(".")[0]);

    let image = document.createElement("img");

    image.style.left = totalOffsetX + "px";
    totalOffsetX += offset;


    if (classes.indexOf("initial-draggable") != -1) {
      image.id = "initial-" + zindex;
    }

    image.classList.add(...classes);
    image.style.zIndex = zindex;

    image.src = trim(filename);

    //setting collission
    image.onload = async function () {
      let rectPercent = await createRect(image);
      image.style.clipPath = `inset(${rectPercent.y}% ${
        100 - rectPercent.x - rectPercent.width
      }% ${100 - rectPercent.y - rectPercent.height}% ${rectPercent.x}%)`;
    };

    container.appendChild(image);
  });

  if (classes.indexOf("initial-draggable") != -1) {
    STATUS["baseElements"] = set.map((item) => {
      return {
        id: "initial-" + parseInt(item.split("/").at(-1).split(".")[0]),
        wasDragged: false,
      };
    });
  }
}

//draggable api and unlock conditions
function makeDraggable() {
  $(".draggable-image").draggable({
    //containment: "#draggable-image-container",
    snap: "#base-undress",
    snapMode: "inner",
    snapTolerance: 15,
    start: function (event, ui) {
      var draggedElementId = ui.helper.attr("id");
      checkUnlock(draggedElementId);
      barkTrigger();
    },
  });
}

//-------------------------------------------------UNLOCKING

function checkUnlock(draggedElementId) {
  if (draggedElementId && draggedElementId.indexOf("initial") != -1) {
    // Find the corresponding object in the startArray
    var draggedObject = STATUS["baseElements"].find(function (obj) {
      return obj.id === draggedElementId;
    });

    // Check if the element was dragged for the first time
    if (!draggedObject.wasDragged) {
      draggedObject.wasDragged = true; // Set wasDragged to true
      initialsMoved++;

      // Check if all elements have been dragged
      if (initialsMoved === STATUS["baseElements"].length) {
        unlockExtras();
      }
    }
  }
}

//- --------------------------------------BARKING

let timeoutID;
let istyping = false;
function barkTrigger() {
  let probability = 4;
  let chance = Math.floor(Math.random() * probability); // 1 in 4th chance
  if (chance == 0) {
    let bark = SPEECH[Math.floor(Math.random() * SPEECH.length)];
    //console.log(bark);

    if (istyping) return;

    if (timeoutID) {
      clearTimeout(timeoutID);
    }
    istyping = true;

    // Wait for typeWriter to complete then hide the bubble after 2 seconds
    makeBubble(bark).then(() => {
      timeoutID = setTimeout(() => {
        hideBubble();
        istyping = false;
      }, 2000);
    });
  }
}

function makeBubble(text) {
  showBubble();

  var element = $("#bubble-text");
  element.text("");

  let index = 0;
  let interval = 25;

  return new Promise((resolve) => {
    function displayNextChar() {
      if (index < text.length) {
        element.text(element.text() + text[index++]);
        setTimeout(displayNextChar, interval);
      } else {
        // Resolve the promise when text is fully displayed
        resolve();
      }
    }

    displayNextChar();
  });
}

function showBubble() {
  bubble.style.display = "block";
  bubble.classList.add("bubble-animation");
}
function hideBubble() {
  bubble.style.display = "none";
  bubble.classList.remove("bubble-animation");
}

/// ----------------------------------------------------- BUTTONS

function undress() {
  console.log("undress clicked!")
  let base = document.getElementById("base-undress");
  let basePosition = base.offsetLeft;

  let standard = document.querySelectorAll(".initial-draggable");
  let extras = document.querySelectorAll(".extra-draggable");

  let distance = 300;

  moveImages(standard, basePosition + distance);

  outfitnames.forEach((outfit) => {
    distance += 300;
    let outfits = document.querySelectorAll("." + outfit + "-outfit-draggable");
    moveImages(outfits, basePosition + distance);
   
  });

  moveImages(extras, -10, 10);
}

function sort() {
  console.log("sort clicked!")
  let base = document.getElementById("base-undress");
  let basePosition = base.offsetLeft;

  let standard = document.querySelectorAll(".initial-draggable");
  let extras = document.querySelectorAll(".extra-draggable");

  let distance = 300;
  outfitnames.forEach((outfit) => {
    let outfits = document.querySelectorAll("." + outfit + "-outfit-draggable");
    moveImages(outfits, basePosition + distance);
    distance += 300;
  });

  moveImages(standard, basePosition);

  moveImages(extras, -10, 10);
}

function moveImages(images, where, offset = 0) {
  images.forEach((img) => {
    img.style.top = 0;
    img.style.left = where + offset + "px";
  });
}

// -----------------------------UTIL

//making a path absolute
function trim(inputString, before = "/images") {
  const index = inputString.indexOf(before);

  // Check if '/images/' is found in the string
  if (index !== -1) {
    // Extract the substring starting from the index of '/images/'
    const trimmedString = inputString.substring(index);
    return trimmedString;
  } else return "";
}

//image functions for creating rectangles

function createRect(imageElement) {
  // Convert the image element to OpenCV Mat
  let src = cv.imread(imageElement);
  let gray = new cv.Mat();
  let mask = new cv.Mat();

  // Convert to grayscale
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

  // Threshold the image to create a binary mask
  cv.threshold(gray, mask, 1, 255, cv.THRESH_BINARY);

  let dilateSize = new cv.Size(5, 5); // Change the size as needed
  let M = cv.Mat.ones(dilateSize, cv.CV_8U);
  let anchor = new cv.Point(-1, -1);
  cv.dilate(
    mask,
    mask,
    M,
    anchor,
    1,
    cv.BORDER_CONSTANT,
    cv.morphologyDefaultBorderValue()
  );

  // Find contours
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();
  cv.findContours(
    mask,
    contours,
    hierarchy,
    cv.RETR_EXTERNAL,
    cv.CHAIN_APPROX_SIMPLE
  );

  // Calculate the combined bounding rectangle
  let minX = imageElement.width,
    minY = imageElement.height,
    maxX = 0,
    maxY = 0;

  let someThreshold = 100;

  for (let i = 0; i < contours.size(); ++i) {
    let cnt = contours.get(i);
    let area = cv.contourArea(cnt, false);
    if (area > someThreshold) {
      // Define someThreshold based on your needs
      let rect = cv.boundingRect(cnt);
      minX = Math.min(minX, rect.x);
      minY = Math.min(minY, rect.y);
      maxX = Math.max(maxX, rect.x + rect.width);
      maxY = Math.max(maxY, rect.y + rect.height);
    }
  }

  let rect = {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };

  // Clean up
  src.delete();
  gray.delete();
  mask.delete();
  contours.delete();
  hierarchy.delete();

  let percentRect = {
    x: (rect.x / imageElement.width) * 100,
    y: (rect.y / imageElement.height) * 100,
    width: (rect.width / imageElement.width) * 100,
    height: (rect.height / imageElement.height) * 100,
  };

  // Return the rectangle coordinates and dimensions
  return percentRect;
}

function clipImages(images) {
  images.forEach((img) => {
    let rectPercent = createRect(img);
    img.style.clipPath = `inset(${rectPercent.y}% ${
      100 - rectPercent.x - rectPercent.width
    }% ${100 - rectPercent.y - rectPercent.height}% ${rectPercent.x}%)`;
  });
}
