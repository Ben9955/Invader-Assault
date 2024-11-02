import SpriteSheet from "../SpriteSheet.js";
import Enemy from "./enemy.js";

export default class Blob extends Enemy {
  constructor(game, x, y) {
    super(game, x, y, 354, 318, 15, 3);
    this.speedX = 3;
    this.speedY = 3;
    this.collisionWithShooter = false;

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
    this.explodingSpriteSheet.image.src =
      "../assets/images/game/blob-alien-explode.png";
    this.passiveSpriteSheet.image.src =
      "../assets/images/game/blob-alien-passive.png";

    this.passiveSpriteSheet.width = this.passiveSpriteSheet.width / 2;
    this.passiveSpriteSheet.height = this.passiveSpriteSheet.height / 2;

    // Set the current sprite sheet to moving by default
    this.currentSpriteSheet = this.passiveSpriteSheet;

    // Sound
    this.explosion = new Audio(
      "../assets/sounds/mixkit-sea-mine-explosion-1184.wav"
    );
    this.explosion.volume = 0.5;
    this.passiveSound = new Audio("../assets/sounds/blob-sound.mp3");
    this.passiveSound.volume = 0.2;
  }

  draw(context) {
    if (this.dead) return;

    if (this.status === "passive")
      this.currentSpriteSheet = this.passiveSpriteSheet;
    else this.currentSpriteSheet = this.explodingSpriteSheet;

    // Draw the current frame of the selected sprite sheet
    if (this.currentSpriteSheet)
      this.currentSpriteSheet.draw(context, this.x, this.y);

    this.drawHealthBar(context);
  }

  update(timeElapsed) {
    if (this.dead) return;

    this.currentSpriteSheet.update(timeElapsed);

    // this will check collision with the shooter's projectiles and applay damage
    if (this.y >= 0) this.checkShooterProjectilesAndApplyDamage();

    // Check for collisions with the shooter
    if (this.game.checkCollision(this, this.game.shooter)) {
      this.collisionWithShooter = true;
      this.lives = 0;
    }

    if (this.lives < 1) {
      this.status = "exploding";
      // Play sound
      this.passiveSound.pause();
      this.explosion.play(); // Play sound
    }

    if (this.status === "exploding" && this.currentSpriteSheet.isLastFrame()) {
      // Check for collisions during explosion with the shooter
      if (this.collisionWithShooter) {
        // Shooter takes damage during explosion
        this.game.shooter.applyDamage(this.damageToInflict);
      } else {
        if (!this.collisionWithShooter) this.game.score += 20;
        this.game.enemiesDefeatedInCurrentLevel++;
      }

      this.dead = true; // Only set dead when the last frame of the exploding sprite sheet is reached
    }

    this.height = this.currentSpriteSheet.height;
    this.width = this.currentSpriteSheet.width;

    if (this.status === "passive") {
      this.move();
    }

    if (this.y > this.game.height) this.game.gameOver = true;

    // the sound will keep playing if the blob alien is alive
    if (this.lives > 1) {
      this.passiveSound.play();
    }
  }

  move() {
    if (!this.detectPotentialCollisionWithEnemies() && !this.isAtScreenEdge()) {
      this.x += this.speedX;
      this.y += this.speedY / 2;
    } else {
      this.speedX *= -1;
      this.y += this.speedY * 2;
    }
  }
}
