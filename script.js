"use strict";

class Beetlemorph {
  constructor(game, x, y) {
    this.game = game;
    this.width = 60;
    this.height = 60;
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.lives = 2;
    this.dead = false;
    // Sprite sheet details
    this.frameWidth = 80;
    this.frameHeight = 80;
    this.currentFrameX = 0;
    this.frameY = 0;
    this.spritSheetColumns = 3;
    this.image = new Image();
    this.image.src = "./images/beetlemorph.png";

    // Animation control
    this.frameInterval = 100;
    this.frameCounter = 0;
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.currentFrameX * this.frameWidth * 0.7, // Correct the frame positioning
      this.frameY,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update() {
    this.game.projectiles.forEach((projectile) => {
      if (
        !projectile.ready &&
        this.game.checkCollision(this, projectile) &&
        this.lives > 0
      ) {
        console.log(this.game.enemies);
        projectile.reset();
        this.lives--;
      }

      if (this.lives < 1 && !this.dead) {
        this.updateFrame();
        if (this.currentFrameX > 2) {
          this.dead = true;
          this.game.score++;
        }
      }
    });
    this.y += this.game.background.speed + this.speed;
  }

  updateFrame() {
    // Increment the frame counter
    this.frameCounter++;

    // Only change frames when frameCounter reaches the frameInterval
    if (this.frameCounter >= this.frameInterval) {
      this.frameCounter = 0; // Reset the frame counter

      this.currentFrameX = this.currentFrameX + 1;
    }
  }
}

class Projectile {
  constructor() {
    this.width = 3;
    this.height = 15;
    this.x = 0;
    this.y = 0;
    this.speed = 8;
    this.ready = true;
  }

  draw(context) {
    if (!this.ready) context.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    if (this.y + this.height < 0) {
      this.ready = true;
      return;
    }
    if (!this.ready) this.y -= this.speed;
  }

  start(x, y) {
    this.x = x;
    this.y = y;
    this.ready = false;
  }

  reset() {
    this.ready = true;
  }
}

class Shooter {
  constructor(game) {
    this.game = game;
    this.width = 180;
    this.height = 136;
    this.x = game.canvas.width * 0.5 - this.width * 0.5;
    this.y = game.canvas.height - (this.height + this.height * 0.5);
    this.speed = 8;
    this.lives = 3;
    this.leftShooter = this.width - 148;
    this.rightShooter = 148;
    this.image = new Image();
    this.image.src = "./images/ship.png";

    // thrust
    this.thrustFrameWidth = 48;
    this.thrustframeHeight = 48;
    this.currentFrameX = 0;
    this.thrustWidth = 40;
    this.thrustHeight = 40;
    this.spritSheetColumns = 3;
    this.thrustImage = new Image();
    this.thrustImage.src = "./images/thrust.png";

    // Animation control
    this.frameInterval = 3; // Change frames every 10 game loops (adjust this to slow down)
    this.frameCounter = 0;
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);

    const sheetX = this.currentFrameX * this.thrustFrameWidth;
    context.drawImage(
      this.thrustImage,
      sheetX,
      0,
      this.thrustFrameWidth,
      this.thrustframeHeight,
      this.x + this.width * 0.5 - this.thrustWidth * 0.5,
      this.y + 115,
      this.thrustWidth,
      this.thrustHeight
    );
  }

  move() {
    this.updateFrame();
    if (this.game.keys.includes("ArrowLeft")) {
      if (this.x <= 0) return;
      this.x -= this.speed;
    }
    if (this.game.keys.includes("ArrowRight")) {
      if (this.x >= this.game.canvas.width - this.width) return;
      this.x += this.speed;
    }
  }

  updateFrame() {
    // Increment the frame counter
    this.frameCounter++;

    // Only change frames when frameCounter reaches the frameInterval
    if (this.frameCounter >= this.frameInterval) {
      this.frameCounter = 0; // Reset the frame counter
      this.currentFrameX = (this.currentFrameX + 1) % this.spritSheetColumns;
    }
  }

