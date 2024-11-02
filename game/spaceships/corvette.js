import SpriteSheet from "../SpriteSheet.js";
import Shooter from "./shooter.js";
import CorvetteProjectile from "../projectiles/covetteProjectile.js";

export default class Corvette extends Shooter {
  constructor(game, lives) {
    super(game, lives);
    this.type = "corvette";
    this.projectileClass = CorvetteProjectile;
    this.normalSpeed = 8;
    this.speed = this.normalSpeed;
    this.normalDamgeToInflict = 2;
    this.damageToInflict = this.normalDamgeToInflict;
    this.numberOfProjectiles = 10;
    this.createProjectiles();
    this.y = this.game.canvas.height - this.height * 1.5;

    // Initialize sprite sheets for different animations
    this.attack1SpriteSheet = new SpriteSheet(new Image(), 70, 94, 177, 4);
    this.attack2SpriteSheet = new SpriteSheet(new Image(), 70, 94, 176, 4);
    this.damagedSpriteSheet = new SpriteSheet(new Image(), 70, 120, 169, 10);
    this.destroyedSpriteSheet = new SpriteSheet(new Image(), 70, 192, 190, 17);
    this.movingSpriteSheet = new SpriteSheet(new Image(), 80, 94, 187, 6);
    this.boostSpriteSheet = new SpriteSheet(new Image(), 80, 94, 188, 5);
    this.evasionSpriteSheet = new SpriteSheet(new Image(), 50, 94, 177, 6);

    // Load images for each sprite sheet
    this.attack1SpriteSheet.image.src =
      "../assets/images/game/corvette-attack1.png";
    this.attack2SpriteSheet.image.src =
      "../assets/images/game/corvette-attack2.png";
    this.damagedSpriteSheet.image.src =
      "../assets/images/game/corvette-damage.png";
    this.destroyedSpriteSheet.image.src =
      "../assets/images/game/corvette-destroyed.png";
    this.movingSpriteSheet.image.src =
      "../assets/images/game/corvette-move.png";
    this.boostSpriteSheet.image.src =
      "../assets/images/game/corvette-boost.png";
    this.evasionSpriteSheet.image.src =
      "../assets/images/game/corvette-shield.png";

    // Set the current sprite sheet to moving by default
    this.currentSpriteSheet = this.movingSpriteSheet;
  }

  shoot() {
    if (this.status === "destroyed") return;
    this.status = "shooting";

    for (let i = 0; i < this.projectiles.length; i++) {
      let projectile1 = this.projectiles[i];
      let projectile2 = this.projectiles[i + 1];

      if (projectile1.ready && projectile2.ready) {
        // Start the first projectile at a position based on whether it's upgraded
        // Adjust the x position depending on whether the Corvette is upgraded
        projectile1.start(
          this.x + (this.upgraded ? 19 : 41),
          this.y,
          this.upgraded ? "charge2" : "charge1"
        );
        // Start the second projectile at a position on the opposite side of the Corvette

        projectile2.start(
          this.x + this.width - (this.upgraded ? 19 : 41),
          this.y,
          this.upgraded ? "charge2" : "charge1"
        );

        this.playShootingSound();

        return;
      }
    }
  }
}
