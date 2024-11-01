export default class GameStatusWindowView {
  static container = document.querySelector("body");

  // Displays the score, record, and stars, along with buttons for next level, restart, or exit.
  static generateMarkup(
    title,
    currentScore,
    record,
    enemiesdefeated,
    totalEnemies
  ) {
    const markup = `<div class="window gameStatus-window">
      <div class="window-header">
        <h2>${title}</h2>
      </div>
      <div class="window-body">
        <div class="stars">
        ${
          title.toLowerCase().startsWith("you")
            ? GameStatusWindowView.generateStarsBasedOnScore(
                title,
                currentScore,
                record
              )
            : GameStatusWindowView.generateStarsBasedEnemiesDefeated(
                enemiesdefeated,
                totalEnemies
              )
        }
        </div>
        <div class="score">
          <p>SCORE</p>
          <div class="currentscore">${currentScore}</div>
        </div>
        <div class="score record">
          <p>RECORD</p>
          <div class="currentscore">${record}</div>
        </div>
      </div>
      <div class="window-footer">
      ${
        title.toLowerCase().startsWith("level")
          ? `<button class="btn-nextLevel btn_game">
            <i class="fa-solid fa-jet-fighter-up"></i>
          </button>`
          : `<button class="btn-restart btn_game">
            <i class="fa-solid fa-rotate-left"></i>
          </button>`
      }
        <button class="btn-exitStatus btn_game">
          <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>
    </div>`;

    GameStatusWindowView.container.insertAdjacentHTML("beforeend", markup);
  }

  static addRestartGameHandler(handler) {
    this.container.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-restart");
      if (!btn) return;

      handler();
    });
  }

  static addExitGameHandler(handler) {
    this.container.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-exitStatus");
      if (!btn) return;

      handler();
    });
  }

  static addNextLevelHandler(handler) {
    this.container.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-nextLevel");
      if (!btn) return;
      handler();
    });
  }

  // Generates star icons based on the user's score relative to the record.
  static generateStarsBasedOnScore(title, currentScore, record) {
    const titleLowerCase = title.toLowerCase();
    let star1 = 1;
    let star2 = 1;
    let star3 = 1;

    // in the window we are gonna show the stars dynamically
    // if the user lose all the stars are gonna be empty and if wins based on the score we are gonna show different stars
    if (titleLowerCase.endsWith("won")) {
      star1 = currentScore >= record * 0.5 ? 3 : 2;
      star2 = currentScore >= record * 0.75 ? 3 : 2;
      star3 = currentScore >= record ? 3 : 2;
    }

    return `<div class="star">
              <img src="./assets/images/game/Star_${star1}.png" alt="star" />
              </div>
              <div class="star">
              <img src="./assets/images/game/Star_${star2}.png" alt="star" />
              </div>
              <div class="star">
              <img src="./assets/images/game/Star_${star3}.png" alt="star" />
            </div>`;
  }

  // Generates star icons based on the number of enemies defeated relative to the total.
  static generateStarsBasedEnemiesDefeated(enemiesdefeated, totalEnemies) {
    let star1 = enemiesdefeated >= totalEnemies * 0.5 ? 3 : 2;
    let star2 = enemiesdefeated >= totalEnemies * 0.75 ? 3 : 2;
    let star3 = enemiesdefeated >= totalEnemies ? 3 : 2;

    return `<div class="star">
              <img src="./assets/images/game/Star_${star1}.png" alt="star" />
              </div>
              <div class="star">
              <img src="./assets/images/game/Star_${star2}.png" alt="star" />
              </div>
              <div class="star">
              <img src="./assets/images/game/Star_${star3}.png" alt="star" />
            </div>`;
  }
}
