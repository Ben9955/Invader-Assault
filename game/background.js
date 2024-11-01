export default class Background {
  constructor(game) {
    this.game = game;
    this.image = new Image();
    this.image.src = "../assets/images/game/background.jpg";

    this.width = this.game.canvas.width;
    this.height = this.game.canvas.height;

    // Y position for vertical scrolling
    this.y1 = 0;
    this.y2 = -this.height;
    this.speed = 1; // Scrolling speed
  }

  draw(context) {
    // Draw two images: one on screen and one above the screen to simulate continuous scrolling
    context.drawImage(this.image, 0, this.y1, this.width, this.height);
    context.drawImage(this.image, 0, this.y2, this.width, this.height);
  }

  update() {
    if (this.game.shooter.status === "boost") this.speed = 3;
    else {
      this.speed = 1;
    }
    // Move both background images downward
    this.y1 += this.speed;
    this.y2 += this.speed;

    // reset its position when the images move completely off the screen
    if (this.y1 >= this.height) {
      this.y1 = -this.height;
    }
    if (this.y2 >= this.height) {
      this.y2 = -this.height;
    }
  }
}
