"use strict";

import UserModel from "./model.js";
import AuthView from "./views/authView.js";
import GameMenuView from "./views/gameMenuView.js";
import GameView from "./views/gameView.js";
import PauseWindowView from "./views/pauseWindowView.js";
import GameStatusWindowView from "./views/gameStatusWindowView.js";
import Game from "../game/game.js";
import SpaceshipSelectionView from "./views/spaceshipSelectionView.js";
import SpaceshipBuyView from "./views/spaceshipBuyView.js";

export const spaceships = [
  {
    name: "bomber",
    imgSrc: "../../assets/images/gui/bomber-Idle.png",
    xpRequired: 0,
    speed: 100,
    health: 80,
  },
  {
    name: "corvette",
    imgSrc: "../../assets/images/gui/corvette-Idle.png",
    xpRequired: 300,
    speed: 120,
    health: 90,
  },
  {
    name: "fighter",
    imgSrc: "../../assets/images/gui/fighter-Idle.png",
    xpRequired: 1000,
    speed: 140,
    health: 100,
  },
];

export default class GameController {
  constructor() {
    this.userModel = new UserModel();
    this.game = null;
    this.isPaused = false;
    this.isStatusWindowDisplayed = false;
    this.init();
    this._initializeEventHandlers();

    // Load background music
    this.backgroundMusic = new Audio("../assets/sounds/background_1.mp3");
    this.backgroundMusic.volume = 0.3;
    this.backgroundMusic.loop = true;
    this.backgroundMusic.play();
  }

  init() {
    const currentUser = this.userModel.currentUser;

    // Display either the game menu or login view
    if (currentUser) {
      GameMenuView.generateMarkup();
    } else {
      AuthView.generateMarkup("login");
    }
  }

  _initializeEventHandlers() {
    // Event handlers for authentication views
    AuthView.addSubmitHandler(this.controllSubmitForm.bind(this));
    AuthView.addTogglePromptHandler(this.controllTogglePrompt.bind(this));

    // Event handlers for game menu
    GameMenuView.addStartGameHandler(this.controllStartGame.bind(this));
    GameMenuView.addLogoutHandler(this.controllLogout.bind(this));
    GameMenuView.addSelectSpaceshipHandler(
      this.controllOpenSelectSpaceshipWindow.bind(this)
    );
    GameMenuView.addBuySpaceshipHandler(
      this.controllOpenBuySpaceShipWindow.bind(this)
    );

    // Event handlers for pause window
    PauseWindowView.addResumeGameHandler(this.controllResumeGame.bind(this));
    PauseWindowView.addExitGameHandler(this.controllExitGame.bind(this));

    // Event handlers for game status window
    GameStatusWindowView.addExitGameHandler(this.controllExitGame.bind(this));
    GameStatusWindowView.addNextLevelHandler(this.controllNextLevel.bind(this));
    GameStatusWindowView.addRestartGameHandler(
      this.controlRestartGame.bind(this)
    );

    // Event handlers for spaceship selection view

    SpaceshipSelectionView.addExitSelectionHandler(
      this.controllExitSelection.bind(this)
    );
    SpaceshipSelectionView.addSelectionHandler(
      this.controllSpaceShipSelection.bind(this)
    );

    // Event handler for spaceship purchase view
    SpaceshipBuyView.addPurchaseHandler(
      this.controllPurchaseSpaceShip.bind(this)
    );

    this.initializePauseHandler();
  }

  async controllSubmitForm(e) {
    const form = e.target;
    const email = form.querySelector("#email").value;
    const password = form.querySelector("#password").value;

    if (form.querySelector("h2").innerText === "Login") {
      const result = this.userModel.login(email, password);
      if (result.success) {
        GameMenuView.generateMarkup();
      } else {
        AuthView.showMessage(
          form.querySelector(".input-container"),
          result.message,
          "error"
        );
      }
    } else {
      // Handle signup
      const name = form.querySelector("#name").value;
      const confirmPassword = form.querySelector("#confirm-password").value;
      const gender = form.querySelector("#gender").value;
      const userPhoto = form.querySelector("#user-photo").files[0];

      const result = await this.userModel.signup(
        email,
        name,
        password,
        confirmPassword,
        gender,
        userPhoto
      );
      AuthView.showMessage(
        form.querySelector(".input-container"),
        result.message,
        result.success ? "success" : "error"
      );

      // after 3s send the user to login
      if (result.success) {
        setTimeout(() => {
          AuthView.generateMarkup("login");
        }, 3000);
      }
    }
  }

  controllTogglePrompt(e) {
    const authType =
      e.target.closest(".form").querySelector("h2").innerText === "Login"
        ? "signup"
        : "login";
    AuthView.generateMarkup(authType);
  }

