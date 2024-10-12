export default class Beetlemorph {
  constructor(game, x, y) {
    this.game = game;
    this.width = 30;
    this.height = 30;
    this.x = x > this.game.width - this.width ? x - this.width : x;
    this.y = y;
    this.speedY = 1.5;
    this.speedX = 1.5;

    this.lives = 2;
    this.dead = false;
    // Sprite sheet details
    this.frameWidth = 80;
    this.frameHeight = 80;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame = 2;
    this.image = new Image();
    this.image.src = "./images/beetlemorph.png";

    this.reverseTimer = 0;
    this.frameChangeTimer = 0;

    // Sound explosion
    this.explosionSound = new Audio("./sounds/explosion-alien1.mp3"); // Load sound file
    this.explosionSound.volume = 1; // Adjust volume (optional)
  }

  draw(context) {
    if (this.y < 0 && this.y >= this.height * -1) this.y += 10;

    // // Calculate scaling based on the y position
    const maxScaleDistance = this.game.shooter.y; // The y position of the shooter
    const scaleFactor = Math.min(
      1,
      Math.min(1.5, this.y / maxScaleDistance) + 0.3
    );

    // Calculate new width and height based on the scale
    const scaledWidth = this.width * scaleFactor;
    const scaledHeight = this.height * scaleFactor;

    context.drawImage(
      this.image,
      this.frameX * this.frameWidth, // Correct the frame positioning
      this.frameY,
      this.frameWidth,
      this.frameHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update(timeElapsed) {
    this.reverseTimer += timeElapsed;
    if (this.dead) return;

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

    if (this.lives < 1 && !this.dead) {
      this.frameChangeTimer += timeElapsed;
      if (this.frameChangeTimer >= 90) {
        this.frameX++;
        this.frameChangeTimer = 0;
      }
      // Play sound
      this.explosionSound.currentTime = 0; // Reset sound to start (in case it's still playing)
      this.explosionSound.play(); // Play sound

      if (this.frameX > this.maxFrame) {
        this.dead = true;
        this.game.score++;
      }
    }

    if (this.game.currentLevel === 4) {
      this.y += this.speedY;
      if (this.reverseTimer >= 1000) {
        this.speedX *= -1;
        this.reverseTimer = 0;
      }
      this.x += this.speedX;
    } else this.y += this.game.background.speedY + this.speedY;
  }
}
