export default class Asteroid {
  constructor(game) {
    this.game = game;
    this.width = 38;
    this.height = 33;
    this.x = 150;
    this.y = -20;
    this.speed = 1;
    this.exploding = false;
    this.exploded = false;
    // Sprite sheet details
    this.frameWidth = 96;
    this.frameHeight = 96;
    this.frameX = 0;
    this.frameY = 0;
    this.spritSheetColumns = 8;
    this.image = new Image();
    this.image.src = "./images/asteroid-base.png";

    this.explodeImage = new Image();
    this.explodeImage.src = "./images/asteroid-explode.png";

    // Animation control
    this.frameInterval = 15;
    this.frameCounter = 0;
  }

  draw(context) {
    if (!this.exploding) {
      // Draw normal asteroid image
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      // Draw explosion frame from the sprite sheet
      const sheetX = this.frameX * this.frameWidth;
      const sheetY = this.frameY * this.frameHeight;

      context.drawImage(
        this.explodeImage,
        sheetX,
        sheetY, // Sprite sheet position
        this.frameWidth,
        this.frameHeight, // Size of the frame
        this.x,
        this.y, // Asteroid position on canvas
        this.frameWidth,
        this.frameHeight
      );
    }
  }

  update() {
    this.game.projectiles.forEach((projectile) => {
      if (!projectile.ready && this.game.checkCollision(this, projectile)) {
        this.exploding = true;
        projectile.reset();
      }

      if (this.exploding && !this.exploded) {
        this.updateFrame();
        if (this.frameX === this.spritSheetColumns - 1) {
          this.exploded = true;
          this.game.score++;
        }
      }
    });
    if (!this.exploding) this.y += this.game.background.speed + this.speed;
  }

  updateFrame() {
    // Increment the frame counter
    this.frameCounter++;

    // Only change frames when frameCounter reaches the frameInterval
    if (this.frameCounter >= this.frameInterval) {
      this.frameCounter = 0; // Reset the frame counter

      this.frameX = (this.frameX + 1) % this.spritSheetColumns;
    }
  }
}
