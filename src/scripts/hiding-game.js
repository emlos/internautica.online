const dimensions = [10, 10];

//------------------------- html elements
const container = document.getElementById("hiding-container");

const grid = document.createElement("div");

// ------------------- logic

//----enums
const Color = Object.freeze({
  BLACK: " #000000",
  DARK_GREEN: "#005500",
  NORMAL_GREEN: "#00ab00",
  LIGHT_GREEN: "#00ff00",
  DARK_BLUE: "#0000ff",
  NORMAL_BLUE: "#0055ff",
  LIGHT_BLUE: "#00abff",
  NORMAL_TEAL: "#00ffff",
  NORMAL_RED: "#ff0000",
  DARK_ORANGE: "#ff5500",
  LIGHT_ORANGE: "#ffab00",
  NORMAL_YELLOW: "#ffff00",
  DARK_PINK: "#ff00ff",
  NORMAL_PINK: "#ff55ff",
  LIGHT_PINK: "#ffabff",
  WHITE: " #ffffff",
});

const Entity = Object.freeze({
  EMPTY: 0,
  WALL: 1,
  GUARD: 2,
  DOG: 3,
  PLAYER: 999,
});

const logicalGrid = Array.from(Array(dimensions[0]), () =>
  new Array(dimensions[1]).fill(Entity.EMPTY)
);

//------------------------game functions

function init() {
    setPosition(Entity.PLAYER, [0,0])
    console.log(logicalGrid)
  buildHTML();
  setTimeout(() => {
    setPosition(Entity.EMPTY, [0,0])
    setPosition(Entity.PLAYER, [1,0])
    buildHTML()
    setPosition(Entity.EMPTY, [1,0])
  }, 1000)
}

function buildHTML() {
    grid.innerHTML = ''
  grid.classList.add("hiding-grid");

  grid.style.display = "grid";
  grid.style.gridTemplateRows = `repeat(${dimensions[0]}, 30px`;
  grid.style.gridTemplateColumns = `repeat(${dimensions[1]}, 30px`;

  for (let x = 0; x < dimensions[0]; x++) {
    for (let y = 0; y < dimensions[1]; y++) {
      let space = document.createElement("div");
      space.classList.add(`grid-${logicalGrid[x][y]}`, "grid-space");
      space.id = `grid-${x}-${y}`;

      space.style.gridRow = x + 1;
      space.style.gridColumn = y + 1;

      grid.appendChild(space);
    }
  }

  container.appendChild(grid);
}

//--- classes and util

class Walkable {
  constructor(startingPosition, color) {
    this.startingPosition = startingPosition;
    this.position = startingPosition;

    this.color = color;
  }
}

class Player {
  constructor(startingPosition = [0, 0]) {
    if (isOccupied(startingPosition, Entity.GUARD, Entity.DOG, Entity.WALL)) {
      throw new Error("Space occupied by other entity");
    }
    if (
      startingPosition[0] > dimensions[0] ||
      startingPosition[1] > dimensions[1]
    ) {
      throw new Error("position out of bounds for guard!");
    }

    this.startingPosition = startingPosition;
    this.position = startingPosition;

    this.color = Color.DARK_ORANGE;
  }

  get color() {
    return this.color;
  }

  get position() {
    return this.position;
  }

  move() {
    if (this.behavior === "stand") {
      //do nothing
    }
    if (this.behavior === "walk") {
      //walk
    }
  }
}

class Guard {
  constructor(startingPosition = dimensions) {
    if (
      isOccupied(
        startingPosition,
        Entity.GUARD,
        Entity.PLAYER,
        Entity.DOG,
        Entity.WALL
      )
    ) {
      throw new Error("Space occupied by other entity");
    }
    if (
      startingPosition[0] > dimensions[0] ||
      startingPosition[1] > dimensions[1]
    ) {
      throw new Error("position out of bounds for guard!");
    }

    this.startingPosition = startingPosition;
    this.position = startingPosition;
    setPosition(self, this.position);

    this.color = Color.DARK_ORANGE;
  }

  get color() {
    return this.color;
  }

  get position() {
    return this.position;
  }

  move() {
    if (this.behavior === "stand") {
      //do nothing
    }
    if (this.behavior === "walk") {
      //walk
    }
  }
}

///---UTIL

//assuming an isSpacefree check took place
function setPosition(actor, position) {
  logicalGrid[position[0]][position[1]] = actor;
}

function isSpaceFree(position, ...actors) {
  const x = position[0];
  const y = position[1];

  if (x > dimensions[0] || y > dimensions[1] || logicalGrid[x][y]) {
    throw new Error("position out of bounds for grid!");
  }

  const occupant = logicalGrid[x][y];

  return !(actors.indexOf(occupant) > -1);
}

function _printgrid() {
  for (let x = 0; x < logicalGrid.length; x++) {
    let row = [];
    for (let y = 0; y < logicalGrid[x].length; y++) {
      row.push(logicalGrid[x][y]);
    }
    console.log(...row);
  }
}
