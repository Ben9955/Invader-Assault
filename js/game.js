import Background from "./background.js";
import Shooter from "./shooter.js";
import Projectile from "./projectile.js";
import Beetlemorph from "./enemies/beetlemorph.js";

export default class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.background = new Background(this);
    this.score = 0;
    this.level = 1;
    this.gameOver = false;

    this.shooter = new Shooter(this);
    this.projectiles = [];
    this.numberOfProjecties = 10;
    this.createProjectiles();
    this.fired = false;

    this.keys = [];

    this.enemies = [];
    this.numberOfEnemies = 4;

    document.addEventListener("keydown", (e) => {
      if (!this.keys.includes(e.key)) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          this.keys.push(e.key);
        }

        if (e.key === " " && !this.fired) {
          this.shooter.shoot();
          this.fired = true;
        }
      }
    });

    document.addEventListener("keyup", (e) => {
      this.fired = false;
      const index = this.keys.indexOf(e.key);
      if (index > -1) this.keys.splice(index, 1);
    });
  }

  render(context) {
    this.background.update(); // Update background position
    this.background.draw(context); // Draw the scrolling background

    this.projectiles.forEach((projectile) => {
      projectile.draw(context);
      projectile.move();
    });

    if (this.enemies.length < 1) this.createEnemies();

    this.enemies = this.enemies.filter((enemy) => !enemy.dead);

    this.enemies.forEach((enemy) => {
      enemy.draw(context);
      enemy.update();
    });

    this.shooter.draw(context);
    this.shooter.move();
  }

  createProjectiles() {
    for (let i = 0; i < this.numberOfProjecties; i++) {
      this.projectiles.push(new Projectile());
    }
  }

  createEnemies() {
    let x = 0;
    let y = 0;
    for (let i = 0; i < this.numberOfEnemies; i++) {
      if (x + 50 >= this.width) {
        x = 0;
        y -= 100;
      } else {
        x += 100;
      }
      this.enemies.push(new Beetlemorph(this, x, -(Math.random() * 600)));
    }
  }

  checkCollision(alien, projectile) {
    return (
      projectile.y <= alien.y + alien.height &&
      projectile.y + projectile.height >= alien.y && // Ensure it's in alien's vertical range
      projectile.x + projectile.width > alien.x &&
      projectile.x < alien.x + alien.width
    );
  }
}
