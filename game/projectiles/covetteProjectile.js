export default class CorvetteProjectile {
  constructor() {
    this.width = 3;
    this.height = 24;
    this.x = 0;
    this.y = 0;
    this.speed = 10;
    this.ready = true;
    this.image = new Image();
    this.charge1Src = "../assets/images/game/corvette-charge1.png";
    this.charge1Height = 24;
    this.charge1Width = 3;

    this.type = "charge1";

    this.charge2Width = 3;
    this.charge2Height = 46;
    this.charge2Src = "../assets/images/game/corvette-charge2.png";
  }

  draw(context) {
    if (!this.ready) {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
  }

  move() {
    if (this.y + this.height < 0) {
      this.ready = true;
      return;
    }
    if (!this.ready) {
      this.y -= this.speed;
    }
  }

  start(x, y, type) {
    if (type === "charge2") {
      this.type = "charge2";
      this.image.src = this.charge2Src;
      this.height = this.charge2Height;
      this.width = this.charge2Width;
      this.speed = 15;
    } else {
      this.type = "charge1";
      this.image.src = this.charge1Src;
      this.height = this.charge1Height;
      this.width = this.charge1Width;
      this.speed = 8;
    }
    this.x = x;
    this.y = y;
    this.ready = false;
  }

  reset() {
    this.ready = true;
  }
}
