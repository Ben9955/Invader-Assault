export default class PowerUp {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50; // Adjust as needed
    this.type = this.randomType();
    this.image = new Image();
    this.image.src = `./images/powerup-${this.type}.png`; // Image based on type
  }

  randomType() {
    const types = ["health", "upgrade"];
    return types[Math.floor(Math.random() * types.length)];
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    if (
      this.x < this.game.shooter.x + this.game.shooter.width &&
      this.x + this.width > this.game.shooter.x &&
      this.y < this.game.shooter.y + this.game.shooter.height &&
      this.y + this.height > this.game.shooter.y
    ) {
      // Reduce power-up size
      this.height -= 20;
      this.width -= 20;
      this.x += 10;

      // Remove power-up after collision is complete
      if (this.y >= this.game.shooter.y) this.game.removePowerUp(this);
    }

    this.y += this.game.background.speed; // Move down the screen
    if (this.y > this.game.height) {
      this.game.removePowerUp(this); // Remove if off screen
    }
  }
}
