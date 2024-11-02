import GameController from "./MVC/controller.js";

// Wait for the DOM to load before initializing the controller
window.addEventListener("load", () => {
  const gameController = new GameController(); // This will call init() automatically

  const hamburger = document.getElementById("hamburger");
  const navbarMenu = document.querySelector(".navbar__menu");

  hamburger.addEventListener("click", () => {
    navbarMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });
});
