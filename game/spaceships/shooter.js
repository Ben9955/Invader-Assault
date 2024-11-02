export default class Shooter {
  constructor(game, lives) {
    this.game = game;
    this.width = 125; // initial width
    this.height = 125; // initial height
    this.x = this.game.canvas.width * 0.5 - this.width * 0.5;
    this.y = this.game.canvas.height - this.height;
    this.lives = lives;
    this.motionLines = new MotionLines(this);
    this.status = "moving"; // Initial status
    this.projectiles = [];
    this.currentSpriteSheet = null;
    this.upgraded = false;
    this.boostDuration = 10000; // 10 second cooldown
    this.boostTimer = 0;

    // State variables for key presses
    this.isTurningLeft = false;
    this.isTurningRight = false;

    // Sounds
    this.shootSound = new Audio("../assets/sounds/attack1-shooter.mp3"); // Load sound file
    this.shootSound.volume = 0.4; // Adjust volume (optional)
    this.shootSound2 = new Audio("../assets/sounds/attack2-shooter.mp3"); // Load sound file
    this.shootSound2.volume = 0.4; // Adjust volume (optional)
    this.damageSound = new Audio("../assets/sounds/damage-shooter.mp3");
    this.damageSound.volume = 0.4;
    this.destroyedSound = new Audio("../assets/sounds/destroyed-shooter.mp3");
    this.destroyedSound.volume = 0.4;
  }

  draw(context) {
    // Determine which sprite sheet to use based on the current status
    switch (this.status) {
      case "damage":
        this.currentSpriteSheet = this.damagedSpriteSheet;
        break;
      case "shooting":
        this.currentSpriteSheet = this.attack1SpriteSheet;
        if (this.upgraded) {
          this.currentSpriteSheet = this.attack2SpriteSheet;
        } else {
          this.currentSpriteSheet = this.attack1SpriteSheet;
        }
        break;
      case "destroyed":
        this.currentSpriteSheet = this.destroyedSpriteSheet;
        break;
      case "movingSideways":
        this.currentSpriteSheet = this.evasionSpriteSheet;
        break;
      default:
        if (this.upgraded) {
          this.currentSpriteSheet = this.boostSpriteSheet;
        } else {
          this.currentSpriteSheet = this.movingSpriteSheet;
        }
        break;
    }

    this.projectiles.forEach((projectile) => projectile.draw(context));

    // Draw the current frame of the selected sprite sheet
    this.currentSpriteSheet.draw(context, this.x, this.y);

    if (this.status !== "destroyed") this.motionLines.draw(context);
  }

  update(timeElapsed) {
    if (
      this.status === "destroyed" &&
      this.currentSpriteSheet.currentFrameX ===
        this.currentSpriteSheet.framesX - 1
    ) {
      this.destroyedSound.pause();
      this.game.playGameOverSound();
      this.game.gameOver = true;
      return;
    }

    this.currentSpriteSheet.update(timeElapsed);

    // Move left if ArrowLeft is pressed
    if (this.game.keys.includes("ArrowLeft")) {
      if (!this.isTurningLeft) {
        this.status = "movingSideways";
        this.isTurningLeft = true;
      }
      if (this.x > 0) {
        this.x -= this.speed;
      }
    }
    // Move right if ArrowRight is pressed
    else if (this.game.keys.includes("ArrowRight")) {
      if (!this.isTurningRight) {
        this.status = "movingSideways";
        this.isTurningRight = true;
      }
      if (this.x < this.game.canvas.width - this.width) {
        this.x += this.speed;
      }
    } else if (
      this.isTurningLeft ||
      (this.isTurningRight && this.status === "movingSideways")
    ) {
      this.status = "moving";
      this.isTurningLeft = false;
      this.isTurningRight = false;
    }

    if (this.status !== "destroyed")
      if (
        this.status === "damage" &&
        this.currentSpriteSheet.currentFrameX ===
          this.currentSpriteSheet.framesX - 1
      ) {
        setTimeout(() => {
          this.status = "moving"; // Delay transition to ensure the damage animation is noticeable
        }, 200);
      }

    this.motionLines.update();

    this.projectiles.forEach((projectile) => projectile.move(timeElapsed));

    if (
      this.status === "shooting" &&
      this.currentSpriteSheet.currentFrameX >=
        this.currentSpriteSheet.framesX - 1
    ) {
      setTimeout(() => {
        this.status = "moving"; // Delay transition to ensure the shooting animation is noticeable
      }, 200);
    }

    if (this.lives < 1 && this.status !== "destroyed") {
      this.status = "destroyed";
      this.destroyedSound.currentTime = 0;
      this.destroyedSound.play();
    }

    if (this.upgraded) {
      this.boostTimer += timeElapsed;

      if (this.boostTimer >= this.boostDuration) {
        this.boostTimer = 0;
        this.resetUpgrade();
      }
    }

    this.width = this.currentSpriteSheet.width;
    this.height = this.currentSpriteSheet.height;
  }

  createProjectiles() {
    if (!this.projectileClass) {
      console.error("Projectile class not assigned!");
      return;
    }

    for (let i = 0; i < this.numberOfProjectiles; i++) {
      this.projectiles.push(new this.projectileClass());
    }
  }

  applyDamage(damage) {
    this.status = "damage";
    const exactDamage = this.type === "corvette" ? damage * 0.5 : damage;
    if (this.status === "damage") {
      this.damageSound.currentTime = 0;
      this.damageSound.play();
    }
    this.lives -= exactDamage;
  }

  increaseHealth() {
    if (this.upgraded) return;
    this.lives += 1;
  }

  upgrade() {
    if (this.upgraded) return;
    this.upgraded = true;
    this.damageToInflict += 2;
    this.speed += 5;
  }

  resetUpgrade() {
    this.upgraded = false;
    this.speed = this.normalSpeed;
    this.damageToInflict = this.normalDamgeToInflict;
  }

  goToNextLevel() {
    if (this.y + this.height > 0) this.y -= 5;
    else {
      this.game.levelFinished = true;
      this.game.playNextLevelSound();
    }
  }

  resetPosition() {
    this.x = this.game.canvas.width * 0.5 - this.width * 0.5;
    this.y =
      this.game.canvas.height -
      (this.height + this.height * (this.type === "corvette" ? 0.1 : 0.5));
  }

  playShootingSound() {
    if (this.upgraded) {
      this.shootSound2.currentTime = 0;
      this.shootSound2.play();
    } else {
      this.shootSound.currentTime = 0;
      this.shootSound.play();
    }
  }
}

// MotionLines helper class, handling the creation, updating, and drawing of motion lines
class MotionLines {
  constructor(shooter) {
    this.shooter = shooter;
    this.lines = Array.from({ length: 5 }, () => ({
      x: shooter.x + Math.random() * shooter.width,
      y: shooter.y + shooter.height + Math.random() * 100,
    }));
    this.lineSpeed = 5;
  }

  // Updates the position of each motion line to create a moving effect

  update() {
    this.lines.forEach((line) => {
      line.y += this.lineSpeed;
      if (line.y > this.shooter.game.canvas.height) {
        line.y = this.shooter.y + this.shooter.height;
        line.x = this.shooter.x + Math.random() * this.shooter.width;
      }
    });
  }
  // Draws each motion line on the canvas context

  draw(context) {
    context.fillStyle = "rgba(255, 255, 255, 0.7)";
    this.lines.forEach((line) => {
      context.fillRect(line.x, line.y, 2, 20);
    });
  }
}
