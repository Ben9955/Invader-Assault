window.addEventListener("load", () => {
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 600;
  canvas.height = window.innerHeight * 0.95;
  const game = new Game(canvas);
});
