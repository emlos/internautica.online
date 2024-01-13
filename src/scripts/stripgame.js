const images_amount = 11;

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

  let someThreshold = 1000;

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

function makeDraggable() {
  $(".draggable-image").draggable({
    //containment: "#draggable-image-container",
    snap: '#base-undress',
    snapMode: 'inner',
    snapTolerance: 20
  });
}

function makeMinigameImages(container) {
  container = document.getElementById(container);
  const base = document.createElement("img");
  base.classList.add("image");
  base.id = 'base-undress'
  base.src = "/images/minigames/dismas-stripgame/000.png";

  container.appendChild(base);

  for (let i = 1; i <= images_amount; i++) {
    let image = document.createElement("img");
    image.classList.add("image", "draggable-image");

    let filename =
      "/images/minigames/dismas-stripgame/0" +
      (i < 10 ? "0" + i : "" + i) +
      ".png";
    console.log(filename);

    image.src = filename;
    image.onload = async function () {
      let rectPercent = await createRect(image);
      image.style.clipPath = `inset(${rectPercent.y}% ${
        100 - rectPercent.x - rectPercent.width
      }% ${100 - rectPercent.y - rectPercent.height}% ${rectPercent.x}%)`;
    };

    container.appendChild(image);
  }

  makeDraggable();
}
