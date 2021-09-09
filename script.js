createHeight = () => {
  console.log("a");
  stringHeight = "";
  for (let x = 0; x < arraySize.height; x++) {
    stringHeight += "1fr ";
  }
  console.log(stringHeight);
  gridContainer.style.gridTemplateColumns = stringHeight;
};

createWidth = () => {
  stringWidth = "";
  for (let x = 0; x < arraySize.width; x++) {
    stringWidth += "1fr ";
  }
  console.log(stringWidth);
  gridContainer.style.gridTemplateRows = stringWidth;
};

placeCleaner = (id) => {
  let grid_item = document.getElementById(id);
  if (cleaner.placed) return;
  grid_item.innerHTML = "X";
  cleaner.position = id;
  cleaner.placed = true;
};

createGrid = () => {
  let counter = 0;
  array.forEach((line) => {
    line.forEach((item) => {
      console.log("aa");
      gridHtml = document.createElement("div");
      gridHtml.setAttribute("id", counter);
      gridHtml.setAttribute("class", "gridItem");
      gridHtml.setAttribute("onclick", "placeCleaner(event.target.id)");
      dirt = document.createElement("img");
      if (item == "o") dirt.src = "./dirt.png";
      gridHtml.appendChild(dirt);
      gridContainer.appendChild(gridHtml);
      counter++;
    });
  });
};

lookForDirt = () => {
  has = false;
  array.forEach((line) => {
    line.forEach((item) => {
      if (item == "o") return (has = true);
    });
  });

  return has;
};

findCleanerPos = () => {
  pos = {};
  counter = 0;
  x = 0;
  array.forEach((line) => {
    y = 0;
    line.forEach((item) => {
      if (counter == cleaner.position) {
        pos = {
          x: x,
          y: y,
        };
      }
      y++;
      counter++;
    });
    x++;
  });

  return pos;
};

getPosId = (pos) => {
  id = undefined;
  counter = 0;
  x = 0;
  array.forEach((line) => {
    y = 0;
    line.forEach((item) => {
      if (pos.x == x && pos.y == y) id = counter;
      y++;
      counter++;
    });
    x++;
  });

  return id;
};

move = (pos) => {
  id = getPosId(pos);
  gridItem = document.getElementById(id);
  gridItem.innerHTML = "X";
  cleaner = document.getElementById(cleaner.position);
  cleaner.innerHTML = "";
  cleaner.position = id;
};

clean = (pos) => {
  id = getPosId(pos);
  gridItem = document.getElementById(id);
  cleaner = document.getElementById(cleaner.position);
  cleaner.innerHTML = "";
  gridItem.innerHTML = "X";
  cleaner.position = id;
};

lookDown = (pos) => {
  while (pos.x + 1 < arraySize.height) {
    down = array[pos.x + 1][pos.y];
    if (down == "o") {
      clean({
        x: pos.x + 1,
        y: pos.y,
      });
    } else {
      move({
        x: pos.x + 1,
        y: pos.y,
      });
    }

    pos = {
      x: pos.x + 1,
      y: pos.y,
    };
  }
  // if (pos.x + 1 > arraySize.height) return lookDown();
};

lookUp = (pos) => {
  if (pos.x - 1 < 0) return lookDown(pos);
  up = array[pos.x - 1][pos.y];
  if (up == "o") {
    clean({
      x: pos.x - 1,
      y: pos.y,
    });
  } else {
    move({
      x: pos.x - 1,
      y: pos.y,
    });
  }
};

getAllDirt = () => {
  dirt = [];
  let x = 0;
  array.forEach((line) => {
    let y = 0;
    line.forEach((item) => {
      if (item == "o") dirt.push({ x: x, y: y });
      y++;
    });
    x++;
  });
  return dirt;
};

moveRandom = (pos) => {
  random = Math.floor(Math.random() * 4);
  random++;
  console.log(random);
  cleaner_at = pos;
  if (random == 1 && cleaner_at.x - 1 >= 0) {
    cleaner_at = { x: cleaner_at.x - 1, y: cleaner_at.y };
  } else if (random == 2 && cleaner_at.x + 1 < array.length) {
    cleaner_at = { x: cleaner_at.x + 1, y: cleaner_at.y };
  } else if (random == 3 && cleaner_at.y - 1 >= 0) {
    cleaner_at = { x: cleaner_at.x, y: cleaner_at.y - 1 };
  } else if (random == 4 && cleaner_at.y + 1 < array[0].length) {
    cleaner_at = { x: cleaner_at.x, y: cleaner_at.y + 1 };
  }

  return cleaner_at;
};

lookAround = (pos, dirt) => {
  if (dirt.x == pos.x + 1) {
    if (dirt.y == pos.y + 1) return dirt;
    if (dirt.y == pos.y) return dirt;
    if (dirt.y == pos.y - 1) return dirt;
  } else if (dirt.x == pos.x - 1) {
    if (dirt.y == pos.y + 1) return dirt;
    if (dirt.y == pos.y) return dirt;
    if (dirt.y == pos.y - 1) return dirt;
  } else {
    return false;
  }
};

getPath = async () => {
  cleaner_at = findCleanerPos();
  console.log("at", cleaner_at);
  while (dirts.length) {
    dirts.forEach((dirt, index) => {
      console.log("cleaner", cleaner_at);
      console.log("dirt", dirt);
      if (lookAround(cleaner_at, dirt)) {
        console.log("in");
        path.push(dirt);
        id = getPosId(dirt);
        cleaner.position = id;
        dirts.splice(index, 1);
        cleaner_at = findCleanerPos();
        return;
      }
    });
    if (dirts.length) {
      pos = moveRandom(cleaner_at);
      // while (!pos) {
      // pos = moveRandom(cleaner_at);
      // console.log(pos);
      // }
      cleaner_at = pos;

      cleaner.position = getPosId(pos);
      path.push(cleaner_at);
    }
  }

  console.log("path", path);
  console.log();
};

startCleaning = () => {
  x = 0;
  getPath();
  x++;
  hasDirt = lookForDirt();
};
containerHtml = document.getElementById("container");
gridContainer = document.getElementById("gridContainer");

array = [
  ["x", "x", "x", "o"],
  ["x", "o", "x", "x"],
  ["o", "x", "o", "o"],
  ["x", "o", "o", "x"],
];

arraySize = {
  width: array.length,
  height: array[0].length,
};
dirts = getAllDirt();
cleaner = {
  placed: false,
  position: "",
};

path = [];
hasDirt = true;
createGrid();

createHeight();
createWidth();

console.log(gridContainer.children.length);
// gridHtml = document.createElement("div");
// gridHtml.class = "grid_item";
