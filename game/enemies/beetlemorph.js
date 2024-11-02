import SpriteSheet from "../SpriteSheet.js";
import Enemy from "./enemy.js";

export default class Beetlemorph extends Enemy {
  constructor(game, x, y) {
    super(game, x, y, 40, 40, 2, 0.5);
    this.speedY = 1.5;
    this.speedX = 1.5;
    this.damageInflicted = false;
    this.collisionWithShooter = false;

    this.image = new Image();
    this.image.src = "../assets/images/game/beetlemorph-passive.png";

    this.explodeSpriteSheet = new SpriteSheet(new Image(), 80, 80, 80, 3);
    // Load images for each sprite sheet
    this.explodeSpriteSheet.image.src =
      "../assets/images/game/beetlemorph-exploding.png";

    this.reverseTimer = 0;
    this.frameChangeTimer = 0;

    // Sound
    this.explosionSound = new Audio("../../assets/sounds/explosion-alien1.mp3");
    this.explosionSound.volume = 0.4;
  }

  draw(context) {
    if (this.dead) return;

    if (this.y < 0 && this.y >= this.height * -1) this.y += 10;
    if (this.status === "passive") {
      // Draw normal image
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      this.explodeSpriteSheet.draw(context, this.x, this.y);
    }
  }

  update(timeElapsed) {
    if (this.dead) return;

    if (this.status === "exploding")
      this.explodeSpriteSheet.update(timeElapsed);

    this.reverseTimer += timeElapsed;

    // this will check collision with the shooter's projectiles and applay damage to this enemy
    if (this.y >= 0) this.checkShooterProjectilesAndApplyDamage();

    // Check for collisions with the shooter
    if (this.game.checkCollision(this, this.game.shooter)) {
      this.collisionWithShooter = true;
      this.lives = 0;
    }

    if (this.lives < 1) {
      this.status = "exploding";
      // Play sound
      this.explosionSound.play();
    }

    // apply the damage to shooter if there is a collision
    if (
      this.status === "exploding" &&
      this.collisionWithShooter &&
      !this.damageInflicted
    ) {
      this.game.shooter.applyDamage(this.damageToInflict); // Shooter takes damage
      // the below flag is so the shooter get the damage only once
      this.damageInflicted = true;
    }

    if (this.status === "exploding" && this.explodeSpriteSheet.isLastFrame()) {
      this.game.enemiesDefeatedInCurrentLevel++;
      if (!this.collisionWithShooter) this.game.score += 2;
      this.dead = true;
    }

    if (this.status === "passive") this.move();
  }

  move() {
    // different movement from level 4
    if (this.game.currentLevel >= 4) {
      this.y += this.speedY;
      if (this.reverseTimer >= 1000 && !this.isAtScreenEdge()) {
        this.speedX *= -1;
        this.reverseTimer = 0;
      }
      this.x += this.speedX;
    } else this.y += this.speedY;

    if (this.y > this.game.height + this.height) {
      this.dead = true;
    }

    this.speedY =
      this.game.currentLevel >= 3 ? (this.game.currentLevel >= 6 ? 3 : 2) : 1.5;
  }
}
