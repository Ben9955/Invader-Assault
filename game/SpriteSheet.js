// The SpriteSheet class manages the animation frames of a sprite sheet.
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

  // Updates the sprite sheet’s current frame based on elapsed time.
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

  //  Draws the current frame of the sprite sheet onto a given context.
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

  isLastFrame() {
    return (
      this.currentFrameX === this.framesX - 1 &&
      this.currentFrameY === this.framesY - 1
    );
  }
}
