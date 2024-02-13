import "@testing-library/cypress/add-commands";

function generate_epoch() {
  return Math.floor(new Date().getTime() / 100000);
}

describe("QATEST-5569: Verify MF Signup flow", () => {
  const epoch = generate_epoch();
  const sign_up_mail = `sanity${epoch}MF@deriv.com`;
  let verification_code;

  beforeEach(() => {
    localStorage.setItem("config.server_url", Cypress.env("stdConfigServer"));
    localStorage.setItem("config.app_id", Cypress.env("stdConfigAppId"));
    cy.c_visitResponsive("/endpoint", "desktop");
    cy.findByRole("button", { name: "Sign up" }).should("not.be.disabled");
    cy.c_enterValidEmail(sign_up_mail);
  });
  it("Verify I can signup for an MF demo and real account", () => {
    cy.wait(5000); //TODO - To be replaced by a loop within the emailVerification below.
    cy.c_emailVerificationSignUp(
      verification_code,
      Cypress.env("event_email_url"),
      epoch
    );
    cy.then(() => {
      cy.c_visitResponsive("/endpoint", "desktop").then(() => {
        cy.window().then((win) => {
          win.localStorage.setItem(
            "config.server_url",
            Cypress.env("stdConfigServer")
          );
          win.localStorage.setItem(
            "config.app_id",
            Cypress.env("stdConfigAppId")
          );
        });
      });

      verification_code = Cypress.env("emailVerificationCode");
      const today = new Date();
      const signupUrl = `${Cypress.config(
        "baseUrl"
      )}/redirect?action=signup&lang=EN_US&code=${verification_code}&date_first_contact=${
        today.toISOString().split("T")[0]
      }&signup_device=desktop`;
      cy.c_visitResponsive(signupUrl, "desktop");
      cy.get("h1").contains("Select your country and").should("be.visible");
      cy.c_selectCountryOfResidence(Cypress.env("CoRMF"));
      cy.c_selectCitizenship(Cypress.env("citizenshipMF"));
      cy.c_enterPassword();
    });
    cy.c_generateRandomName().then((firstName) => {
      cy.c_personalDetails(firstName, "MF", Cypress.env("CoRMF"));
    });
    cy.c_addressDetails();
    cy.c_completeTradingAssessment();
    cy.c_completeFinancialAssessment();
    cy.c_addAccountMF();
    cy.get('#traders-hub').scrollIntoView({ position: 'top' })
    cy.findByText('Total assets').should('be.visible');
    cy.findByText('0.00').should('be.visible');
    cy.c_manageAccountsetting(Cypress.env("CoRMF"));
  });
});
