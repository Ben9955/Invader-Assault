"use strict";

export default class UserModel {
  constructor() {
    this.users = JSON.parse(localStorage.getItem("invaderUsers")) || [];
    this.currentUser = null;
    this.init();
  }

  // this will check is there is any user authenticated
  init() {
    const cookies = document.cookie.split("; ");

    let id = cookies
      .find((cookie) => cookie.startsWith("invaderAssaultId"))
      ?.split("=")[1];

    if (id) {
      const user = this.users?.find((user) => user.email === id);
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    }
  }

  // Handle user login
  login(email, password) {
    const user = this.users.find((user) => user.email === email);
    if (user?.password === password) {
      this.currentUser = user;
      document.cookie = `invaderAssaultId=${user.email}; max-age=3600; path=/`;
      return { success: true }; // Login successful
    }
    return { success: false, message: "Invalid email or password." }; // Login failed
  }

  // Handle user signup
  async signup(email, name, password, confirmPassword, gender, photoFile) {
    if (this.users.find((user) => user.email === email)) {
      return { success: false, message: "Email is already registered." };
    }

    if (password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 charcters long.",
      };
    }

    if (password !== confirmPassword) {
      return { success: false, message: "Passwords don't match." };
    }

    const maxFileSize = 200 * 1024; // 200kb

    // check the type and size of the photo
    if (photoFile) {
      if (photoFile.type !== "image/jpeg" && photoFile.type !== "image/png") {
        return {
          success: false,
          message: "Please upload a valid image (JPG, PNG).",
        };
      } else if (photoFile.size > maxFileSize) {
        return {
          success: false,
          message: "Image size should not exceed 200 KB.",
        };
      }
    }

    // Convert photo to Base64 if provided
    const base64Photo = photoFile
      ? await this.convertFileToBase64(photoFile)
      : null;

    // Save new user
    this.saveUser(email, name, password, gender, base64Photo);
    return { success: true, message: "Signup successful!" };
  }

  // Convert the photo to Base64 format
  convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Save user to localStorage
  saveUser(email, name, password, gender, base64Photo) {
    const user = {
      email,
      name,
      password,
      gender,
      // here in case the user dont upload a image or for any resone we cant get the base64Photo we are going to se a defualt  profile img based on the gender
      photo: base64Photo || `./assets/images/gui/profile-${gender}.avif`,
      maxScore: 0,
      level: 1,
      experiencePoints: 0,
      ownedSpaceships: ["bomber"],
      spashipSelected: "bomber",
      progress: {
        currentLevel: 1,
        currentScore: 0,
        livesRemaining: 10,
      },
    };
    this.users.push(user);
    localStorage.setItem("invaderUsers", JSON.stringify(this.users));
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Set current user
  setCurrentUser(user) {
    this.currentUser = user;
  }

  updateMaxScore(newMaxScore) {
    if (this.currentUser) {
      if (this.currentUser.maxScore < newMaxScore) {
        this.currentUser.maxScore = newMaxScore; // Update maxScore
        this.updateUser(this.currentUser); // Save the updated user
      }
    }
  }

  // update xp
  updateExperiencePoints(newExperiencePoints) {
    if (this.currentUser) {
      this.currentUser.experiencePoints = newExperiencePoints;
      this.updateUser(this.currentUser);
    }
  }

  // Update progress
  updateUserProgress(progress) {
    this.currentUser.progress = progress;
    this.updateUser(this.currentUser); // Save the updated user
  }

  // reset progress
  resetUserProgress() {
    if (this.currentUser) {
      // reset progress
      this.currentUser.progress = {
        currentLevel: 1,
        currentScore: 0,
        livesRemaining: 10,
      };
      this.updateUser(this.currentUser); // Save the updated user
    }
  }

  //  select space ship
  selectSpaceShip(spaceShip) {
    this.currentUser.spashipSelected = spaceShip.toLowerCase();
    this.updateUser(this.currentUser);
  }

  // purchase SpaceShip
  purchaseSpaceShip(spaceShip, xp) {
    this.currentUser.experiencePoints -= xp;
    this.currentUser.ownedSpaceships.push(spaceShip);
    this.updateUser(this.currentUser); // Save the updated user
  }

  // this method update the user  and save it in the local storage
  updateUser(newUser) {
    const users = JSON.parse(localStorage.getItem("invaderUsers"));
    const oldUser = users.find((user) => user.email === newUser.email);
    if (!oldUser) {
      console.error("User not found!");
      return;
    }
    const index = users.indexOf(oldUser);
    users.splice(index, 1);
    users.push({ ...newUser, password: oldUser.password });
    this.users = users;
    localStorage.setItem("invaderUsers", JSON.stringify(users));
  }
}
