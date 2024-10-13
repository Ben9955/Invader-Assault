import SpriteSheet from "./SpriteSheet.js";

export default class Shooter {
  constructor(game) {
    this.game = game;
    this.width = 56;
    this.height = 114;
    this.x = game.canvas.width * 0.5 - 56 * 0.5; // Example width
    this.y = game.canvas.height - (114 + 114 * 0.5); // Example height
    this.speed = 10;
    this.lives = 10;
    this.status = "moving"; // Initial status

    // Initialize sprite sheets for different animations
    this.shootingSpriteSheet = new SpriteSheet(new Image(), 70, 56, 114, 4);
    this.damagedSpriteSheet = new SpriteSheet(new Image(), 70, 73, 121, 10);
    this.destroyedSpriteSheet = new SpriteSheet(new Image(), 70, 150, 145, 10);
    this.movingSpriteSheet = new SpriteSheet(new Image(), 80, 56, 114, 6);
    this.evasionSpriteSheet = new SpriteSheet(new Image(), 50, 56, 114, 9);

    // Load images for each sprite sheet
    this.shootingSpriteSheet.image.src = "./images/bomber-attack1.png";
    this.damagedSpriteSheet.image.src = "./images/bomber-damage.png";
    this.destroyedSpriteSheet.image.src = "./images/bomber-destroyed.png";
    this.movingSpriteSheet.image.src = "./images/bomber-move.png";
    this.evasionSpriteSheet.image.src = "./images/bomber-evasion.png";

    // Set the current sprite sheet to moving by default
    this.currentSpriteSheet = this.movingSpriteSheet;

    this.powerUp = false;
    // State variables for key presses
    this.isTurningLeft = false;
    this.isTurningRight = false;

    // Sound for shooting
    this.shootSound = new Audio("./sounds/laser-gun.mp3"); // Load sound file
    this.shootSound.volume = 0.5; // Adjust volume (optional)

    // Motion lines (below the shooter)
    this.motionLines = [];
    this.maxMotionLines = 5;
    this.lineSpeed = 5; // Speed of the lines
    this.lineWidth = 2;
    this.lineHeight = 20;

    // Generate initial motion lines starting below the shooter
    for (let i = 0; i < this.maxMotionLines; i++) {
      this.motionLines.push({
        x: this.x + Math.random() * this.width,
        y: this.y + this.height + Math.random() * 100, // Start 100px below the shooter
      });
    }
  }

  draw(context) {
    // Determine which sprite sheet to use based on the current status
    switch (this.status) {
      case "damage":
        this.currentSpriteSheet = this.damagedSpriteSheet;
        break;
      case "shooting":
        this.currentSpriteSheet = this.shootingSpriteSheet;
        break;
      case "destroyed":
        this.currentSpriteSheet = this.destroyedSpriteSheet;
        break;
      case "movingSideways":
        this.currentSpriteSheet = this.evasionSpriteSheet;
        break;
      default:
        this.currentSpriteSheet = this.movingSpriteSheet;
        break;
    }

    // Draw the current frame of the selected sprite sheet
    this.currentSpriteSheet.draw(context, this.x, this.y);

    if (this.status !== "destroyed")
      // Draw motion lines (below the shooter)
      this.motionLines.forEach((line) => {
        context.fillStyle = "rgba(255, 255, 255, 0.7)"; // Semi-transparent white color
        context.fillRect(line.x, line.y, this.lineWidth, this.lineHeight);
        if (this.powerUp)
          context.fillRect(line.x, line.y, this.lineWidth, this.lineHeight);
      });
  }

  update(timeElapsed) {
    if (
      this.status === "destroyed" &&
      this.currentSpriteSheet.currentFrameX === 9
    )
      return;

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
        this.status = "movingSideways"; // Change to turnRight status only once
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
      // Update position of motion lines to simulate movement
      this.motionLines.forEach((line) => {
        line.y += this.lineSpeed; // Move lines down
        if (line.y > this.game.canvas.height) {
          // Reset line to simulate continuous motion below the shooter
          line.y = this.y + this.height; // Reset below the shooter
          line.x = this.x + Math.random() * this.width; // Random x position within the shooter width
        }
      });

    this.game.alienProjectiles.forEach((projectile) => {
      if (!projectile.ready && this.game.checkCollision(this, projectile)) {
        projectile.reset();
        this.status = "damage";
        this.lives--;
      }
    });

    if (this.status === "damage" && this.currentSpriteSheet.currentFrameX > 9) {
      this.status = "moving";
    }

    if (
      this.status === "shooting" &&
      this.currentSpriteSheet.currentFrameX >= 3
    ) {
      this.status = "moving";
    }

    if (this.lives < 1) {
      this.status = "destroyed";
    }
  }

  shoot() {
    if (this.status === "damage" || this.status === "destroyed") return;
    this.status = "shooting";

    for (let i = 0; i < this.game.projectiles.length; i++) {
      let projectile1 = this.game.projectiles[i];
      let projectile2 = this.game.projectiles[i + 1];

      if (projectile1.ready && projectile2.ready) {
        projectile1.start(
          this.x + 9,
          this.y,
          this.powerUp ? "charge2" : "charge1"
        );
        projectile2.start(
          this.x + this.width - 9,
          this.y,
          this.powerUp ? "charge2" : "charge1"
        );

        // Play shooting sound
        this.shootSound.currentTime = 0; // Reset sound to start (in case it's still playing)
        this.shootSound.play(); // Play shooting sound

        return;
      }
    }
  }

  applyDamage(damage) {
    this.status = "damage";
    this.lives -= damage;
  }
}
