export default class AlienShooter {
  constructor(game) {
    this.game = game;
    this.width = 154;
    this.height = 154;
    this.x = 200;
    this.y = 10;
    this.speed = 2;
    this.lives = 5;
    this.status = "passive";
    this.previousStatus = this.status;
    this.dead = false;

    // Sprite sheet details
    this.frameWidth = 354;
    this.frameHeight = 318;
    this.currentFrameX = 0;
    this.currentFrameY = 0;
    this.spritSheetRows = 4;
    this.spritSheetColumns = 7;
    this.image = new Image();
    this.image.src = "./images/gun-alien-passive.png";

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
    const shooterPosition = this.game.shooter.x + this.game.shooter.width * 0.5;
    if (shooterPosition >= this.x && shooterPosition <= this.x + this.width)
      this.status = "firing";
    else {
      this.status = "passive";
    }

    // Only update image and sprite sheet details when status changes
    if (this.status !== this.previousStatus) {
      this.previousStatus = this.status;

      if (this.status === "firing") {
        this.image.src = "./images/gun-alien-firing.png";
        this.frameHeight = 354;
        this.spritSheetColumns = 5;
        this.spritSheetRows = 5;
      } else if (this.status === "passive") {
        this.image.src = "./images/gun-alien-passive.png";
        this.frameHeight = 318;
        this.spritSheetColumns = 7;
        this.spritSheetRows = 4;
      }
    }

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
      this.status = "dying";
      this.image.src = "./images/gun-alien-dying.png";
      this.frameHeight = 318;
      this.spritSheetColumns = 7; // Number of columns in dying sprite sheet
      this.spritSheetRows = 2; // Number of rows in dying sprite sheet
    }

    if (
      this.status === "dying" &&
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
