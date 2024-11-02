export default class PowerUp {
  constructor(game, type) {
    this.game = game;
    this.x = -50;
    this.y = -50;
    this.width = 50;
    this.height = 50;
    this.type = type;
    this.image = new Image();
    this.image.src = `../assets/images/game/powerup-${this.type}.png`; // Image based on type
    this.ready = true;
    this.collected = false;
    this.speed = 3;

    // Sound
    this.collectSound = new Audio("../assets/sounds/collect-powerup.mp3");
    this.collectSound.volume = 0.6;
  }

  draw(context) {
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    if (this.ready) return;
    // Collision detection with shooter
    if (
      this.x < this.game.shooter.x + this.game.shooter.width &&
      this.x + this.width > this.game.shooter.x &&
      this.y < this.game.shooter.y + this.game.shooter.height &&
      this.y + this.height > this.game.shooter.y
    ) {
      if (!this.collected) this.collect();
      return;
    }

    this.y += this.speed; // Move down the screen

    if (this.collected && this.width <= 20) this.reset();

    if (this.y > this.game.height) this.reset();
  }

  collect() {
    // Reduce size before disappearing for visual effect for animation effect
    this.height = 20;
    this.width = 20;
    this.x += 15;
    this.collected = true;

    //play sound
    this.collectSound.currentTime = 0;
    this.collectSound.play();

    // Call method to apply the effect based on type
    if (this.type === "health") {
      this.game.shooter.increaseHealth();
    } else if (this.type === "upgrade") {
      this.game.shooter.upgrade();
    } else if (this.type === "xp") {
      const xpPoints = Math.floor(Math.random() * 50) + 10; // range of 10 to 50 XP
      this.game.addExperiencePoints(xpPoints); // Add XP to player’s total
    }
  }

  reset() {
    this.ready = true;
    this.collected = false;
    this.x = -50;
    this.y = -50;
    this.width = 50;
    this.height = 50;
    this.game.removePowerUp(this);
  }
}
