import FighterProjectile from "../projectiles/fighterProjectile.js";
import Shooter from "./shooter.js";
import SpriteSheet from "../SpriteSheet.js";

export default class Fighter extends Shooter {
  constructor(game, lives) {
    super(game, lives);
    this.type = "fighter";
    this.projectileClass = FighterProjectile; // Assign specific projectile type
    this.normalSpeed = 15;
    this.speed = this.normalSpeed;
    this.normalDamgeToInflict = 2;
    this.damageToInflict = this.normalDamgeToInflict;
    this.numberOfProjectiles = 15;
    this.createProjectiles();

    // Initialize sprite sheets for different animations
    this.attack1SpriteSheet = new SpriteSheet(new Image(), 70, 64, 104, 2);
    this.attack2SpriteSheet = new SpriteSheet(new Image(), 70, 64, 100, 4);
    this.damagedSpriteSheet = new SpriteSheet(new Image(), 70, 85, 114, 9);
    this.destroyedSpriteSheet = new SpriteSheet(new Image(), 70, 114, 114, 15);
    this.movingSpriteSheet = new SpriteSheet(new Image(), 80, 64, 102, 6);
    this.evasionSpriteSheet = new SpriteSheet(new Image(), 50, 62, 92, 8);
    this.boostSpriteSheet = new SpriteSheet(new Image(), 80, 64, 112, 5);

    // Load images for each sprite sheet
    this.attack1SpriteSheet.image.src =
      "../assets/images/game/fighter-attack1.png";
    this.attack2SpriteSheet.image.src =
      "../assets/images/game/fighter-attack2.png";
    this.damagedSpriteSheet.image.src =
      "../assets/images/game/fighter-damage.png";
    this.destroyedSpriteSheet.image.src =
      "../assets/images/game/fighter-destroyed.png";
    this.movingSpriteSheet.image.src = "../assets/images/game/fighter-move.png";
    this.boostSpriteSheet.image.src = "../assets/images/game/fighter-boost.png";
    this.evasionSpriteSheet.image.src =
      "../assets/images/game/fighter-evasion.png";

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
          this.x + 25,
          this.y,
          this.upgraded ? "charge2" : "charge1"
        );
        // Start the second projectile at a position on the opposite side of the Corvette

        projectile2.start(
          this.x + this.width - 25,
          this.y,
          this.upgraded ? "charge2" : "charge1"
        );

        this.playShootingSound();
        return;
      }
    }
  }
}
