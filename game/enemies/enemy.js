//  Parent Class
export default class Enemy {
  constructor(game, x, y, width, height, maxLives, damageToInflict) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.x = x + width >= game.width ? x - width : x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 2;
    this.maxLives = maxLives;
    this.lives = this.maxLives;
    this.damageToInflict = damageToInflict;
    this.status = "passive";
    this.dead = false;
  }

  drawHealthBar(context) {
    context.save();

    const rectWidth = 50;
    const rectHeight = 10;
    const rectX = this.x + (this.width - rectWidth) / 2; // Center the rectangle above the enemy
    const rectY = this.y - 10; // Position 20 pixels above the enemy's y-coordinate

    // Draw the rectangle outline (border)
    context.strokeStyle = "black";
    context.lineWidth = 2;
    context.strokeRect(rectX, rectY, rectWidth, rectHeight);

    // Dynamically fill the rectangle based on enemy's health
    const healthPercent = this.lives / this.maxLives; // Calculate the health percentage
    const fillWidth = rectWidth * healthPercent;

    // Draw the filled part inside the rectangle
    context.fillStyle = healthPercent < 0.5 ? "red" : "green";
    context.fillRect(rectX, rectY, fillWidth, rectHeight);
    context.restore();
  }

  applyDamage(amount) {
    this.lives = Math.max(this.lives - amount, 0);
    if (this.lives === 0) this.status = "dying";
  }

  checkShooterProjectilesAndApplyDamage() {
    this.game.shooter.projectiles.forEach((projectile) => {
      if (
        !projectile.ready &&
        this.game.checkCollision(this, projectile) &&
        this.lives > 0
      ) {
        this.applyDamage(this.game.shooter.damageToInflict);
        // this.lives -= this.game.shooter.damageToInflicte;
        projectile.reset();
      }
    });
  }

  detectPotentialCollisionWithEnemies() {
    const otherEnemies = this.game.enemies.filter((enemy) => enemy !== this);

    // Check for potential collisions with other aliens
    const willCollideWithAnotherAlien = otherEnemies.some((enemy) => {
      const futureX = this.x + this.speedX;

      const horizontalOverlap =
        futureX < enemy.x + enemy.width && futureX + this.width > enemy.x;

      const verticalOverlap =
        this.y < enemy.y + enemy.height && this.y + this.height > enemy.y;

      return horizontalOverlap && verticalOverlap;
    });

    return willCollideWithAnotherAlien;
  }

  isAtScreenEdge() {
    return (
      this.x + this.speedX + this.width > this.game.width ||
      this.x + this.speedX < 0
    );
  }
}
