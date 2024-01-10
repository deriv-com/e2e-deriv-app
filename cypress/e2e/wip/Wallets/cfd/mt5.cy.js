import "@testing-library/cypress/add-commands";

function clickAddMt5Button() {
  cy.get('.wallets-available-mt5__details')
    .next('.wallets-trading-account-card__content > .wallets-button')
    .first()
    .click();
}

function verifyJurisdictionSelection(accountType) {
  cy.findByText(`Choose a jurisdiction for your Deriv MT5 ${accountType} account`, { exact: true }).should("be.visible");
  cy.findByText('St. Vincent & Grenadines').click()
  cy.findByRole('button', { name: 'Next' }).click();
}

function verifyDerivMT5Creation(accountType) {
  let expectedText;
  if (accountType === 'Derived') {
    expectedText = 'Create a Deriv MT5';
    cy.get('div').contains(expectedText).should("be.visible");
    cy.findByPlaceholderText('Deriv MT5 password').click().type(Cypress.env('mt5Password'));
    cy.findByRole('button', { name: 'Create Deriv MT5 password' }).click();
  } else {
    expectedText = 'Enter your Deriv MT5 password';  // Adjust this text based on your actual requirement
    cy.get('div').contains(expectedText).should("be.visible");
    cy.findByPlaceholderText('Deriv MT5 password').click().type(Cypress.env('mt5Password'));
    cy.findByRole('button', { name: 'Add account' }).click();
  }
}

function verifyTransferFundsMessage(accountType) {
  cy.findByText(`Transfer funds from your USD Wallet to your ${accountType} (SVG) account to start trading.`).should("be.visible");
  cy.get(`div:contains("Deriv MT5 ${accountType} (SVG)USD Wallet0.00 USDYour ${accountType} (SVG) account is ready")`).eq(2).should("be.visible");
}

describe("WALL-2000 - Create MT5 account", () => {
  
  beforeEach(() => {
    cy.c_login("wallets");
    cy.c_visitResponsive("/wallets", "large");
  });

  it("should be able to create mt5 svg account", () => {
    cy.log("create mt5 svg account");
    cy.findByText("CFDs", { exact: true }).should("be.visible");

    clickAddMt5Button();
    verifyJurisdictionSelection('Derived');
    verifyDerivMT5Creation('Derived');
    verifyTransferFundsMessage('Derived');
    cy.findByRole('button', { name: 'Maybe later' }).should('exist');
    cy.findByRole('button', { name: 'Transfer funds' }).should('exist');
    cy.findByRole('button', { name: 'Maybe later' }).click();

    clickAddMt5Button();
    verifyJurisdictionSelection('Financial');
    verifyDerivMT5Creation('Financial');
    verifyTransferFundsMessage('Financial');
    cy.findByRole('button', { name: 'Maybe later' }).should('exist');
    cy.findByRole('button', { name: 'Transfer funds' }).should('exist');
    cy.findByRole('button', { name: 'Maybe later' }).click();
  });
});
