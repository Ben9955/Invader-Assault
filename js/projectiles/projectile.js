export default class Projectile {
  constructor() {
    this.width = 6;
    this.height = 19;
    this.x = 0;
    this.y = 0;
    this.speed = 10;
    this.ready = true;
    this.image = new Image();
    this.charge1Src = "../assets/images/game/bomber-charge1.png";
    this.type = "charge1";
    // Sprite sheet details
    this.frameWidth = 6;
    this.frameHeight = 19;
    this.currentFrameX = 0;
    this.spritSheetColumns = 4;
    this.charge2Src = "../assets/images/game/bomber-charge2.png";

    this.frameInterval = 3; // Change frames every 10 game loops (adjust this to slow down)
    this.frameCounter = 0;
  }

  draw(context) {
    if (!this.ready) {
      if (this.type === "charge1") {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
      } else {
        const sheetX = this.currentFrameX * this.frameWidth;

        context.drawImage(
          this.image,
          sheetX,
          0,
          this.frameWidth,
          this.frameHeight,
          this.x,
          this.y,
          this.width,
          this.height
        );
      }
    }
  }

  move() {
    if (this.y + this.height < 0) {
      this.ready = true;
      return;
    }
    if (!this.ready) {
      if (this.type === "charge2") this.updateFrame();

      this.y -= this.speed;
    }
  }

  start(x, y, type) {
    if (type === "charge2") {
      this.type = "charge2";
      this.image.src = this.charge2Src;
    } else {
      this.type = "charge1";
      this.image.src = this.charge1Src;
    }
    this.x = x;
    this.y = y;
    this.ready = false;
  }

  reset() {
    this.ready = true;
  }

  updateFrame() {
    this.frameCounter++;

    if (this.frameCounter >= this.frameInterval) {
      this.frameCounter = 0;

      this.currentFrameX = (this.currentFrameX + 1) % this.spritSheetColumns;
    }
  }
}
