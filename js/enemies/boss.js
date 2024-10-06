export default class Boss {
  constructor(game) {
    this.game = game;
    this.width = 250;
    this.height = 265;
    this.x = 250;
    this.y = 20;
    this.speed = 2;
    this.lives = 5;
    this.dead = false;
    this.isDying = false;

    // Sprite sheet details
    this.frameWidth = 250;
    this.frameHeight = 265;
    this.currentFrameX = 0;
    this.currentFrameY = 0;
    this.spritSheetRows = 2;
    this.spritSheetColumns = 13;
    this.image = new Image();
    this.image.src = "./images/boss-firing.png";

    this.dyingFrameWidth = 250;
    this.dyingFrameHeight = 265;
    this.dyingSpritSheetRows = 2;
    this.dyingSpritSheetColumns = 6;
    this.dyingImage = new Image();
    this.dyingImage.src = "./images/boss-dying.png";

    // Animation control
    this.frameInterval = 2; // Change frames every 10 game loops (adjust this to slow down)
    this.frameCounter = 0;
  }

  draw(context) {
    // if (this.dead) return;
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

  update() {
    if (this.dead) return;

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
      this.image = this.dyingImage;
      this.frameHeight = this.dyingFrameHeight;
      this.frameWidth = this.dyingFrameWidth;
      this.spritSheetColumns = this.dyingSpritSheetColumns;
      this.spritSheetRows = this.dyingSpritSheetRows;
      this.isDying = true;
    }

    if (
      this.isDying &&
      this.currentFrameX === this.spritSheetColumns - 1 &&
      this.currentFrameY === this.spritSheetRows - 1
    ) {
      this.dead = true; // Only set dead when the last frame of the dying sprite sheet is reached
    }

    if (!this.isDying && this.currentFrameX === 3 && this.currentFrameY === 1) {
      this.shoot();
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
      //   this.y += this.height * 0.5;
    }
  }

  // shooting
  shoot() {
    const x = this.x + this.width * 0.3;
    const y = this.y + this.height * 0.8;
    for (let i = 0; i < this.game.bossProjectiles.length; i++) {
      let projectile = this.game.bossProjectiles[i];
      if (projectile.ready) {
        projectile.start(x, y);
        return;
      }
    }
  }
}