  controllStartGame(isRestart) {
    // Check if this is a new game start, not a restart
    if (!isRestart) {
      const container = document.querySelector(".container");
      const canvas = document.querySelector("#myCanvas");
      this.gameView = new GameView(canvas, container);

      this.gameView.showCanvas(canvas); // Pass canvas directly to the method
      if (!this.gameView.ctx) this.gameView.initializeCanvas(); // Initialize the canvas context if not already set

      // Initialize the Game with the current user
      this.game = new Game(canvas, this.userModel.getCurrentUser());

      // Set background music volume lower for the game
      this.backgroundMusic.volume = 0.2;
    }

    // Hide the navigation bar during gameplay
    const navBar = document.querySelector(".navbar");
    navBar.style.display = "none";

    let lastTime = 0;
    const animate = (timeStamp) => {
      // Only update the game and render if not paused
      if (!this.isPaused) {
        this.gameStatusWindowHandler(); // Handle the display of game status (win/loss)
        const timeElapsed = timeStamp - lastTime;
        lastTime = timeStamp;
        this.gameView.clearCanvas();
        this.game.render(this.gameView.ctx, timeElapsed);
      }
      this.animationFrameId = requestAnimationFrame(animate); // Store the animation frame ID
    };

    animate(0); // Start the game loop
    // Show the pause button during gameplay
    document.querySelector(".btn-pause").style.display = "block";
  }

  controllLogout() {
    // Clear the invaderAssaultId cookie to log the user out

    document.cookie =
      "invaderAssaultId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    AuthView.generateMarkup("login");
  }

  sortUsersByScores() {
    return this.userModel.users.sort((a, b) => b.maxScore - a.maxScore);
  }

  // Method to update the maximum score for the current user
  updateMaxScore() {
    if (this.userModel.getCurrentUser().maxScore < this.game.score)
      this.userModel.updateMaxScore(this.game.score);
  }

  // Update the user's experience points with the game's experience points
  updateExperiencePoints() {
    this.userModel.updateExperiencePoints(this.game.experiencePoints);
  }

  // Update the user's progress
  updateUserProgress() {
    const progress = {
      currentLevel: this.game.currentLevel + 1,
      currentScore: this.game.score,
      livesRemaining: this.game.shooter.lives,
    };
    this.userModel.updateUserProgress(progress);
  }

  resetUserProgress() {
    this.userModel.resetUserProgress();
  }

  controllResumeGame() {
    // Resume the game by setting isPaused to false
    this.isPaused = false;
    if (!this.isPaused) {
      document.querySelector(".btn-pause").style.display = "block";
      document.querySelector(".overlay").style.display = "none";
      document.querySelector(".pause-window").remove();
      this.backgroundMusic.volume = 0.2;
    }
  }

  controllExitGame() {
    // Exit the game and stop the animation loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId); // Cancel the animation frame
      this.animationFrameId = null; // Reset the frame ID
    }

    // Check if a game status window is displayed
    if (this.isStatusWindowDisplayed) {
      const gameStatusWindow = document.querySelector(".gameStatus-window");
      if (gameStatusWindow) gameStatusWindow.remove();

      // Reset the flag for the status window
      this.isStatusWindowDisplayed = false;
    }

    this.isPaused = false;

    // Show the navbar and main container, hide pause button and canvas
    document.querySelector(".navbar").style.display = "flex";
    document.querySelector(".container").style.display = "block";
    document.querySelector(".btn-pause").style.display = "none";
    document.querySelector("#myCanvas").style.display = "none";
    document.querySelector(".overlay").style.display = "none";

    const gamePauseWindow = document.querySelector(".pause-window");
    if (gamePauseWindow) gamePauseWindow.remove();

