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
  console.log(pos);
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

startCleaning = () => {
  pos = findCleanerPos();
  setTimeout(lookUp(pos));
  hasDirt = lookForDirt();

  console.log(pos);
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

cleaner = {
  placed: false,
  position: "",
};

hasDirt = true;
createGrid();

createHeight();
createWidth();

console.log(gridContainer.children.length);
// gridHtml = document.createElement("div");
// gridHtml.class = "grid_item";
