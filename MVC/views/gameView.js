export default class GameView {
  // Initializes a new GameView with a canvas and a container element.
  constructor(canvas, container) {
    this.canvas = canvas;
    this.container = container;
    this.ctx = null;
  }

  // Sets up the canvas context and dimensions.
  initializeCanvas() {
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Set canvas styles
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "white";
    this.ctx.lineWidth = 5;
    this.ctx.font = "15px 'Ethnocentric'";
  }

  // Displays the canvas and hides the container element.
  showCanvas() {
    this.container.style.display = "none";
    this.canvas.style.display = "block";
  }

  // Clears all content on the canvas.
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
