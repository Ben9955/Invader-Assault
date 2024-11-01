export default class GameMenuView {
  static container = document.querySelector(".container");

  //    Generates and inserts the HTML markup for the game menu interface.
  static generateMarkup() {
    const markup = `<section class="game-dashboard"> 
        <h1>
          Invader Assault <br />
          <span> Ark </span>
        </h1>
        <div class="game-options">
          <button class="btn btn-start">Start</button>
          <button class="btn btn-select-spaceship">Select Spaceship</button>
          <button class="btn btn-buy-spaceship">Buy Spaceship</button>
          <a href="index.html" class="btn btn-logout">Logout</a>
        </div>
      </section>`;

    GameMenuView.container.innerHTML = "";
    GameMenuView.container.insertAdjacentHTML("beforeend", markup);
    // generateRankingMarkup();
  }

  // Adds an event listener to handle the Start Game button click.
  static addStartGameHandler(handler) {
    this.container.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-start");
      if (!btn) return;

      handler();
    });
  }

  // Adds an event listener to handle the Select Spaceship button click.
  static addSelectSpaceshipHandler(handler) {
    this.container.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-select-spaceship");
      if (!btn) return;

      handler();
    });
  }

  // Adds an event listener to handle the Buy Spaceship button click.
  static addBuySpaceshipHandler(handler) {
    this.container.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-buy-spaceship");
      if (!btn) return;

      handler();
    });
  }

  // Adds an event listener to handle the Logout button click.
  static addLogoutHandler(handler) {
    this.container.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-logout");
      if (!btn) return;

      handler();
    });
  }
}
