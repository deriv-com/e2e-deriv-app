import "@testing-library/cypress/add-commands"

function onboardingdemowallet() {
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    // Onboarding - Account having Demo wallets (without CFD and Trading account).
    cy.findByTestId('dt_traders_hub_onboarding_icon').click()
    cy.get('.react-joyride__spotlight').should('exist')
    cy.get('[class*="wallets-accordion wallets-accordion"]').first().should('be.visible')
      .children()
      .eq(1)
      .should('be.visible') 
    cy.contains("This is your Wallet. These are the functions that you can perform within this Wallet and you can conveniently view your total balance here.")
    cy.findByRole('button', { name: 'Next' }).click()
    cy.contains("Perform Transfer and Reset balance using your Demo Wallet. You can also view your Demo wallet's transaction history.")
    cy.findByRole('button', { name: 'Next' }).click()
    onboardingcfdtrading()
  }
 
describe("WALL-3037 & 3039 - User Onboarding on Desktop for Demo Only Wallet", () => {
  beforeEach(() => {
    cy.c_login("demoonlywallet")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to see the tour for Demo Only Wallets", () => {
    onboardingdemowallet()
  })
})