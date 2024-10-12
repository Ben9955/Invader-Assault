export default class PowerUp {
  constructor(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 20; // Adjust as needed
    this.type = this.randomType();
    this.image = new Image();
    this.image.src = `./images/powerup-${this.type}.png`; // Image based on type
  }

  randomType() {
    const types = ["health", "damage", "speed", "shield"];
    return types[Math.floor(Math.random() * types.length)];
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.game.background.speed; // Move down the screen
    if (this.y > this.game.height) {
      this.game.removePowerUp(this); // Remove if off screen
    }
  }
}
