export default class Blob {
  constructor(game) {
    this.game = game;
    this.width = 200;
    this.height = 244;
    this.x = 250;
    this.y = 20;
    this.speed = 2;
    this.lives = 5;
    this.dead = false;
    this.isDying = false;

    // Sprite sheet details
    this.frameWidth = 200;
    this.frameHeight = 244;
    this.currentFrameX = 0;
    this.currentFrameY = 0;
    this.spritSheetRows = 4;
    this.spritSheetColumns = 9;
    this.image = new Image();
    this.image.src = "./images/blob-alien-passive.png";

    this.explodeFrameWidth = 300;
    this.explodeFrameHeight = 300;
    this.explodeSpritSheetRows = 2;
    this.explodeSpritSheetColumns = 6;
    this.explodeImage = new Image();
    this.explodeImage.src = "./images/blob-alien-explode.png";

    // Animation control
    this.frameInterval = 2; // Change frames every 10 game loops (adjust this to slow down)
    this.frameCounter = 0;
  }

  draw(context) {
    if (!this.dead) {
      const sheetX = this.currentFrameX * this.frameWidth;
      const sheetY = this.currentFrameY * this.frameHeight;

      context.drawImage(
        this.image,
        sheetX,
        sheetY,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  update() {
    this.updateFrame();
    this.game.projectiles.forEach((projectile) => {
      if (
        !projectile.ready &&
        this.game.checkCollision(this, projectile) &&
        this.lives > 0
      ) {
        projectile.reset();
        this.lives--;
      }
    });

    if (this.lives < 1) {
      this.image = this.explodeImage;
      this.width = this.explodeFrameWidth;
      this.height = this.explodeFrameHeight;
      this.frameHeight = this.explodeFrameHeight;
      this.frameWidth = this.explodeFrameWidth;
      this.spritSheetColumns = this.explodeSpritSheetColumns;
      this.spritSheetRows = this.explodeSpritSheetRows;
      this.isDying = true;
    }

    if (
      this.isDying &&
      this.currentFrameX === this.spritSheetColumns - 1 &&
      this.currentFrameY === this.spritSheetRows - 1
    ) {
      this.dead = true; // Only set dead when the last frame of the dying sprite sheet is reached
    }

    this.move();
  }

  updateFrame() {
    // Increment the frame counter
    this.frameCounter++;

    // Only change frames when frameCounter reaches the frameInterval
    if (this.frameCounter >= this.frameInterval) {
      this.frameCounter = 0; // Reset the frame counter

      // Update the current frame
      this.currentFrameX = (this.currentFrameX + 1) % this.spritSheetColumns;

      // Move to the next row when the current row is done
      if (this.currentFrameX === 0) {
        this.currentFrameY = (this.currentFrameY + 1) % this.spritSheetRows;
      }
    }
  }

  move() {
    if (
      this.x + this.speed + this.width < this.game.width &&
      this.x + this.speed > 0
    ) {
      this.x += this.speed;
    } else {
      this.speed *= -1;
      this.y += this.height * 0.5;
    }
  }
}
