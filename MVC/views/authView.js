export default class AuthView {
  static container = document.querySelector(".container");

  // Generates and injects the appropriate HTML markup based on the provided authentication type (login or signup).
  static generateMarkup(authType) {
    const markup =
      authType === "login"
        ? this.generateLoginMarkup()
        : this.generateSignupMarkup();

    AuthView.container.innerHTML = "";
    AuthView.container.insertAdjacentHTML("beforeend", markup);
  }

  // Adds an event listener for form submission, preventing default form behavior and calling the provided handler.
  static addSubmitHandler(handler) {
    AuthView.container.addEventListener("submit", function (e) {
      e.preventDefault();
      const btn = e.target.closest(".form");
      if (!btn) return;

      handler(e);
    });
  }

  //  Adds an event listener to toggle between login and signup forms when the user clicks the prompt link.
  static addTogglePromptHandler(handler) {
    this.container.addEventListener("click", function (e) {
      const btn = e.target.closest(".togglePrompt");
      if (!btn) return;

      handler(e);
    });
  }

  //    Generates the HTML markup for the login form.
  static generateLoginMarkup() {
    return `<form class="form ">
                <h2>Login</h2>   
              <div class="form-body">
                <div class="input-container">
                  <label for="email">Email</label>
                  <input type="email" placeholder="Email" id="email" required />
                </div>
                <div class="input-container">
                  <label for="password">Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    required
                  />
                </div>
                <p>Don't you have an account? <span class="togglePrompt">Signup</span></p>      
              </div> 
              <div class="">
                <button type="reset"><i class="fa-solid fa-xmark"></i></button>
                <button type="submit"><i class="fa-solid fa-check"></i></button>
              </div>
             </form>`;
  }

  // Generates the HTML markup for the signup form.
  static generateSignupMarkup() {
    return `<form class="form ">        
                <h2>Signup</h2>
              <div class="form-body">
                <div class="input-container">
                  <label for="email">Email</label>
                  <input type="email" placeholder="Email" id="email" required />
                </div>
                <div class="input-container">
                  <label for="name">Name</label>
                  <input type="text" placeholder="Name" id="name" required />
                </div>
                <div class="input-container">
                  <label for="password">Password</label>
                  <input
                    type="password"
                    placeholder="Password"
                    id="password"
                    required
                  />
                </div>
                <div class="input-container">
                  <label for="confirm-password">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    id="confirm-password"
                    required
                  />
                </div>
                   <div class="input-container">
                    <label for="gender">Gender</label>
                    <select id="gender" required>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                <div class="input-container">
                  <label for="user-photo">User Photo</label>
                  <input type="file" id="user-photo" accept=".jpg, .jpeg, .png" />
                </div>
                <p>Do you have an account? <span class="togglePrompt">Login</span></p>      
              </div>
              <div class="">
                <button type="reset"><i class="fa-solid fa-xmark"></i></button>
                <button type="submit"><i class="fa-solid fa-check"></i></button>
              </div>
            </form>`;
  }

  //     Displays a message (either error or success)
  static showMessage(parent, message, type) {
    // Remove any existing message (either error or success)
    const existingError = parent.querySelector(".error-message");
    const existingSuccess = parent.querySelector(".success-message");

    if (existingError) existingError.remove();
    if (existingSuccess) existingError.remove();

    const markup = `<span class="${
      type === "error" ? "error-message" : "success-message"
    }">${message}</span>`;
    parent.insertAdjacentHTML("afterbegin", markup);
  }
}
