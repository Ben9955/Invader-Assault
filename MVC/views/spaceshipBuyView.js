export default class SpaceshipBuyView {
  static container = document.querySelector(".container");

  // Generates and displays the spaceship purchase markup
  static generateMarkup(spaceships, userXP) {
    let markup = "";

    // If no spaceships are available, show a message
    if (spaceships.length === 0) {
      markup = `<section class="spaceship-selection">
                    <h2>No spaceships available to purchase in this moment</h2>
                    <button class="btn-close"/>Close</button>
                </section>`;
    } else
      markup = `<section class="spaceship-selection">
            <h2>Available Spaceships for Purchase</h2> 
            <div class="cards__container spaceship-options">
                ${spaceships
                  .map(
                    (ship) => `
                    <div class="card spaceship-card unlocked">
                        <img src="${ship.imgSrc}" alt="${ship.name} image" />
                        <h3>${ship.name}</h3>
                        <p>XP Required: ${ship.xpRequired}</p>
                        <p>Speed: ${ship.speed}</p>
                        <p>Health: ${ship.health}</p>
                        <button class="purchase-btn" data-id="${ship.name}" ${
                      ship.xpRequired > userXP ? "disabled" : ""
                    }>Purchase</button>
                    </div>`
                  )
                  .join("")}
            </div>
            <h3>Your XP = ${userXP}</h3>
             <button class="btn-close"/>Close</button>
          </section>`;

    SpaceshipBuyView.container.innerHTML = markup;
  }

  // Sets up an event listener for spaceship purchases
  static addPurchaseHandler(handler) {
    this.container.addEventListener("click", function (e) {
      const btn = e.target.closest(".purchase-btn");
      if (!btn) return;
      const spaceshipId = btn.dataset.id;
      handler(spaceshipId);
    });
  }
}