  projectileStartPoint() {
    let postion = [this.x + this.width * 0.5, this.y + this.height * 0.4];
    if (this.game.keys.includes("ArrowLeft")) {
      postion[0] = this.x + this.leftShooter;
    }
    if (this.game.keys.includes("ArrowRight")) {
      postion[0] = this.x + this.rightShooter;
    }

    return postion;
  }

  shoot() {
    const [x, y] = this.projectileStartPoint();
    for (let i = 0; i < this.game.projectiles.length; i++) {
      let projectile = this.game.projectiles[i];
      if (projectile.ready) {
        projectile.start(x, y);
        break;
      }
    }
  }
}

class Background {
  constructor(game) {
    this.game = game;
    this.image = new Image();
    this.image.src = "./images/background_2.jpeg"; // Your space background image
    this.width = this.game.canvas.width;
    this.height = this.game.canvas.height;

    // Y position for vertical scrolling
    this.y1 = 0;
    this.y2 = -this.height; // Second background placed above the first one for looping effect
    this.speed = 2; // Scrolling speed
  }

  draw(context) {
    // Draw two images: one on screen and one above the screen to simulate continuous scrolling
    context.drawImage(this.image, 0, this.y1, this.width, this.height);
    context.drawImage(this.image, 0, this.y2, this.width, this.height);
  }

  update() {
    // Move both background images downward (or upward if you want reverse scrolling)
    this.y1 += this.speed;
    this.y2 += this.speed;

    // When the first image moves completely off the screen, reset its position
    if (this.y1 >= this.height) {
      this.y1 = -this.height;
    }
    if (this.y2 >= this.height) {
      this.y2 = -this.height;
    }
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.background = new Background(this);
    this.score = 0;
    this.level = 1;
    this.gameOver = false;

    this.shooter = new Shooter(this);
    this.projectiles = [];
    this.numberOfProjecties = 10;
    this.createProjectiles();
    this.fired = false;

    this.keys = [];

    this.enemies = [];
    this.numberOfEnemies = 4;

    document.addEventListener("keydown", (e) => {
      if (!this.keys.includes(e.key)) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          this.keys.push(e.key);
        }

        if (e.key === " " && !this.fired) {
          this.shooter.shoot();
          this.fired = true;
        }
      }
    });

    document.addEventListener("keyup", (e) => {
      this.fired = false;
      const index = this.keys.indexOf(e.key);
      if (index > -1) this.keys.splice(index, 1);
    });
  }

  render(context) {
    this.background.update(); // Update background position
    this.background.draw(context); // Draw the scrolling background

    this.projectiles.forEach((projectile) => {
      projectile.draw(context);
      projectile.move();
    });

    if (this.enemies.length < 1) this.createEnemies();

    this.enemies = this.enemies.filter((enemy) => !enemy.dead);

    this.enemies.forEach((enemy) => {
      enemy.draw(context);
      enemy.update();
    });

    this.shooter.draw(context);
    this.shooter.move();
  }

  createProjectiles() {
    for (let i = 0; i < this.numberOfProjecties; i++) {
      this.projectiles.push(new Projectile());
    }
  }

  createEnemies() {
    let x = 0;
    let y = 0;
    for (let i = 0; i < this.numberOfEnemies; i++) {
      if (x + 50 >= this.width) {
        x = 0;
        y -= 100;
      } else {
        x += 100;
      }
      this.enemies.push(new Beetlemorph(this, x, -(Math.random() * 600)));
    }
  }

  checkCollision(alien, projectile) {
    return (
      projectile.y <= alien.y + alien.height &&
      projectile.y + projectile.height >= alien.y && // Ensure it's in alien's vertical range
      projectile.x + projectile.width > alien.x &&
      projectile.x < alien.x + alien.width
    );
  }
}

const canvas = document.getElementById("myCanvas");
window.addEventListener("load", () => {
  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = window.innerHeight;
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  ctx.font = "30px Impact";
  const game = new Game(canvas);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
