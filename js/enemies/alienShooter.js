import SpriteSheet from "../SpriteSheet.js";

export default class AlienShooter {
  constructor(game, x, y) {
    this.game = game;
    this.width = 354;
    this.height = 318;
    this.x = x + this.width >= this.game.width ? x - this.width : x;
    this.y = y;
    this.speedX = 5;
    this.speedY = 2;
    this.maxLives = 5;
    this.lives = this.maxLives;
    this.status = "passive";
    this.dead = false;

    this.passiveSpriteSheet = new SpriteSheet(new Image(), 100, 354, 318, 7, 4);
    this.shootingSpriteSheet = new SpriteSheet(new Image(), 50, 354, 354, 5, 5);
    this.dyingSpriteSheet = new SpriteSheet(new Image(), 50, 354, 318, 7, 2);

    // Load images for each sprite sheet
    this.shootingSpriteSheet.image.src = "./images/gun-alien-firing.png";
    this.dyingSpriteSheet.image.src = "./images/gun-alien-dying.png";
    this.passiveSpriteSheet.image.src = "./images/gun-alien-passive.png";

    this.passiveSpriteSheet.width = this.passiveSpriteSheet.width / 2;
    this.passiveSpriteSheet.height = this.passiveSpriteSheet.height / 2;
    this.dyingSpriteSheet.width = this.dyingSpriteSheet.width / 2;
    this.dyingSpriteSheet.height = this.dyingSpriteSheet.height / 2;
    this.shootingSpriteSheet.width = this.shootingSpriteSheet.width / 2;
    this.shootingSpriteSheet.height = this.shootingSpriteSheet.height / 2;

    // Set the current sprite sheet to moving by default
    this.currentSpriteSheet = this.passiveSpriteSheet;

    // Sound explosion
    this.monsterScream = new Audio("./sounds/enemy-death.wav"); // Load sound file
    this.monsterScream.volume = 1; // Adjust volume (optional)

    // Shooting control
    this.shootCooldown = 30; // Set this to the desired cooldown duration
    this.shootCooldownCounter = 0; // Timer to track the cooldown
  }

  draw(context) {
    if (this.dead) return;

    switch (this.status) {
      case "dying":
        this.currentSpriteSheet = this.dyingSpriteSheet;
        break;
      case "firing":
        this.currentSpriteSheet = this.shootingSpriteSheet;
        break;
      case "passive":
      default:
        this.currentSpriteSheet = this.passiveSpriteSheet;
        break;
    }

    // Draw the current frame of the selected sprite sheet
    if (this.currentSpriteSheet)
      this.currentSpriteSheet.draw(context, this.x, this.y);

    context.save();

    // Draw the outline (border) of the rectangle above the enemy
    const rectWidth = 50;
    const rectHeight = 10;
    const rectX = this.x + (this.width - rectWidth) / 2; // Center the rectangle above the enemy
    const rectY = this.y - 10; // Position 20 pixels above the enemy's y-coordinate

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

    const shooterPosition = this.game.shooter.x + this.game.shooter.width * 0.5;

    if (shooterPosition >= this.x && shooterPosition <= this.x + this.width) {
      this.status = "firing";
    } else {
      this.status = "passive";
    }

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
      // Play sound
      this.monsterScream.currentTime = 0; // Reset sound to start (in case it's still playing)
      this.monsterScream.play(); // Play sound
      this.status = "dying";
    }

    if (
      this.status === "dying" &&
      this.currentSpriteSheet.currentFrameX ===
        this.currentSpriteSheet.framesX - 1 &&
      this.currentSpriteSheet.currentFrameY ===
        this.currentSpriteSheet.framesY - 1
    ) {
      this.dead = true; // Only set dead when the last frame of the dying sprite sheet is reached
    }

    if (this.shootCooldownCounter > 0) {
      this.shootCooldownCounter--; // Decrease the cooldown timer each frame
    }

    if (this.game.shooter.lives > 0) {
      if (
        this.status === "firing" &&
        this.currentSpriteSheet.currentFrameX ===
          this.currentSpriteSheet.framesX - 2 &&
        this.currentSpriteSheet.currentFrameY ===
          this.currentSpriteSheet.framesY - 2 &&
        this.shootCooldownCounter === 0 // Only shoot if cooldown has expired
      ) {
        this.shoot();
        this.shootCooldownCounter = this.shootCooldown; // Reset the cooldown timer
      }
    } else {
      this.status = "passive";
    }

    this.height = this.currentSpriteSheet.height;
    this.width = this.currentSpriteSheet.width;

    if (this.status === "passive") this.move();
  }

  move() {
    // if (this.y < 0 && this.y >= this.height * -1) this.speedY = 10;
    // else this.speedY = 2;

    // Ensure aliens only move horizontally if their y position is 0 or higher
    if (this.y >= 20) {
      const otherEnemies = this.game.enemies.filter((enemy) => enemy !== this);

      // Check for potential collisions with other aliens
      const willCollideWithAnotherAlien = otherEnemies.some((enemy) => {
        const futureX = this.x + this.speedX;

        const horizontalOverlap =
          futureX < enemy.x + enemy.width && futureX + this.width > enemy.x;

        const verticalOverlap =
          this.y < enemy.y + enemy.height && this.y + this.height > enemy.y;

        return horizontalOverlap && verticalOverlap;
      });

      // Check if the alien hits the game screen edges
      const willHitEdge =
        this.x + this.speedX + this.width > this.game.width ||
        this.x + this.speedX < 0;

      // Move horizontally if no collision and no edge hit
      if (!willCollideWithAnotherAlien && !willHitEdge) {
        this.x += this.speedX;
      } else {
        // Reverse direction and move down if a collision or edge is detected
        this.speedX *= -1; // Reverse horizontal direction
        // this.y += this.speedY; // Move down by half the height when changing direction
      }
    }

    // Continue moving downwards until y reaches 0
    else {
      // this.y += this.speedY; // Move down until y is 0 or higher
      this.y += 5;
    }
  }

  shoot() {
    const x = this.x + 20;
    const y = this.y + this.shootingSpriteSheet.height * 0.8;

    for (let i = 0; i < this.game.alienProjectiles.length; i++) {
      let projectile = this.game.alienProjectiles[i];
      if (projectile.ready) {
        projectile.start(x, y);
        this.game.alienProjectiles[i + 1].start(this.x + this.width - 20, y);
        return;
      }
    }
  }
}
