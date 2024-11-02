import SpriteSheet from "../SpriteSheet.js";
import BossBullet from "../projectiles/bossBullet.js";
import Enemy from "./enemy.js";

export default class Boss extends Enemy {
  constructor(game, x, y) {
    super(game, x, y, 354, 318, 40, 2);
    this.speed = 10;
    // Flag to track if the boss has shot during the current frame
    this.hasShot = false;
    this.status = "firing";
    this.projectiles = [];
    this.numberOfProjecties = 6;
    this.createProjectiles();

    this.dyingSpriteSheet = new SpriteSheet(new Image(), 200, 250, 265, 6, 2);
    this.firingSpriteSheet = new SpriteSheet(new Image(), 15, 250, 265, 13, 2);
    // Load images for each sprite sheet
    this.firingSpriteSheet.image.src = "../assets/images/game/boss-firing.png";
    this.dyingSpriteSheet.image.src = "../assets/images/game/boss-dying.png";

    // since the framwidth is big i need to reduce the widthand height
    this.firingSpriteSheet.width = this.firingSpriteSheet.width * 0.8;
    this.firingSpriteSheet.height = this.firingSpriteSheet.height * 0.8;
    this.dyingSpriteSheet.width = this.dyingSpriteSheet.width * 0.8;
    this.dyingSpriteSheet.height = this.dyingSpriteSheet.height * 0.8;

    this.currentSpriteSheet = this.firingSpriteSheet;

    // Sounds
    this.monsterdyingSound = new Audio("../assets/sounds/monster-scream.mp3");
    this.monsterdyingSound.volume = 1;
    this.monsterFiringSound = new Audio("../assets/sounds/boss-firing.mp3");
    this.monsterFiringSound.volume = 0.2;
  }

  draw(context) {
    if (this.dead) return;

    if (this.status === "firing") {
      this.currentSpriteSheet = this.firingSpriteSheet;
      this.projectiles.forEach((projectile) => projectile.draw(context));
    } else this.currentSpriteSheet = this.dyingSpriteSheet;

    // Draw the current frame of the selected sprite sheet
    if (this.currentSpriteSheet)
      this.currentSpriteSheet.draw(context, this.x, this.y);

    this.drawHealthBar(context);
  }

  update(timeElapsed) {
    if (this.dead) return;

    // Increase the firing speed when boss's lives is half
    if (this.lives <= this.maxLives * 0.5) {
      this.firingSpriteSheet.frameDuration = 10;
      this.speed = 15;
    }

    this.currentSpriteSheet.update(timeElapsed);

    // this will check collision with the shooter's projectiles and applay damage
    if (this.y >= 0) this.checkShooterProjectilesAndApplyDamage();

    // this will check collision of the alien's projectiles and applay damage to shooter
    if (this.y >= 0) this.applyDamageToShooterFromProjectiles();

    // the alien will shoot if some condition are true
    this.attemptShootWhenReady();

    if (this.lives < 1) {
      this.monsterdyingSound.play();
      this.status = "dying";
    }

    // Only set dead when the last frame of the dying sprite sheet is reached
    if (this.status === "dying" && this.currentSpriteSheet.isLastFrame()) {
      this.game.enemiesDefeatedInCurrentLevel++;
      this.game.score += this.maxLives;
      this.dead = true;
    }

    this.height = this.currentSpriteSheet.height;
    this.width = this.currentSpriteSheet.width;

    this.projectiles.forEach((projectile) => projectile.move());

    this.move();
  }

  move() {
    if (this.y < 10) this.y += this.speed;

    // Calculate the center positions of the boss and the shooter
    const bossCenterX = this.x + this.width * 0.5;
    const shooterCenterX = this.game.shooter.x + this.game.shooter.width * 0.5;
    const shooterLeftEdge = this.game.shooter.x;
    const shooterRightEdge = this.game.shooter.x + this.game.shooter.width;

    // Move the boss toward the shooter's center position on the x-axis
    if (bossCenterX < shooterLeftEdge) {
      this.x += this.speed; // Move right
    } else if (bossCenterX > shooterRightEdge) {
      this.x -= this.speed; // Move left
    }
  }

  createProjectiles() {
    for (let i = 0; i < this.numberOfProjecties; i++) {
      this.projectiles.push(new BossBullet(this.game));
    }
  }

  // shooting
  shoot() {
    this.monsterFiringSound.currentTime = 0; // Reset sound to start (in case it's still playing)
    this.monsterFiringSound.play();

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

  applyDamageToShooterFromProjectiles() {
    this.projectiles.forEach((projectile) => {
      if (
        !projectile.ready &&
        this.game.checkCollision(this.game.shooter, projectile)
      ) {
        projectile.reset();
        this.game.shooter.applyDamage(this.damageToInflict);
      }
    });
  }

  attemptShootWhenReady() {
    if (this.game.shooter.lives > 0) {
      if (
        this.status === "firing" &&
        this.currentSpriteSheet.currentFrameX === 3 &&
        this.currentSpriteSheet.currentFrameY === 1
      ) {
        if (!this.hasShot) {
          // Check if the boss hasn't shot yet in this frame
          this.shoot();
          this.hasShot = true;
        }
      } else {
        this.hasShot = false;
      }
    }
  }
}
