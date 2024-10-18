export default class BossBullet {
  constructor(game) {
    this.game = game;
    this.width = 30;
    this.height = 82;
    this.x = -100;
    this.y = 0;
    this.speed = 15;
    this.ready = true;

    // Sprite sheet details
    this.frameWidth = 50;
    this.frameHeight = 136;
    this.currentFrameX = 0;
    this.currentFrameY = 0;
    this.spritSheetRows = 1;
    this.spritSheetColumns = 4;
    this.image = new Image();
    this.image.src = "../assets/images/game/boss-bullet.png";

    this.frameInterval = 3; // Change frames every 10 game loops (adjust this to slow down)
    this.frameCounter = 0;
  }

  draw(context) {
    // if (!this.ready) context.fillRect(this.x, this.y, this.width, this.height);

    if (!this.ready) {
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

  move() {
    if (this.y - this.height > this.game.height) {
      this.ready = true;
      return;
    }
    if (!this.ready) {
      this.updateFrame();
      this.y += this.speed;
    }
  }

  start(x, y) {
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
