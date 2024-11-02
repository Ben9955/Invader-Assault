import Background from "./background.js";

//aliens
import Beetlemorph from "./enemies/beetlemorph.js";
import Blob from "./enemies/blob.js";
import AlienShooter from "./enemies/alienShooter.js";
import Boss from "./enemies/boss.js";

import Asteroid from "./spaceObjects/asteroid.js";
import PowerUp from "./powerUp.js";

//spaceships
import Bomber from "./spaceships/bomber.js";
import Fighter from "./spaceships/fighter.js";
import Corvette from "./spaceships/corvette.js";

export default class Game {
  constructor(canvas, currentUser) {
    this.currentUser = currentUser;
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.background = new Background(this);
    this.score = this.currentUser.progress.currentScore;
    this.experiencePoints = this.currentUser.experiencePoints;
    this.gameOver = false;
    this.gameWon = false;
    this.levelFinished = false;
    this.keys = [];
    this.spaceShips = {
      bomber: Bomber,
      corvette: Corvette,
      fighter: Fighter,
    };

    // Create a shooter based on the user's selected spaceship
    this.shooter = new this.spaceShips[this.currentUser.spashipSelected](
      this,
      this.currentUser.progress.livesRemaining
    );

    // Flag to prevent multiple shots
    this.fired = false;

    this.enemies = [];
    // Define levels and their respective enemies
    this.levels = [
      {
        Beetlemorph: 5,
      },
      {
        Beetlemorph: 5,
        Blob: 1,
      },
      {
        Beetlemorph: 8,
        AlienShooter: 1,
      },
      {
        Beetlemorph: 5,
        Blob: 1,
        AlienShooter: 1,
      },
      {
        Beetlemorph: 7,
        Blob: 2,
        AlienShooter: 2,
      },
      {
        Beetlemorph: 4,
        AlienShooter: 2,
        Blob: 3,
      },
      {
        Beetlemorph: 5,
        Blob: 2,
        AlienShooter: 4,
      },
      {
        Beetlemorph: 7,
        Blob: 4,
        AlienShooter: 3,
      },
      {
        Boss: 1,
      },
    ];
    // Current level of the user
    this.currentLevel = this.currentUser.progress.currentLevel;
    this.totalEnemiesInCurrentLevel = 0;
    this.enemiesDefeatedInCurrentLevel = 0;

    this.asteroidPool = [];
    this.activeAsteroids = [];
    this.generateAsteroids();
    // asteroid generation cooldown
    this.asteroidSpawnCooldown = 1000; // 1 second cooldown
    this.timeSinceLastAsteroid = 0; // Tracks time since the last asteroid attempt

    this.powerUpsPool = [];
    this.activePowerUps = [];
    this.generatePowerUps();
    this.createEnemies();

    // sounds
    this.nextLevelSound = new Audio("../assets/sounds/level-finished.mp3");
    this.nextLevelSound.volume = 0.8;
    this.gameOverSound = new Audio("../assets/sounds/game-over.mp3");
    this.gameOverSound.volume = 0.8;
    this.gameWonSound = new Audio("../assets/sounds/gameWon.mp3");
    this.gameWonSound.volume = 0.8;

    // Event listener for keydown events
    document.addEventListener("keydown", (e) => {
      if (this.gameOver || this.gameWon || this.levelFinished) return;
      if (!this.keys.includes(e.key)) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          this.keys.push(e.key);
        }

        // Shoot if space is pressed and not already fired
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

  // Render the game state
  render(context, timeElapsed) {
    if (this.gameOver) return;

    if (this.enemies.length === 0 && this.currentLevel < this.levels.length)
      this.shooter.goToNextLevel();

    if (this.currentLevel === this.levels.length && this.enemies.length === 0) {
      this.playGameWonSound();
      this.gameWon = true; // Trigger win condition when all levels are completed
    }

    this.background.update(); // Update background position
    this.background.draw(context); // Draw the scrolling background

    // Handle asteroids
    this.setAsteroidToActive(timeElapsed);
    this.removeAsteroid();
    this.drawAndUpdateActiveAsteroids(context, timeElapsed);

    // Handle power-ups
    this.setPowerUpToActive(timeElapsed);
    this.drawAndUpdateActivePowerUps(context);

    // Filter out dead enemies
    this.enemies = this.enemies.filter((enemy) => {
      return !enemy.dead;
    });

    this.enemies.forEach((enemy) => {
      enemy.draw(context);
      enemy.update(timeElapsed);
    });

    // Draw status text on the canvas
    this.drawStatusText(context);

    // Update and draw the player's shooter
    this.shooter.draw(context);
    this.shooter.update(timeElapsed);
  }

  // Create enemies based on the current level
  async createEnemies() {
    const level = this.levels[this.currentLevel - 1];
    for (let enemyType in level) {
      const numberOfEnemies = level[enemyType];
      this.totalEnemiesInCurrentLevel += numberOfEnemies;

      for (let i = 0; i < numberOfEnemies; i++) {
        let collisionDetected = true;
        const enemy = this.createAlien(enemyType, 0, 0);
        let x, y;

        do {
          // Randomly generate an x position ensuring it stays within the canvas width
          x = Math.random() * (this.width - enemy.width);
          y = Math.random() * (-enemy.height * 1) - enemy.height * i;
          if (this.enemies.length < 1) break;

          // Check for collisions with existing enemies
          collisionDetected = this.enemies.some((existingEnemy) =>
            this.checkCollision(existingEnemy, {
              height: enemy.height,
              width: enemy.width,
              x,
              y,
            })
          );

          // Delay for 1000 milliseconds if a collision is detected
          if (collisionDetected) {
            await this.delay(1000);
          }
        } while (collisionDetected);

        enemy.x = x;
        enemy.y = y;

        this.enemies.push(enemy);
      }
    }
  }

  //  method for delaying
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Create an alien instance based on its type
  createAlien(type, x, y) {
    let enemy;
    switch (type) {
      case "AlienShooter":
        enemy = new AlienShooter(this, x, y);
        break;
      case "Beetlemorph":
        enemy = new Beetlemorph(this, x, y);
        break;
      case "Blob":
        enemy = new Blob(this, x, y);
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

  // Check for collision between a target1 (like an enemy) and a target2(like projectile)
  checkCollision(target1, target2) {
    return (
      target2.y <= target1.y + target1.height &&
      target2.y + target2.height >= target1.y &&
      target2.x + target2.width > target1.x &&
      target2.x < target1.x + target1.width
    );
  }

  // Draw status text on the canvas (level, score, lives, and experience points)
  drawStatusText(context) {
    context.fillText("Level " + this.currentLevel, 20, 40);
    context.fillText("Score " + this.score, 20, 60);
    for (let i = 0; i < this.shooter.lives; i++) {
      context.fillRect(20 + 20 * i, 70, 10, 20);
    }
    context.fillText("XP " + this.experiencePoints, 20, 115);
  }

  // Move to next level
  nextLevel() {
    if (this.currentLevel < this.levels.length) {
      this.currentLevel++;
      this.createEnemies();
      this.shooter.resetPosition();
    }
  }

  // Generate an initial pool of asteroids for gameplay
  generateAsteroids() {
    for (let i = 0; i < 5; i++) {
      this.asteroidPool.push(new Asteroid(this));
    }
  }

  // Activate an asteroid if conditions and cooldown are met
  setAsteroidToActive(timeElapsed) {
    this.timeSinceLastAsteroid += timeElapsed;

    if (this.timeSinceLastAsteroid >= this.asteroidSpawnCooldown) {
      const random = Math.random();
      if (random <= 0.1 && this.activeAsteroids.length < 5) {
        const asteroid = this.asteroidPool.find((a) => a.ready);
        if (asteroid) {
          asteroid.x = Math.random() * (this.width - asteroid.width);
          asteroid.ready = false;
          this.activeAsteroids.push(asteroid);
        }
      }
      this.timeSinceLastAsteroid = 0; // Reset the timer after checking
    }
  }

  // Draw and update all active asteroids
  drawAndUpdateActiveAsteroids(context, timeElapsed) {
    this.activeAsteroids.forEach((asteroid) => {
      if (!asteroid.ready) {
        asteroid.draw(context);
        asteroid.update(timeElapsed);
      }
    });
  }

  // Remove asteroids that are no longer active
  removeAsteroid() {
    this.activeAsteroids = this.activeAsteroids.filter(
      (asteroid) => !asteroid.ready
    );
  }

  // Generate an initial pool of power-ups for gameplay
  generatePowerUps() {
    const types = ["health", "upgrade", "xp"];

    for (let i = 0; i < types.length; i++) {
      this.powerUpsPool.push(new PowerUp(this, types[i]));
    }
  }

  // Activate a power-up based on random chance and cooldown
  setPowerUpToActive(timeElapsed) {
    this.timeSinceLastAsteroid += timeElapsed;

    if (this.timeSinceLastAsteroid >= this.asteroidSpawnCooldown) {
      const random = Math.random();
      if (
        random <= 0.2 &&
        this.activePowerUps.length < this.powerUpsPool.length
      ) {
        const randomIndex = Math.floor(
          Math.random() * this.powerUpsPool.length
        );
        const powerup = this.powerUpsPool[randomIndex];
        if (powerup) {
          powerup.x = Math.random() * (this.width - powerup.width);
          powerup.ready = false;
          this.activePowerUps.push(powerup);
        }
      }
      this.timeSinceLastAsteroid = 0;
    }
  }

  // Draw and update all active power-ups
  drawAndUpdateActivePowerUps(context) {
    this.activePowerUps.forEach((powerUp) => {
      if (!powerUp.ready) {
        powerUp.draw(context);
        powerUp.update();
      }
    });
  }

  // Remove a specific power-up from the active list
  removePowerUp(powerUp) {
    const index = this.activePowerUps.indexOf(powerUp);
    if (index > -1) {
      this.activePowerUps.splice(index, 1); // Remove the power-up from the array
    }
  }

  // Add experience points to the player
  addExperiencePoints(xpPoints) {
    this.experiencePoints += xpPoints;
  }

  // Play the sound when moving to the next level
  playNextLevelSound() {
    this.nextLevelSound.currentTime = 0;
    this.nextLevelSound.play();
  }

  // Play the sound for game over
  playGameOverSound() {
    this.gameOverSound.currentTime = 0;
    this.gameOverSound.play();
  }

  // Play the sound for game won
  playGameWonSound() {
    this.gameWonSound.currentTime = 0;
    this.gameWonSound.play();
  }
}
