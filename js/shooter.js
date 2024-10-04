export default class Shooter {
  constructor(game) {
    this.game = game;
    this.width = 180;
    this.height = 136;
    this.x = game.canvas.width * 0.5 - this.width * 0.5;
    this.y = game.canvas.height - (this.height + this.height * 0.5);
    this.speed = 8;
    this.lives = 3;
    this.leftShooter = this.width - 148;
    this.rightShooter = 148;
    this.image = new Image();
    this.image.src = "./images/ship.png";

    // thrust
    this.thrustFrameWidth = 48;
    this.thrustframeHeight = 48;
    this.currentFrameX = 0;
    this.thrustWidth = 40;
    this.thrustHeight = 40;
    this.spritSheetColumns = 3;
    this.thrustImage = new Image();
    this.thrustImage.src = "./images/thrust.png";

    // Animation control
    this.frameInterval = 3; // Change frames every 10 game loops (adjust this to slow down)
    this.frameCounter = 0;
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);

    const sheetX = this.currentFrameX * this.thrustFrameWidth;
    context.drawImage(
      this.thrustImage,
      sheetX,
      0,
      this.thrustFrameWidth,
      this.thrustframeHeight,
      this.x + this.width * 0.5 - this.thrustWidth * 0.5,
      this.y + 115,
      this.thrustWidth,
      this.thrustHeight
    );
  }

  move() {
    this.updateFrame();
    if (this.game.keys.includes("ArrowLeft")) {
      if (this.x <= 0) return;
      this.x -= this.speed;
    }
    if (this.game.keys.includes("ArrowRight")) {
      if (this.x >= this.game.canvas.width - this.width) return;
      this.x += this.speed;
    }
  }

  updateFrame() {
    // Increment the frame counter
    this.frameCounter++;

    // Only change frames when frameCounter reaches the frameInterval
    if (this.frameCounter >= this.frameInterval) {
      this.frameCounter = 0; // Reset the frame counter
      this.currentFrameX = (this.currentFrameX + 1) % this.spritSheetColumns;
    }
  }

  projectileStartPoint() {
    let postion = [this.x + this.width * 0.5, this.y + this.height * 0.4];
    if (this.game.keys.includes("ArrowLeft")) {
      postion[0] = this.x + this.leftShooter;
    }
    if (this.game.keys.includes("ArrowRight")) {
      postion[0] = this.x + this.rightShooter;
    }

    return postion;
  }

  shoot() {
    const [x, y] = this.projectileStartPoint();
    for (let i = 0; i < this.game.projectiles.length; i++) {
      let projectile = this.game.projectiles[i];
      if (projectile.ready) {
        projectile.start(x, y);
        break;
      }
    }
  }
}
