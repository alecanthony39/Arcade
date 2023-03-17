let table = document.querySelector("table");
let score = 0;
let scoreDisplay = document.querySelector("#score");
let start = document.querySelector("#start");
let reset = document.querySelector("#reset");
let interval = 600;
let intervalId = 0;
let bestScore = 0;
let bestScoreDisplay = document.querySelector("#highScore");

let snake = {
  body: [
    {
      row: 1,
      column: 1,
    },
  ],
  nextDirection: [1, 0],
  color: "red",
};

let fruit = {
  location: [
    {
      row: 3,

      column: 4,
    },
  ],
};

let powerUp = {
  location: [
    {
      row: Math.floor(Math.random() * 8),
      column: Math.floor(Math.random() * 8),
    },
  ],
  color: "green",
};

function makeBoard() {
  for (let i = 0; i < 8; i++) {
    const tr = document.createElement("tr");
    table.appendChild(tr);
    for (let j = 0; j < 8; j++) {
      const td = document.createElement("td");
      if (tileBelongsToSnakeBody(i, j, snake.body) === true) {
        td.className = "snake";
        td.style.backgroundColor = snake.color;
      }
      if (tileBelongsToFruit(i, j, fruit.location) === true) {
        td.className = "fruit";
        td.style.backgroundColor = "aqua";
      }
      if (tileBelongsToPowerUp(i, j, powerUp.location) === true) {
        td.className = "powerUp";
        td.style.backgroundColor = powerUp.color;
      }
      tr.appendChild(td);

      if (
        (j % 2 === 1) &
        (i % 2 === 0) &
        (td.className !== "snake") &
        (td.className !== "fruit") &
        (td.className !== "powerUp")
      ) {
        td.style.backgroundColor = "black";
      } else if (
        (j % 2 === 0) &
        (i % 2 === 1) &
        (td.className !== "snake") &
        (td.className !== "fruit") &
        (td.className !== "powerUp")
      ) {
        td.style.backgroundColor = "black";
      }
    }
  }
}

function resetBoard() {
  table.innerHTML = "";
}

function hardReset() {
  resetBoard();
  snake.body = [
    {
      row: 1,
      column: 1,
    },
  ];

  fruit.location = [
    {
      row: 3,

      column: 4,
    },
  ];

  snake.nextDirection = [1, 0];
  score = 0;

  scoreDisplay.innerText = 0;
  makeBoard();
}

reset.addEventListener("click", hardReset);

function tileBelongsToSnakeBody(rows, cols, snakeBody) {
  for (let i = 0; i < snakeBody.length; i++) {
    if (snakeBody[i].column === cols && snakeBody[i].row === rows) {
      return true;
    }
  }
}

function tileBelongsToPowerUp(rows, cols, location) {
  for (let i = 0; i < location.length; i++) {
    if (location[i].column === cols && location[i].row === rows) {
      return true;
    }
  }
}

function tileBelongsToFruit(rows, cols, location) {
  for (let i = 0; i < location.length; i++) {
    if (location[i].column === cols && location[i].row === rows) {
      return true;
    }
  }
}

function move() {
  let nextSeg = {
    ...snake.body[0],
  };
  let gameOver = false;
  nextSeg.column += snake.nextDirection[0];
  nextSeg.row += snake.nextDirection[1];
  snake.body.unshift(nextSeg);

  if (
    nextSeg.row > 7 ||
    nextSeg.row < 0 ||
    nextSeg.column > 7 ||
    nextSeg.column < 0
  ) {
    gameOver = true;
  }

  for (let i = 1; i < snake.body.length; i++) {
    if (
      snake.body[0].row === snake.body[i].row &&
      snake.body[0].column === snake.body[i].column
    ) {
      gameOver = true;
    }
  }
  if (gameOver === true) {
    clearInterval(intervalId);
    alert("Game Over! You Scored" + " " + score);

    return;
  }
  if (
    snake.body[0].row === powerUp.location[0].row &&
    snake.body[0].column === powerUp.location[0].column
  ) {
    fruitEaten();
  }
  if (
    snake.body[0].row === fruit.location[0].row &&
    snake.body[0].column === fruit.location[0].column
  ) {
    fruitEaten();
  } else {
    snake.body.pop();
  }
  resetBoard();
  makeBoard();
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowRight") {
    snake.nextDirection[0] = 1;
    snake.nextDirection[1] = 0;
  } else if (event.key === "ArrowLeft") {
    snake.nextDirection[0] = -1;
    snake.nextDirection[1] = 0;
  } else if (event.key === "ArrowUp") {
    snake.nextDirection[1] = -1;
    snake.nextDirection[0] = 0;
  } else if (event.key === "ArrowDown") {
    snake.nextDirection[1] = 1;
    snake.nextDirection[0] = 0;
  }
});

function spawnFruit() {
  fruit.location[0].row = Math.floor(Math.random() * 8);
  fruit.location[0].column = Math.floor(Math.random() * 8);
}

function spawnPowerUp() {
  powerUp.location[0].row = Math.floor(Math.random() * 8);
  powerUp.location[0].column = Math.floor(Math.random() * 8);
}

function fruitEaten() {
  if (
    snake.body[0].row === fruit.location[0].row &&
    snake.body[0].column === fruit.location[0].column
  ) {
    spawnFruit();
    score++;

    interval += 50;

    scoreDisplay.innerText = score;
  }
  if (
    snake.body[0].row === powerUp.location[0].row &&
    snake.body[0].column === powerUp.location[0].column
  ) {
    spawnPowerUp();
    score++;
    interval -= 50;
    scoreDisplay.innerText = score;
  }
  if (score > bestScore) {
    bestScore = score;
    bestScoreDisplay.innerText = bestScore;
  }
}

let select = document.querySelector("#select");

select.addEventListener("change", function (event) {
  let diff = event.target.value;

  if (diff === "Easy") {
    interval = 600;
  } else if (diff === "Medium") {
    interval = 450;
  } else if (diff === "hard") {
    interval = 150;
  }
  console.log(interval);
});

start.addEventListener("click", function () {
  makeBoard();
  intervalId = setInterval(move, interval);
  console.log(interval);
});
