export default class AlienBullet {
  constructor(game) {
    this.game = game;
    this.width = 6;
    this.height = 15;
    this.x = 0;
    this.y = 0;
    this.speed = 18;
    this.ready = true;
  }

  draw(context) {
    if (!this.ready) context.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    if (this.y - this.height > this.game.height) {
      this.ready = true;
      return;
    }
    if (!this.ready) this.y += this.speed;
  }

  start(x, y) {
    this.x = x;
    this.y = y;
    this.ready = false;
  }

  reset() {
    this.ready = true;
  }
}
