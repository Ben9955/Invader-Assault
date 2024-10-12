// "use strict";

import Game from "./js/game.js";

const canvas = document.getElementById("myCanvas");
window.addEventListener("load", () => {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 5;
  ctx.font = "30px Impact";
  const game = new Game(canvas);

  let lastTime = 0;

  function animate(timeStamp) {
    const timeElapsed = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx, timeElapsed);
    requestAnimationFrame(animate);
  }

  animate(0);
});
