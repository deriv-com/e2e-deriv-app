import "@testing-library/cypress/add-commands"

function onboardingcfdtrading(){
    //If USD Wallet doesnot contains CFDs trading account
    cy.contains('CFDs trading accounts')
      .should('exist')
    cy.contains('This is your CFDs trading account. Click Get to create the trading account you desire for trading.')
      .should('exist')
    cy.findByRole('button', { name: 'Next' }).click()

    //USD Wallet not having Deriv Apps Trading Account
    cy.contains('Deriv Apps trading account')
      .should('exist')
    cy.contains('This is your Deriv Apps trading account. Click Get to create the Deriv Apps trading account for trading.')
      .should('exist')
    cy.findByRole('button', { name: 'Next' }).click()
    cy.contains('Once you have get a Deriv Apps trading account, choose a Deriv app to trade options or multipliers.')
      .should('exist')
    cy.findByRole('button', { name: 'Next' }).click()

    // "Add More Wallet section - has wallets to add
    cy.contains('Click Add on each card for more Wallets.')
      .should('exist')
    cy.findByRole('button', { name: 'Next' }).click()
    cy.contains('Click here to repeat this tour.')
      .should('exist')
    cy.findByRole('button', { name: 'Done' }).click()

}

function onboardingfiatwallet() {
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    // Onboarding - Account having Fiat wallets (without CFD and Trading account).
    cy.findByTestId('dt_traders_hub_onboarding_icon').click()
    cy.get('.react-joyride__spotlight').should('exist')
    cy.get('[class*="wallets-accordion wallets-accordion"]').first().should('be.visible')
      .children()
      .eq(1)
      .get('.wallets-accordion__content.wallets-accordion__content--visible') //To verify if the USD wallet content is expanded instead of other wallets.
      .should('exist')
      .should('be.visible')
      .end()  
      .get('.wallets-gradient--USD-desktop-card-light')
      .should('exist')
      cy.contains("This is your Wallet. These are the functions that you can perform within this Wallet and you can conveniently view your total balance here.")
        .should('exist')
    cy.findByRole('button', { name: 'Next' }).click()
    cy.contains("Perform deposits, withdrawals, and fund transfers using your Wallet. You can also view your Wallet's transaction history.")
      .should('exist')
    cy.findByRole('button', { name: 'Next' }).click()
    onboardingcfdtrading()
  }


  function onboardingdemowallet() {
    cy.contains("Wallet", { timeout: 10000 }).should("exist")
    // Onboarding - Account having Demo wallets (without CFD and Trading account).
    cy.findByTestId('dt_traders_hub_onboarding_icon').click()
    cy.get('.react-joyride__spotlight').should('exist')
    cy.get('[class*="wallets-accordion wallets-accordion"]').first().should('be.visible')
      .children()
      .eq(1)
      .should('exist')
      .should('be.visible') 
      cy.contains("This is your Wallet. These are the functions that you can perform within this Wallet and you can conveniently view your total balance here.")
        .should('exist')
    cy.findByRole('button', { name: 'Next' }).click()
    cy.contains("Perform Transfer and Reset balance using your Demo Wallet. You can also view your Demo wallet's transaction history.")
      .should('exist')
    cy.findByRole('button', { name: 'Next' }).click()
    onboardingcfdtrading()
  }

describe("WALL-3037 - User Onboarding on Desktop for Fiat Wallets", () => {
  beforeEach(() => {
    cy.c_login("wallets")
    cy.c_visitResponsive("/wallets", "large")
  })

   it("should be able to see the tour for Fiat Wallets", () => {
    onboardingfiatwallet()
   })
})
describe("WALL-3037 - User Onboarding on Desktop for Demo Only Wallet", () => {
  beforeEach(() => {
    cy.c_login("demoonlywallet")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to see the tour for Demo Only Wallets", () => {
    onboardingdemowallet()
  })
})

