export default class PauseWindowView {
  static container = document.querySelector("body");

  // Generates and injects the markup for the pause window.
  static generateMarkup(currentScore) {
    const markup = `<div class="pause-window window">
      <div class="window-header">
        <h2>Pause</h2>
      </div>
      <div class="window-body">
        <div class="score">
          <p>Score</p>
          <div class="currentscore">${currentScore}</div>
        </div>
      </div>
      <div class="window-footer">
        <button class="btn_game"><i class="fa-solid fa-gear"></i></button>
        <button class="btn-resume btn_game"><i class="fa-solid fa-play"></i></button>
        <button  class="btn-exit btn_game"><i class="fa-solid fa-right-from-bracket"></i></button>
      </div>
    </div>`;

    PauseWindowView.container.insertAdjacentHTML("beforeend", markup);
  }

  static addResumeGameHandler(handler) {
    this.container.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-resume");
      if (!btn) return;

      handler();
    });
  }

  static addExitGameHandler(handler) {
    this.container.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-exit");
      if (!btn) return;

      handler();
    });
  }

  static addShowTopScoresHandler(handler) {
    this.container.addEventListener("click", function (e) {
      const btn = e.target.closest(".rankings");
      if (!btn) return;

      handler();
    });
  }
}
