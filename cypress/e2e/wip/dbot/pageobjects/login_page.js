class LoginPage {
  get loginButton() {
    return cy.get("#dt_login_button");
  }

  get emailInput() {
    return cy.get("input#txtEmail");
  }

  get passwordInput() {
    return cy.get("input#txtPass");
  }

  get loginSubmitButton() {
    return cy.get("button[name='login']");
  }

  enterCredentials = (userID, password) => {
    this.emailInput.type(userID);
    this.passwordInput.type(password);
  };

  loginToDerivApp = (userID, password) => {
    this.loginButton.click();
    this.enterCredentials(userID, password);
    this.loginSubmitButton.click();
  };
}

export default LoginPage;
