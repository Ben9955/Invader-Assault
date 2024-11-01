export default class SpaceshipSelectionView {
  static container = document.querySelector(".container");

  // Generates and displays the spaceship selection markup
  static generateMarkup(spaceships) {
    const markup = `<section class="spaceship-selection">
        <h2>Select Your Spaceship</h2>
        <div class="cards__container spaceship-options">
            ${spaceships
              .map((ship) => {
                return `
                  <div class="card spaceship-card ${
                    ship.isOwned
                      ? ship.isSelected
                        ? "selected"
                        : ""
                      : "locked"
                  }">
                      <img src="${ship.imgSrc}" alt="${ship.name} image" />
                      <h3>${ship.name}</h3>
                     ${
                       ship.isOwned
                         ? ""
                         : `<p>XP Required:${ship.xpRequired}</p>`
                     }
                      <p>Speed: ${ship.speed}</p>
                      <p>Health: ${ship.health}</p>
                      <button class="select-btn" data-id="${ship.name}" ${
                  ship.isOwned && !ship.isSelected ? "" : "disabled"
                }>Select</button>
                  </div>`;
              })
              .join("")}
        </div>
        <button class="btn-close">Close</button>
      </section>`;

    SpaceshipSelectionView.container.innerHTML = markup;
  }

  static addSelectionHandler(handler) {
    this.container.addEventListener("click", function (e) {
      const btn = e.target.closest(".select-btn");
      if (!btn) return;

      const spaceshipId = btn.dataset.id;
      handler(spaceshipId);
    });
  }

  static addExitSelectionHandler(handler) {
    this.container.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn-close");
      if (!btn) return;

      handler();
    });
  }
}
