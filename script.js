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

////////////////////SNAKE///////////////////////
class Snake {
  constructor() {
    this.snakeBody = [{ x: 10, y: 10 }];
    this.direction = 'right';
    this.asHeaten = false;
  }

  drawSnake() {
    this.snakeBody.forEach((segment) => {
      const snakeEl = createElement('div', 'snake');
      setPosition(snakeEl, segment);

      board.appendChild(snakeEl);
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

    if (!this.asHeaten) {
      // le serpent grandit uniquement si il mange de la nourriture.
      // Voir condition dans la classe "game" donc on enleve la queue s'il n'a pas mangé
      this.snakeBody.pop(); //enleve la queue du serpent
    } else {
      this.asHeaten = false;
    }
  }
}

////////////////////FOOD///////////////////////

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

////////////////////GAME///////////////////////

class Game {
  constructor() {
    this.gameInterval;
    this.gameSpeedDelay = 200;
    this.gameStarted = false;
    this.snake = new Snake();
    this.controllerSnake();
    this.food = new Food();
  }

  start() {
    this.gameStarted = true;
    startBtn.style.display = 'none';
    logo.style.display = 'none';

    this.gameLoop();
  }

  gameLoop() {
    clearInterval(this.gameInterval); //reinitialise l'interval

    this.gameInterval = setInterval(() => {
      this.snake.move();
      this.eatFood();
      if (this.snake.grow) {
        this.increaseSpeed();
      } // increaseSpeed se declenche que si le serpent a mangé( voir dans eatFood)
      this.render();
      this.checkCollision();
    }, this.gameSpeedDelay);
  }

  eatFood() {
    const nextSnakeHead = this.snake.snakeBody[0];
    if (
      nextSnakeHead.x === this.food.position.x &&
      nextSnakeHead.y === this.food.position.y
    ) {
      this.snake.asHeaten = true;
      this.food = new Food();
    }
  }

  render() {
    board.innerHTML = '';
    this.snake.drawSnake();
    this.food.drawFood();
  }

  controllerSnake() {
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' && this.snake.direction !== 'left') {
        this.snake.direction = 'right';
      } else if (
        event.key === 'ArrowLeft' &&
        this.snake.direction !== 'right'
      ) {
        this.snake.direction = 'left';
      } else if (event.key === 'ArrowUp' && this.snake.direction !== 'down') {
        this.snake.direction = 'up';
      } else if (event.key === 'ArrowDown' && this.snake.direction !== 'up') {
        this.snake.direction = 'down';
      }
    });
  }

  checkCollision() {
    const snakeHead = this.snake.snakeBody[0];

    //collision entre la tete et le mur
    if (
      snakeHead.x < 1 ||
      snakeHead.x > 20 ||
      snakeHead.y < 1 ||
      snakeHead.y > 20
    ) {
      this.gameOver();
    }
    //collision entre la tete et le corps du serpent
    for (let i = 1; i < this.snake.snakeBody.length; i++) {
      if (
        snakeHead.x === this.snake.snakeBody[i].x &&
        snakeHead.y === this.snake.snakeBody[i].y
      ) {
        this.gameOver();
      }
    }
  }

  updateScore() {
    const currentScore = this.snake.snakeBody.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
  }

  reset() {
    this.snake = new Snake();
    this.food = new Food();
    this.gameSpeedDelay = 200;
    this.gameStarted = false;
    board.innerHTML = '';
  }

  gameOver() {
    clearInterval(this.gameInterval);
    startBtn.style.display = 'block';
    logo.style.display = 'block';

    this.updateScore();
    this.reset();
  }

  increaseSpeed() {
    if (this.gameSpeedDelay > 150) {
      this.gameSpeedDelay -= 15;
    } else if (this.gameSpeedDelay > 100) {
      this.gameSpeedDelay -= 10;
    } else if (this.gameSpeedDelay > 50) {
      this.gameSpeedDelay -= 5;
    }

    this.gameLoop();
  }
}

//initialisation

game = new Game();
startBtn.addEventListener('click', game.start.bind(game));
