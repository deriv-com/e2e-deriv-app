import "@testing-library/cypress/add-commands"

function onboardingcfdtrading(){

  //Wallet Onboarding -  tour around CFD section
  cy.get('.wallets-mt5-list__content').should('exist')
    .then(($mt5list) => {
      const derivedDesc = $mt5list.children().first().text()
      const expectedDesc = 'This account offers CFDs on derived instruments.'
      if (derivedDesc.includes(expectedDesc)) {
        //MT5 Account doesnot exist
        cy.contains('CFDs trading accounts')
        cy.contains('This is your CFDs trading account. Click Get to create the trading account you desire for trading.')
        cy.findByRole('button', { name: 'Next' }).click()
      } else {
       //MT5 Account exist
        cy.contains('CFDs trading accounts')
        cy.contains('This is your CFDs trading account. Click Transfer to move funds between your Wallet and trading account.')
        cy.findByRole('button', { name: 'Next' }).click()
      }
    })
  
  //Wallet Onboarding -  tour around Options and Multiplier section
  cy.get('.wallets-options-and-multipliers-listing__header').should('exist')
    .then(($list) => {
      const derivAppDesc = $list.children().eq(1).text()
      const expderivAppDesc = 'Get a Deriv Apps trading account to trade options and multipliers on these apps.'
      if (derivAppDesc.includes(expderivAppDesc)) {
        //Deriv App Trading Account is not created
        cy.contains('Deriv Apps trading account')
        cy.contains('This is your Deriv Apps trading account. Click Get to create the Deriv Apps trading account for trading.')
        cy.findByRole('button', { name: 'Next' }).click()
        cy.contains('Once you have get a Deriv Apps trading account, choose a Deriv app to trade options or multipliers.')
        cy.findByRole('button', { name: 'Next' }).click()
      } else {
        //Deriv App Trading Account exist
        cy.contains('Deriv Apps trading account')
        cy.contains('This is your Deriv Apps trading account balance. Click Transfer to move funds between your Wallet and Deriv Apps trading account.')
        cy.findByRole('button', { name: 'Next' }).click()
        cy.contains('Choose a Deriv app to trade options or multipliers.')
        cy.findByRole('button', { name: 'Next' }).click()
      }
    })
    // "Add More Wallet section - tour"
    cy.get('.wallets-add-more__carousel').should('exist')
      .then(($list) => {
      const buttontext = $list.children().first().text()
      const expButtontext = 'Added'
      if (buttontext.includes(expButtontext)) {
        cy.log(`No wallets to add`)
      } else {
        cy.log(`Add more wallets`)
        cy.contains('Click Add on each card for more Wallets.')
        cy.findByRole('button', { name: 'Next' }).click()
      }
    })
    cy.contains('Click here to repeat this tour.')
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
      .should('be.visible')
      .end()  
      .get('.wallets-gradient--USD-desktop-card-light')
      .should('be.visible')
    cy.contains("This is your Wallet. These are the functions that you can perform within this Wallet and you can conveniently view your total balance here.")
    cy.findByRole('button', { name: 'Next' }).click()
    cy.contains("Perform deposits, withdrawals, and fund transfers using your Wallet. You can also view your Wallet's transaction history.")
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
      .should('be.visible') 
    cy.contains("This is your Wallet. These are the functions that you can perform within this Wallet and you can conveniently view your total balance here.")
    cy.findByRole('button', { name: 'Next' }).click()
    cy.contains("Perform Transfer and Reset balance using your Demo Wallet. You can also view your Demo wallet's transaction history.")
    cy.findByRole('button', { name: 'Next' }).click()
    onboardingcfdtrading()
  }
 
describe("WALL-3037 & 3039- User Onboarding on Desktop for Fiat Wallets", () => {
  beforeEach(() => {
    cy.c_login("wallets")
    cy.c_visitResponsive("/wallets", "large")
  })

   it("should be able to see the tour for Fiat Wallets", () => {
    onboardingfiatwallet()
   })
})
describe("WALL-3037 & 3039 - User Onboarding on Desktop for Demo Only Wallet", () => {
  beforeEach(() => {
    cy.c_login("demoonlywallet")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to see the tour for Demo Only Wallets", () => {
    onboardingdemowallet()
  })
})