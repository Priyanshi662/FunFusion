for (let i = 0; i < 81; i++) {
  const elm = document.getElementById(`cell-${i}`);
  elm.value = "";
  elm.disabled = false;
  elm.maxLength = 1;
  elm.inputMode = "numeric";
}

const validInput = function () {
  for (let i = 0; i < 81; i++) {
    const elm = document.getElementById(`cell-${i}`);
    if (elm.value === "") continue;
    if (isNaN(parseInt(elm.value)) || elm.value === "0") return [false, "data"];
  }
  const input = readInput();
  for (let i = 0; i < 9; i++) {
    const rSeen = new Set();
    const cSeen = new Set();
    for (let j = 0; j < 9; j++) {
      if (
        (rSeen.has(input[i][j]) && input[i][j] !== 0) ||
        (cSeen.has(input[j][i]) && input[j][i] !== 0)
      )
        return [false, "layout"];
      rSeen.add(input[i][j]);
      cSeen.add(input[j][i]);
    }
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        const seen = new Set();
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const tile = input[i + r][j + c];
            if (tile === 0) continue;
            if (seen.has(tile)) return false;
            seen.add(tile);
          }
        }
      }
    }
  }
  return [true];
};

const readInput = function () {
  const arr = new Array(9);
  for (let i = 0; i < 9; i++) {
    arr[i] = new Array(9);
    for (let j = 0; j < 9; j++) {
      arr[i][j] = Number(document.getElementById(`cell-${i * 9 + j}`).value);
    }
  }
  return arr;
};

const isValid = function (grid, r, c, num) {
  // Check row and column for num
  for (let i = 0; i < 9; i++) {
    if (grid[r][i] === num) return false;
    if (grid[i][c] === num) return false;
  }
  // Check subgrid for num
  const [x, y] = [Math.floor(r / 3), Math.floor(c / 3)];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[3 * x + i][3 * y + j] === num) return false;
    }
  }
  return true;
};

let solved = [];
let input = [];
const solve = function (grid, r, c) {
  if (r === 9) {
    solved = [...grid.slice()];
    return true;
  } else if (c === 9) return solve(grid, r + 1, 0);
  else if (grid[r][c] !== 0) return solve(grid, r, c + 1);
  else {
    for (let k = 1; k <= 9; k++) {
      if (isValid(grid, r, c, k)) {
        grid[r][c] = k;
        if (solve(grid, r, c + 1)) return true;
        grid[r][c] = 0;
      }
    }
    return false;
  }
};

let isSolved = false;

const solveButton = document.getElementById("solve");
const resetButton = document.getElementById("reset");
const grid = document.getElementById("grid");
const message = document.getElementById("message");
solveButton.addEventListener("click", () => {
  const result = validInput();
  if (!result[0]) {
    message.innerHTML =
      result[1] === "data"
        ? "Invalid input. Please try again."
        : "Invalid row/column/subgrid layout. Please try again.";
    return;
  }
  input = readInput();
  solved = [];
  solve(readInput(), 0, 0);
  isSolved = true;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const elm = document.getElementById(`cell-${i * 9 + j}`);
      if (input[i][j] === solved[i][j]) continue;
      elm.value = solved[i][j];
      elm.style.color = "red";
    }
  }
  message.innerHTML = "";
});

grid.addEventListener("click", () => {
  if (!isSolved) return;
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const elm = document.getElementById(`cell-${9 * i + j}`);
      elm.style.color = "black";
      elm.value = input[i][j] === 0 ? "" : input[i][j];
    }
  }
  isSolved = false;
});

resetButton.addEventListener("click", () => {
  for (let i = 0; i < 81; i++) {
    const elm = document.getElementById(`cell-${i}`);
    elm.style.color = "black";
    elm.value = "";
  }
});
