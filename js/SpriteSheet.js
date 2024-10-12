export default class SpriteSheet {
  constructor(
    image,
    frameDuration,
    frameWidth,
    frameHeight,
    framesX,
    framesY = 1
  ) {
    this.image = image;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.width = this.frameWidth;
    this.height = this.frameHeight;
    this.framesX = framesX;
    this.framesY = framesY;
    this.frameDuration = frameDuration;

    this.currentFrameX = 0;
    this.currentFrameY = 0;
    this.lastFrameTime = 0;
  }

  update(timeElapsed) {
    this.lastFrameTime += timeElapsed;
    if (this.lastFrameTime >= this.frameDuration) {
      this.currentFrameX = (this.currentFrameX + 1) % this.framesX;
      if (this.framesY > 1 && this.currentFrameX === 0) {
        this.currentFrameY = (this.currentFrameY + 1) % this.framesY;
      }
      this.lastFrameTime = 0;
    }
  }

  draw(context, x, y) {
    const frameX = this.currentFrameX * this.frameWidth;
    const frameY = this.currentFrameY * this.frameHeight;
    context.drawImage(
      this.image,
      frameX,
      frameY,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      this.width,
      this.height
    );
  }
}
