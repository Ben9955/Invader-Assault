import UserModel from "./model.js";

class ScoresController {
  constructor() {
    this.userModel = new UserModel();
    this.renderUserProfile();
    this.renderLeaderboard();
  }

  // Method to display the current user's profile and score
  renderUserProfile() {
    const currentUser = this.userModel.getCurrentUser();
    if (!currentUser) return;

    const markup = `<h1>Your Scores</h1>
        <div class="user-profile">
          <div class="user-photo">
            <img src=${currentUser.photo} alt="User Profile" />
          </div>
          <div class="user-details">
            <h2>${currentUser.name}</h2>
            <p>Total Score: <span class="score-value">${currentUser.maxScore}</span></p>
          </div>
        </div>`;

    // if user is authenticated upload his profil's scores
    document
      .querySelector(".scores-section")
      .insertAdjacentHTML("afterbegin", markup);
  }

  // Method to display the sorted leaderboard
  renderLeaderboard() {
    const users = this.userModel.users;
    const sortedUsers = users.sort((a, b) => b.maxScore - a.maxScore);

    const leaderboardContainer = document.querySelector(".rankings-list");
    leaderboardContainer.innerHTML = ""; // Clear any previous content

    sortedUsers.forEach((user, index) => {
      const rankingItem = document.createElement("div");
      rankingItem.className = "ranking-item";

      // Add only if in top 3
      const badgeHTML = index < 3 ? this.rankBadge(index) : "";
      rankingItem.innerHTML = `
        <div class="ranking-user">
          <div class="ranking-image">
          <img src="${user.photo}" alt="${user.name}">
          </div>
          <span>${user.name}</span>
          </div>
          <div class="score" >
          <span class="score-value">${user.maxScore}</span>
          ${badgeHTML}
          </div>
      `;
      leaderboardContainer.appendChild(rankingItem);
    });
  }

  rankBadge(index) {
    return `<div class="rank_icon"><img src="../assets/images/gui/rank_${index}.png" alt="rank badge"></div>`;
  }
}

// Instantiate the controller to load scores on page load
document.addEventListener("DOMContentLoaded", () => {
  new ScoresController();

  console.log("fdd");
  const hamburger = document.getElementById("hamburger");
  const navbarMenu = document.querySelector(".navbar__menu");

  hamburger.addEventListener("click", () => {
    navbarMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });
});
