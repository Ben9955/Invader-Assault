import SpriteSheet from "../SpriteSheet.js";

export default class Asteroid {
  constructor(game) {
    this.game = game;
    this.width = 38;
    this.height = 33;
    this.x = 100;
    this.y = -50;
    this.speed = 1;
    this.exploding = false;
    this.exploded = false;
    this.status = "passive";
    this.image = new Image();
    this.image.src = "./images/asteroid-base.png";

    this.explodeSpriteSheet = new SpriteSheet(new Image(), 150, 96, 96, 8);
    // Load images for each sprite sheet
    this.explodeSpriteSheet.image.src = "./images/asteroid-explode.png";
  }

  draw(context) {
    if (!this.exploding) {
      // Draw normal asteroid image
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      this.explodeSpriteSheet.draw(context, this.x, this.y);
    }
  }

  update(timeElapsed) {
    this.game.projectiles.forEach((projectile) => {
      if (!projectile.ready && this.game.checkCollision(this, projectile)) {
        this.exploding = true;
        projectile.reset();
      }
    });

    if (this.exploding && !this.exploded) {
      this.explodeSpriteSheet.update(timeElapsed);
      if (
        this.exploding &&
        this.explodeSpriteSheet.currentFrameX ===
          this.explodeSpriteSheet.framesX - 1
      ) {
        this.exploded = true;
        this.game.score++;

        // generate power-up with a certain probability
        if (Math.random() < 0.4) {
          // 25% chance to get a power up
          this.game.generatePowerUp(this.x, this.y); // generate it at asteroid's position
        }
      }
    }
    if (!this.exploding) this.y += this.game.background.speed + this.speed;
  }
}
