// HTML Elements
const board = document.getElementById('game-board');
const startBtn = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

//fonction qui crée les element snake et food
function createElement(tag, className) {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}
//fonction qui genere les coordonnées sur la grille des elements snake et food
function setPosition(element, position) {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
}

class Snake {
  constructor() {
    this.snakeBody = [{ x: 10, y: 10 }];
    this.direction = 'right';
    this.controlSnake();
  }

  drawSnake() {
    this.snakeBody.forEach((segment) => {
      const snakeEl = createElement('div', 'snake');
      setPosition(snakeEl, segment);

      board.appendChild(snakeEl);
    });
  }
  controlSnake() {
    document.addEventListener('keydown', (event) => {
     
      if (event.key === 'ArrowRight' && this.direction !== 'left') {
        this.direction = 'right';
      } else if (event.key === 'ArrowLeft' && this.direction !== 'right') {
        this.direction = 'left';
      } else if (event.key === 'ArrowUp' && this.direction !== 'down') {
        this.direction = 'up';
      } else if (event.key === 'ArrowDown' && this.direction !== 'up') {
        this.direction = 'down';
      }
    });
  }
  move() {
    const snakeHead = { ...this.snakeBody[0] };
    switch (this.direction) {
      case 'right':
        snakeHead.x++;
        break;
      case 'left':
        snakeHead.x--;
        break;
      case 'up':
        snakeHead.y--;
        break;
      case 'down':
        snakeHead.y++;
        break;
    }
    this.snakeBody.unshift(snakeHead);

    if (snakeHead.x === food.position.x && snakeHead.y === food.position.y) {
      food = new Food();
    } else {
      this.snakeBody.pop(); //enleve la queue du serpent
    }
  }
}

class Food {
  constructor() {
    this.position = this.generateFoodPosition();
  }

  generateFoodPosition() {
    const x = Math.floor(Math.random() * 20) + 1;
    const y = Math.floor(Math.random() * 20) + 1;
    return { x, y };
  }

  drawFood() {
    const foodEl = createElement('div', 'food');
    let foodPos = this.position;
    setPosition(foodEl, foodPos);
    board.appendChild(foodEl);
  }
}

//initialisation
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;

snake = new Snake();
food = new Food();

function draw() {
  board.innerHTML = '';
  snake.drawSnake();
  food.drawFood();
}
function startGame() {
  gameStarted = true;
  startBtn.style.display = 'none';
  logo.style.display = 'none';

  gameInterval = setInterval(() => {
    snake.move();
    draw();
  }, gameSpeedDelay);
}

startBtn.addEventListener('click', startGame);