    GameMenuView.generateMarkup();
  }

  // handle the pause game functionality
  initializePauseHandler() {
    document.querySelector(".btn-pause").addEventListener("click", (e) => {
      this.isPaused = true;
      if (this.isPaused) {
        this.backgroundMusic.volume = 0.3;
        document.querySelector(".overlay").style.display = "block";
        document.querySelector(".btn-pause").style.display = "none";
        PauseWindowView.generateMarkup(this.game.score);
      }
    });
  }

  // handle the window when the level is complete or when the game is over
  gameStatusWindowHandler() {
    // If a status window is already displayed, exit the method
    if (this.isStatusWindowDisplayed) return;

    // Get the highest score record
    const record = this.sortUsersByScores()[0].maxScore;

    // Handle game over scenario
    if (this.game.gameOver) {
      this.handleGameOver("You Lost", record);
    }
    // Handle game won scenario
    else if (this.game.gameWon) {
      this.handleGameOver("You Won", record);
    }
    // Handle level finished scenario
    else if (this.game.levelFinished && !this.isPaused) {
      this.handleLevelFinished(record);
    }
  }

  //               method to handle game over scenarios
  handleGameOver(message, record) {
    this.isPaused = true; // Pause the game
    this.updateMaxScore(); // Update the max score
    this.updateExperiencePoints(); // Update experience points
    GameStatusWindowView.generateMarkup(message, this.game.score, record); // Display the game status
    document.querySelector(".overlay").style.display = "block";
    this.isStatusWindowDisplayed = true; // Set the status window flag
    this.resetUserProgress(); // Reset user progress
    this.game.gameOver = false; // Reset game over state
    this.backgroundMusic.volume = 0.3; // Adjust background music volume
  }

  //  method to handle level finished scenarios
  handleLevelFinished(record) {
    const title = "Level " + this.game.currentLevel; // Create title for level finished
    GameStatusWindowView.generateMarkup(
      title,
      this.game.score,
      record,
      this.game.enemiesDefeatedInCurrentLevel,
      this.game.totalEnemiesInCurrentLevel
    ); // Display level finished status
    document.querySelector(".overlay").style.display = "block";
    this.isStatusWindowDisplayed = true;
    this.game.levelFinished = false;
    this.updateUserProgress();
    this.updateExperiencePoints();
    this.isPaused = true;
    this.backgroundMusic.volume = 0.3;
  }

  controllNextLevel() {
    // Ensure the level is finished before proceeding
    if (!this.game.levelFinished) return;

    // Ensure the game status window is displayed
    if (!this.isStatusWindowDisplayed) return;

    const gameStatusWindow = document.querySelector(".gameStatus-window");
    document.querySelector(".overlay").style.display = "none";

    if (gameStatusWindow) {
      // Remove the game status window
      gameStatusWindow.remove();

      // Reset the flag to allow the window to show for the next level
      this.isStatusWindowDisplayed = false;

      // Reset level finished flag to avoid accidental multiple transitions
      this.game.levelFinished = false;

      // Move to the next level in the game
      this.game.nextLevel();
      this.backgroundMusic.volume = 0.2;

      // Resume the game
      this.isPaused = false;
    } else {
      console.log("Game status window not found!");
    }
  }

  //   restart game
  controlRestartGame() {
    // Exit the game, stop the animation loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId); // Cancel the animation frame
      this.animationFrameId = null; // Reset the frame ID
    }

    const { livesRemaining, currentLevel, currentScore } =
      this.userModel.currentUser.progress;

    this.game.shooter.lives = livesRemaining;
    this.game.score = currentScore;
    this.game.currentLevel = currentLevel;
    this.game.gameOver = false; // Ensure game is not over
    this.game.gameWon = false; // Ensure game is not won
    this.game.levelFinished = false;

    this.isPaused = false; // Ensure game is not paused
    this.isStatusWindowDisplayed = false;

    const gameStatusWindow = document.querySelector(".gameStatus-window");
    document.querySelector(".overlay").style.display = "none";

    if (gameStatusWindow) {
      // Remove the game status window
      gameStatusWindow.remove();
    }

    this.controllStartGame();
  }

  // open the selction spaceship page
  controllOpenSelectSpaceshipWindow() {
    // Retrieve the current user
    const currentUser = this.userModel.getCurrentUser();
    // Get owned spaceships
    const ownedSpaceships = currentUser?.ownedSpaceships || [];
    const spashipSelected = currentUser?.spashipSelected;
    // Filter spaceships based on ownership
    const filteredSpaceships = spaceships.map((ship) => ({
      ...ship,
      isOwned: ownedSpaceships.includes(ship.name),
      isSelected: spashipSelected === ship.name,
    }));

    // Render the spaceship selection view with filtered spaceships
    SpaceshipSelectionView.generateMarkup(filteredSpaceships);
  }

  controllExitSelection() {
    GameMenuView.generateMarkup();
  }

  // select the space ship
  controllSpaceShipSelection(spaceShip) {
    this.userModel.selectSpaceShip(spaceShip);
    this.controllOpenSelectSpaceshipWindow();
  }

  // buy spaceship
  controllOpenBuySpaceShipWindow() {
    // Retrieve the current user
    const currentUser = this.userModel.getCurrentUser();
    const userXP = currentUser?.experiencePoints || 0;

    // Get owned spaceships
    const ownedSpaceships = currentUser?.ownedSpaceships || [];
    // Filter spaceships based on ownership
    const filteredSpaceships = spaceships.filter(
      (ship) => !ownedSpaceships.includes(ship.name)
    );

    // Render the spaceship selection view with filtered spaceships and XP
    SpaceshipBuyView.generateMarkup(filteredSpaceships, userXP);
  }

  controllPurchaseSpaceShip(spaceShip) {
    const ship = spaceships.find((ship) => ship.name === spaceShip);
    this.userModel.purchaseSpaceShip(ship.name, ship.xpRequired);
    this.controllOpenBuySpaceShipWindow();
  }
}
