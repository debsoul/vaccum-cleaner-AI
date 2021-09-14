createHeight = () => {
  console.log("a");
  stringHeight = "";
  for (let x = 0; x < arraySize.height; x++) {
    stringHeight += "1fr ";
  }
  gridContainer.style.gridTemplateColumns = stringHeight;
};

createWidth = () => {
  stringWidth = "";
  for (let x = 0; x < arraySize.width; x++) {
    stringWidth += "1fr ";
  }
  gridContainer.style.gridTemplateRows = stringWidth;
};

placeCleaner = (id) => {
  let grid_item = document.getElementById(id);
  if (cleaner.placed) return;
  let img = document.createElement("img");
  img.src = "./cleaner.png";
  grid_item.appendChild(img);
  cleaner.position = id;
  cleaner.placed = true;
};

createGrid = () => {
  let counter = 0;
  array.forEach((line) => {
    line.forEach((item) => {
      gridHtml = document.createElement("div");
      gridHtml.setAttribute("id", counter);
      gridHtml.setAttribute("class", "gridItem");
      gridHtml.setAttribute("onclick", "placeCleaner(event.target.id)");
      dirt = document.createElement("img");
      if (item == "o") {
        dirt.src = "./dirt.png";
        gridHtml.appendChild(dirt);
      }
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

findPosById = (id) => {
  pos = {};
  counter = 0;
  x = 0;
  array.forEach((line) => {
    y = 0;
    line.forEach((item) => {
      if (counter == id) {
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
  cleaner_at = pos;
  invalid = true;
  console.log(path);
  lastPos = path[path.length - 2]
  console.log(lastPos);
  while (invalid) {
    console.log(cleaner_at == lastPos);
    random = Math.floor(Math.random() * 4);
    random++;
    if (random == 1 && cleaner_at.x - 1 >= 0) {
      cleaner_at = { x: cleaner_at.x - 1, y: cleaner_at.y };
      invalid = false;
    } else if (random == 2 && cleaner_at.x + 1 < array.length) {
      cleaner_at = { x: cleaner_at.x + 1, y: cleaner_at.y };
      invalid = false;
    } else if (random == 3 && cleaner_at.y - 1 >= 0) {
      cleaner_at = { x: cleaner_at.x, y: cleaner_at.y - 1 };
      invalid = false;
    } else if (random == 4 && cleaner_at.y + 1 < array[0].length) {
      cleaner_at = { x: cleaner_at.x, y: cleaner_at.y + 1 };
      invalid = false;
    }
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

getPath = () => {
  let aux = dirts;
  cleaner_at = findCleanerPos();
  while (dirts.length) {
    dirts.forEach((dirt, index) => {
      if (lookAround(cleaner_at, dirt)) {
        path.push(dirt);
        id = getPosId(dirt);
        aux.splice(index, 1);
        cleaner_at = findPosById(id);
        return;
      }
    });
    dirts = aux;
    if (dirts.length) {
      pos = moveRandom(cleaner_at);
      cleaner_at = pos;
      path.push(cleaner_at);
    }
  }

  console.log("path", path);
};

move = (pos) => {
  console.log('cleaner',cleaner.position);
  cleaner = document.getElementById(cleaner.position);
  cleaner.removeChild(cleaner.firstChild);
  id = getPosId(pos);
  let img = document.createElement("img");
  img.src = "./cleaner.png";
  let gridItem = document.getElementById(id);

  if (gridItem.childNodes.length) gridItem.removeChild(gridItem.firstChild);
  gridItem.appendChild(img);
  cleaner.position = id;
};

startMoving = () => {
  console.log(path);
  path.forEach((p, index) => {
    setTimeout(() => move(p), 1000 * index);
  });
};

startCleaning = () => {
  console.log(cleaner.position);
  getPath();
  showData();
  startMoving();
};

showData = () => {
  document.getElementById('movimentos').innerHTML = `Movimentos: ${path.length}`
}
containerHtml = document.getElementById("container");
gridContainer = document.getElementById("gridContainer");

lastPos = {}

array = [
  ["x", "x", "x", "o","x"],
  ["x", "o", "x", "x", 'o'],
  ["o", "x", "o", "o", "x"],
  ["x", "o", "o", "x", "o"],
  ["o", "x", "x", "o", "x"],
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

// gridHtml = document.createElement("div");
// gridHtml.class = "grid_item";
