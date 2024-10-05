export default class Beetlemorph {
  constructor(game, x, y) {
    this.game = game;
    this.width = 60;
    this.height = 60;
    this.x = x;
    this.y = y;
    this.speed = 1;
    this.lives = 2;
    this.dead = false;
    // Sprite sheet details
    this.frameWidth = 80;
    this.frameHeight = 80;
    this.frameX = 0;
    this.frameY = 0;
    this.spritSheetColumns = 3;
    this.image = new Image();
    this.image.src = "./images/beetlemorph.png";

    // Animation control
    this.frameInterval = 20;
    this.frameCounter = 0;
  }

  draw(context) {
    context.drawImage(
      this.image,
      this.frameX * this.frameWidth * 0.3, // Correct the frame positioning
      this.frameY,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update() {
    this.game.projectiles.forEach((projectile) => {
      if (
        !projectile.ready &&
        this.game.checkCollision(this, projectile) &&
        this.lives > 0
      ) {
        projectile.reset();
        this.lives--;
      }

      if (this.lives < 1 && !this.dead) {
        this.updateFrame();
        if (this.frameX > 2) {
          this.dead = true;
          this.game.score++;
        }
      }
    });
    this.y += this.game.background.speed + this.speed;
  }

  updateFrame() {
    // Increment the frame counter
    this.frameCounter++;

    // Only change frames when frameCounter reaches the frameInterval
    if (this.frameCounter >= this.frameInterval) {
      this.frameCounter = 0; // Reset the frame counter

      this.frameX = this.frameX + 1;
    }
  }
}
