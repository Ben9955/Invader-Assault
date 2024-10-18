import SpriteSheet from "../SpriteSheet.js";
import BossBullet from "../projectiles/bossBullet.js";

export default class Boss {
  constructor(game, x, y) {
    this.game = game;
    this.width = 200;
    this.height = 212;
    this.x = x + this.width >= this.game.width ? x - this.width : x;
    this.y = y;
    this.speed = 5;
    this.speedY = 2;
    this.maxLives = 10;
    this.lives = this.maxLives;
    this.hasShot = false; // Flag to track if the boss has shot during the current frame
    this.status = "firing";
    this.dead = false;
    this.projectiles = []; // Array to store boss bullets

    this.dyingSpriteSheet = new SpriteSheet(new Image(), 200, 250, 265, 6, 2);
    this.firingSpriteSheet = new SpriteSheet(new Image(), 50, 250, 265, 13, 2);

    // Load images for each sprite sheet
    this.firingSpriteSheet.image.src = "../assets/images/game/boss-firing.png";
    this.dyingSpriteSheet.image.src = "../assets/images/game/boss-dying.png";

    this.currentSpriteSheet = this.firingSpriteSheet;

    this.createProjectiles();
  }

  draw(context) {
    if (this.status === "firing") {
      this.currentSpriteSheet = this.firingSpriteSheet;
      this.projectiles.forEach((projectile) => {
        projectile.draw(context);
        projectile.move();
      });
    } else this.currentSpriteSheet = this.dyingSpriteSheet;

    // Draw the current frame of the selected sprite sheet
    if (this.currentSpriteSheet)
      this.currentSpriteSheet.draw(context, this.x, this.y);
  }

  update(timeElapsed) {
    if (this.dead) return;

    this.currentSpriteSheet.update(timeElapsed);

    if (this.y >= 0) {
      this.game.shooter.projectiles.forEach((projectile) => {
        if (
          !projectile.ready &&
          this.game.checkCollision(this, projectile) &&
          this.lives > 0
        ) {
          projectile.reset();
          this.lives--;
        }
      });
    }

    this.projectiles.forEach((projectile) => {
      if (
        !projectile.ready &&
        this.game.checkCollision(this.game.shooter, projectile)
      ) {
        projectile.reset();
        this.game.shooter.applyDamage(1);
      }
    });

    if (this.lives < 1) {
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

    if (
      this.game.shooter.lives > 0 &&
      this.status === "firing" &&
      this.currentSpriteSheet.currentFrameX === 3 &&
      this.currentSpriteSheet.currentFrameY === 1
    ) {
      if (!this.hasShot) {
        // Check if the boss hasn't shot yet in this frame
        this.shoot();
        this.hasShot = true; // Set the flag to indicate the boss has shot
      }
    } else {
      this.hasShot = false; // Reset the flag when the boss leaves the firing frame
    }

    this.move();
  }

  move() {
    const otherEnemies = this.game.enemies.filter((enemy) => enemy !== this);
    const willCollideWithAnotherAlien = otherEnemies.some((enemy) => {
      const horizontalOverlap =
        this.x + this.speed < enemy.x + enemy.width &&
        this.x + this.speed + this.width > enemy.x;

      const verticalOverlap =
        this.y < enemy.y + enemy.height && this.y + this.height > enemy.y;

      return horizontalOverlap && verticalOverlap;
    });

    if (
      !willCollideWithAnotherAlien &&
      this.x + this.speed + this.width < this.game.width &&
      this.x + this.speed > 0
    ) {
      this.x += this.speed;
    } else {
      this.speed *= -1;
      this.y += this.height * 0.5;
    }
  }

  createProjectiles() {
    for (let i = 0; i < 3; i++) {
      this.projectiles.push(new BossBullet(this.game));
    }
  }

  // shooting
  shoot() {
    const x = this.x + this.width * 0.3;
    const y = this.y + this.height * 0.8;
    for (let i = 0; i < this.projectiles.length; i++) {
      let projectile = this.projectiles[i];
      if (projectile.ready) {
        projectile.start(x, y);
        return;
      }
    }
  }
}
