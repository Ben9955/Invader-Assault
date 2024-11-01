import SpriteSheet from "../SpriteSheet.js";
import Shooter from "./shooter.js";
import FighterProjectile from "../projectiles/fighterProjectile.js";

export default class Bomber extends Shooter {
  constructor(game, lives) {
    super(game, lives);
    this.type = "bomber";
    this.projectileClass = FighterProjectile;
    this.normalSpeed = 10;
    this.speed = this.normalSpeed;
    this.normalDamgeToInflict = 1;
    this.damageToInflict = this.normalDamgeToInflict;
    this.numberOfProjectiles = 10;
    this.createProjectiles();

    // Initialize sprite sheets for different animations
    this.attack1SpriteSheet = new SpriteSheet(new Image(), 70, 56, 114, 4);
    this.attack2SpriteSheet = new SpriteSheet(new Image(), 70, 56, 114, 1);
    this.damagedSpriteSheet = new SpriteSheet(new Image(), 70, 73, 121, 10);
    this.destroyedSpriteSheet = new SpriteSheet(new Image(), 70, 150, 145, 10);
    this.movingSpriteSheet = new SpriteSheet(new Image(), 80, 56, 114, 6);
    this.evasionSpriteSheet = new SpriteSheet(new Image(), 50, 56, 114, 9);
    this.boostSpriteSheet = new SpriteSheet(new Image(), 80, 56, 114, 6);

    // Load images for each sprite sheet
    this.attack1SpriteSheet.image.src =
      "../assets/images/game/bomber-attack1.png";
    this.attack2SpriteSheet.image.src =
      "../assets/images/game/bomber-attack2.png";
    this.damagedSpriteSheet.image.src =
      "../assets/images/game/bomber-damage.png";
    this.destroyedSpriteSheet.image.src =
      "../assets/images/game/bomber-destroyed.png";
    this.movingSpriteSheet.image.src = "../assets/images/game/bomber-move.png";
    this.boostSpriteSheet.image.src = "../assets/images/game/bomber-boost.png";
    this.evasionSpriteSheet.image.src =
      "../assets/images/game/bomber-evasion.png";

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
          this.x + (this.upgraded ? 16 : 9),
          this.y,
          this.upgraded ? "charge2" : "charge1"
        );
        // Start the second projectile at a position on the opposite side of the Corvette
        projectile2.start(
          this.x + this.width - (this.upgraded ? 16 : 9),
          this.y,
          this.upgraded ? "charge2" : "charge1"
        );

        this.playShootingSound();

        return;
      }
    }
  }
}
