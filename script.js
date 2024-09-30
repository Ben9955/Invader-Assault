class Shooter {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 100;
    this.x = game.canvas.width;
    this.y = game.canvas.height;
  }

  draw(context) {}
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
  }

  render() {}
}

window.addEventListener("load", () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = window.innerHeight * 0.95;
  const game = new Game(canvas);
});
