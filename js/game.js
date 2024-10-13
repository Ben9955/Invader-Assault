import Background from "./background.js";
import Shooter from "./shooter.js";
import Projectile from "./projectiles/projectile.js";
import Beetlemorph from "./enemies/beetlemorph.js";
import AlienShooter from "./enemies/alienShooter.js";
import Blob from "./enemies/blob.js";
import Boss from "./enemies/boss.js";
import BossBullet from "./projectiles/bossBullet.js";
import AlienBullet from "./projectiles/alienBullet.js";
import Asteroid from "./spaceObjects/asteroid.js";
import Comet from "./spaceObjects/comet.js";
import PowerUp from "./powerUp.js";

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.background = new Background(this);
    this.score = 0;
    this.level = 1;
    this.gameOver = false;
    this.keys = [];

    this.shooter = new Shooter(this);

    this.projectiles = [];
    this.bossProjectiles = [];
    this.alienProjectiles = [];
    this.numberOfProjecties = 8;
    this.createProjectiles();
    this.fired = false;

    this.enemies = [];
    this.asteroid = new Asteroid(this);

    this.levels = [
      //  levels configuration
      {
        Beetlemorph: 5,
      },
      {
        Beetlemorph: 3,
      },
      {
        Blob: 3,
        // AlienShooter: 2,
      },
      {
        Beetlemorph: 2,
        // Blob: 2,
        // AlienShooter: 2,
      },
      {
        // Beetlemorph: 2,
        // Blob: 2,
        AlienShooter: 2,
      },

      { Boss: 1 },
    ];
    this.currentLevel = 3;

    this.powerUps = [];

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

    this.createEnemies();
  }

  render(context, timeElapsed) {
    if (this.enemies.length === 0) this.nextLevel();
    this.background.update(); // Update background position
    this.background.draw(context); // Draw the scrolling background

    this.projectiles.forEach((projectile) => {
      projectile.draw(context);
      projectile.move();
    });

    this.bossProjectiles.forEach((projectile) => {
      projectile.draw(context);
      projectile.move();
    });

    this.alienProjectiles.forEach((projectile) => {
      projectile.draw(context);
      projectile.move();
    });

    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.dead;
    });

    this.powerUps.forEach((powerUp) => {
      powerUp.update();
      powerUp.draw(context);
    });

    if (!this.asteroid.exploded) {
      this.asteroid.draw(context);
      this.asteroid.update(timeElapsed);
    }

    this.enemies.forEach((enemy) => {
      enemy.draw(context);
      enemy.update(timeElapsed);
    });

    this.drawStatusText(context);

    this.shooter.draw(context);
    this.shooter.update(timeElapsed);
  }

  createProjectiles() {
    for (let i = 0; i < this.numberOfProjecties; i++) {
      this.projectiles.push(new Projectile());
      this.bossProjectiles.push(new BossBullet(this));
      this.alienProjectiles.push(new AlienBullet(this));
    }
  }

  createEnemies() {
    console.log(this.levels.length, this.currentLevel);
    const occupiedPositions = []; // Store occupied x positions

    const level = this.levels[this.currentLevel - 1];
    for (let enemyType in level) {
      const numberOfEnemies = level[enemyType];

      for (let i = 0; i < numberOfEnemies; i++) {
        let enemy; // Declare the enemy variable
        let x, y; // Default y position
        let isPositionValid = false;

        // Create the enemy instance once
        enemy = this.createAlien(enemyType, 0, y); // Initialize at (0, y)
        enemy.y = Math.random() * enemy.height * -1;
        while (!isPositionValid) {
          // Randomly generate an x position ensuring it stays within the canvas width
          x = Math.random() * (this.width - enemy.width); // Ensure it fits within the canvas
          enemy.x = x; // Update enemy's x position

          // Check if the new enemy overlaps with already occupied positions
          if (
            !this.checkCollisionWithOccupiedPositions(enemy, occupiedPositions)
          ) {
            occupiedPositions.push({ x: enemy.x, width: enemy.width }); // Store the valid position
            isPositionValid = true; // Valid position found
          }
        }

        this.enemies.push(enemy); // Finally, add the valid enemy to the enemies array
      }
    }
  }

  // Check if the new enemy overlaps with occupied positions
  checkCollisionWithOccupiedPositions(newEnemy, occupiedPositions) {
    for (let occupied of occupiedPositions) {
      if (
        newEnemy.x < occupied.x + occupied.width &&
        newEnemy.x + newEnemy.width > occupied.x
      ) {
        return true; // There is an overlap
      }
    }
    return false; // No overlap
  }

  createAlien(type, x, y) {
    let enemy;
    switch (type) {
      case "Beetlemorph":
        enemy = new Beetlemorph(this, x, y);
        break;

      case "Blob":
        enemy = new Blob(this, x, y);
        break;
      case "AlienShooter":
        enemy = new AlienShooter(this, x, y);
        break;
      case "Boss":
        enemy = new Boss(this, x, y); // Boss might have specific positioning
        break;
      default:
        console.log(
          "Alien type Error in the createAlien method of the Game class"
        ); // Default to Beetlemorph
        break;
    }

    return enemy;
  }

  checkCollision(target, projectile) {
    return (
      projectile.y <= target.y + target.height &&
      projectile.y + projectile.height >= target.y && // Ensure it's in alieen's vertical range
      projectile.x + projectile.width > target.x &&
      projectile.x < target.x + target.width
    );
  }

  drawStatusText(context) {
    context.save();
    context.shadowOffsetX = 2;
    context.shadowOffsetY = 2;
    context.shadowColor = "black";
    context.fillText("Score " + this.score, 20, 40);
    context.fillText("Level " + this.currentLevel, this.width - 100, 40);
    for (let i = 0; i < this.shooter.lives; i++) {
      context.fillRect(20 + 20 * i, 60, 10, 20);
    }
    if (this.gameOver) {
      context.textAlign = "center";
      context.font = "100px Impact";
      context.fillText("GAME OVER!", this.width * 0.5, this.height * 0.5);
      context.font = "20px Impact";
      context.fillText(
        "Press R to restart!",
        this.width * 0.5,
        this.height * 0.5 + 30
      );
    }

    context.restore();
  }

  // Move to next level
  nextLevel() {
    this.currentLevel++;
    if (this.currentLevel <= this.levels.length) {
      this.createEnemies();
    } else {
      this.winGame(); // Trigger win condition when all levels are completed
    }
  }

  generatePowerUp(x, y) {
    this.powerUps.push(new PowerUp(this, x, y));
  }

  removePowerUp(powerup) {
    this.powerUps = this.powerUps.filter((powerUp) => !powerup);
  }
}
