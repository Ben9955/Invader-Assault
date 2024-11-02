import SpriteSheet from "../SpriteSheet.js";

export default class Asteroid {
  constructor(game) {
    this.game = game;
    this.width = 38;
    this.height = 33;
    this.x = -50;
    this.y = -50;
    this.speed = 3;
    this.exploding = false;
    this.ready = true;
    this.collisionWithShooter = false;
    this.image = new Image();
    this.image.src = "../assets/images/game/asteroid-base.png";
    this.damageInflicted = false;

    this.explodeSpriteSheet = new SpriteSheet(new Image(), 100, 96, 96, 8);
    this.explodeSpriteSheet.image.src =
      "../assets/images/game/asteroid-explode.png";

    // Sound explosion
    this.explosionSound = new Audio("../../assets/sounds/explosion-alien1.mp3");
    this.explosionSound.volume = 0.5;
  }

  draw(context) {
    if (this.ready) return;
    if (!this.exploding) {
      // Draw normal asteroid image
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      this.explodeSpriteSheet.draw(context, this.x, this.y);
    }
  }

  update(timeElapsed) {
    if (this.y >= 0) this.checkShooterProjectilesAndApplyDamage();

    // Check for collisions with the shooter
    if (this.game.checkCollision(this, this.game.shooter)) {
      this.collisionWithShooter = true;
      this.exploding = true;
    }

    if (
      this.exploding &&
      this.explodeSpriteSheet.currentFrameX === 1 &&
      this.collisionWithShooter &&
      !this.damageInflicted
    ) {
      this.game.shooter.applyDamage(1); // Shooter takes damage
      this.damageInflicted = true;
    }

    if (this.exploding) {
      this.explodeSpriteSheet.update(timeElapsed);
      if (
        this.explodeSpriteSheet.currentFrameX ===
        this.explodeSpriteSheet.framesX - 1
      ) {
        this.reset();
        if (!this.collisionWithShooter) this.game.score++;
      }
    }

    if (!this.exploding && !this.ready) this.y += this.speed;

    if (this.y - this.height > this.game.height) {
      this.reset();
    }
  }

  reset() {
    this.ready = true;
    this.exploding = false;
    this.x = -50;
    this.y = -50;
    this.explodeSpriteSheet.currentFrameX = 0;
    this.damageInflicted = false;
    this.collisionWithShooter = false;
  }

  checkShooterProjectilesAndApplyDamage() {
    this.game.shooter.projectiles.forEach((projectile) => {
      if (!projectile.ready && this.game.checkCollision(this, projectile)) {
        this.exploding = true;
        this.explosionSound.currentTime = 0;
        this.explosionSound.play();
        projectile.reset();
      }
    });
  }
}
