import SpriteSheet from "../SpriteSheet.js";

export default class Blob {
  constructor(game, x, y) {
    this.game = game;
    this.width = 354;
    this.height = 318;
    this.x = x + this.width >= this.game.width ? x - this.width : x;
    this.y = y;
    this.speedX = 3;
    this.speedY = 2;
    this.maxLives = 10;
    this.lives = this.maxLives;
    this.status = "passive";
    this.dead = false;
    this.isDying = false;

    this.passiveSpriteSheet = new SpriteSheet(new Image(), 100, 200, 244, 9, 4);
    this.explodingSpriteSheet = new SpriteSheet(
      new Image(),
      50,
      300,
      300,
      6,
      2
    );

    // Load images for each sprite sheet
    this.explodingSpriteSheet.image.src = "./images/blob-alien-explode.png";
    this.passiveSpriteSheet.image.src = "./images/blob-alien-passive.png";

    this.passiveSpriteSheet.width = this.passiveSpriteSheet.width / 2;
    this.passiveSpriteSheet.height = this.passiveSpriteSheet.height / 2;
    this.explodingSpriteSheet.width = this.explodingSpriteSheet.width / 2;
    this.explodingSpriteSheet.height = this.explodingSpriteSheet.height / 2;
    // Set the current sprite sheet to moving by default
    this.currentSpriteSheet = this.passiveSpriteSheet;

    // Sound explosion
    this.explosion = new Audio("./sounds/mixkit-sea-mine-explosion-1184.wav"); // Load sound file
    this.explosion.volume = 1; // Adjust volume (optional)
  }

  draw(context) {
    // if (this.y < 0 && this.y >= this.height * -1) this.y += 10;

    if (this.dead) return;
    if (this.status === "passive")
      this.currentSpriteSheet = this.passiveSpriteSheet;
    else this.currentSpriteSheet = this.explodingSpriteSheet;

    // Draw the current frame of the selected sprite sheet
    if (this.currentSpriteSheet)
      this.currentSpriteSheet.draw(context, this.x, this.y);

    context.save();

    // Draw the outline (border) of the rectangle above the enemy
    const rectWidth = 50;
    const rectHeight = 10;
    const rectX = this.x + (this.width - rectWidth) / 2; // Center the rectangle above the enemy
    const rectY = this.y - 20; // Position 20 pixels above the enemy's y-coordinate

    // Draw the rectangle outline (border)
    context.strokeStyle = "black"; // Set the color of the border
    context.lineWidth = 2; // Set the thickness of the border
    context.strokeRect(rectX, rectY, rectWidth, rectHeight); // Draw the border

    // Dynamically fill the rectangle based on enemy's health
    const healthPercent = this.lives / this.maxLives; // Calculate the health percentage
    const fillWidth = rectWidth * healthPercent; // Calculate the width based on the health

    // Draw the filled part inside the rectangle
    context.fillStyle = healthPercent < 0.5 ? "red" : "green"; // Set the fill color (e.g., green for health)
    context.fillRect(rectX, rectY, fillWidth, rectHeight); // Draw the filled rectangle
    context.restore();
  }

  update(timeElapsed) {
    this.currentSpriteSheet.update(timeElapsed);

    this.game.projectiles.forEach((projectile) => {
      if (
        !projectile.ready &&
        this.game.checkCollision(this, projectile) &&
        this.lives > 0
      ) {
        projectile.reset();
        this.lives--;
      }
    });

    if (this.lives < 1) {
      this.status = "exploding";
      // Play sound
      this.explosion.currentTime = 0; // Reset sound to start (in case it's still playing)
      this.explosion.play(); // Play sound
    }

    if (
      this.status === "exploding" &&
      this.currentSpriteSheet.currentFrameX ===
        this.currentSpriteSheet.framesX - 1 &&
      this.currentSpriteSheet.currentFrameY ===
        this.currentSpriteSheet.framesY - 1
    ) {
      this.dead = true; // Only set dead when the last frame of the dying sprite sheet is reached
    }

    this.height = this.currentSpriteSheet.height;
    this.width = this.currentSpriteSheet.width;

    if (this.status === "passive") {
      this.move();
    }
  }

  move() {
    const otherEnemies = this.game.enemies.filter((enemy) => enemy !== this);

    const willCollideWithAnotherAlien = otherEnemies.some((enemy) => {
      const horizontalOverlap =
        this.x + this.speedX < enemy.x + enemy.width &&
        this.x + this.speedX + this.width > enemy.x;

      const verticalOverlap =
        this.y + this.speedY < enemy.y + enemy.height &&
        this.y + this.speedY + this.height > enemy.y;

      return horizontalOverlap && verticalOverlap;
    });

    // Check if the alien hits the game screen edges
    const willHitEdge =
      this.x + this.speedX + this.width > this.game.width ||
      this.x + this.speedX < 0;

    if (!willCollideWithAnotherAlien && !willHitEdge) {
      this.x += this.speedX;
      this.y += this.speedY / 2;
    } else {
      this.speedX *= -1;
      this.y += this.speedY * 2;
    }
  }
}
