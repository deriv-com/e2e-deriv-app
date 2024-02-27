import "@testing-library/cypress/add-commands"

function changeMT5Password(){
  cy.getByRole('button', { name: 'Open' }).eq(0).click()
  cy.findByText('DerivSVG-Server').should("be.visible")

}
describe("WALL-3255 - Reset MT5 password", () => {
  
  beforeEach(() => {
    cy.c_login("wallets")
    cy.c_visitResponsive("/wallets", "large")
  })

  it("should be able to change mt5 password", () => {
    cy.log("change mt5 password")
    cy.findByText("CFDs", { exact: true }).should("be.visible")

    clickAddMt5Button()
    verifyJurisdictionSelection('Derived')
    verifyDerivMT5Creation('Derived')
    verifyTransferFundsMessage('Derived')
    closeModal()
    clickAddMt5Button()
    verifyJurisdictionSelection('Financial')
    verifyDerivMT5Creation('Financial')
    verifyTransferFundsMessage('Financial')
    closeModal()

    // this part is commented due to this bug [https://app.clickup.com/t/20696747/WALL-3302]
    // clickAddMt5Button()
    // verifyJurisdictionSelection('Swap-Free')
    // verifyDerivMT5Creation('Swap-Free')
    // verifyTransferFundsMessage('Swap-Free')
    //closeModal()
    // create SVG Financial account

    cy.findByText('Get more', { exact: true }).click()
    cy.findByText("Select Deriv MT5’s account type").should("be.visible")
    cy.get('.wallets-mt5-account-type-card-list-content').first().click()
    cy.findByRole('button', { name: 'Next' }).click()
    selectBVIJurisdiction('Derived')
    cy.findByRole('heading', { name: 'Complete your personal details' }).should('exist')
    cy.findByPlaceholderText('Tax residence*').click()
    cy.findByPlaceholderText('Tax residence*').type('Indonesi')
    cy.findByRole('option', { name: 'Indonesia' }).click()
    cy.findByLabelText('Tax identification number*').click()
    cy.findByLabelText('Tax identification number*').type('001234212343232')
    cy.findByRole('button', { name: 'Next' }).click()
    verifyDerivMT5Creation('BVI')
    closeModal()
    
    // Create Demo MT5 accounts
    cy.log("create demo mt5 svg account")
    expandDemoWallet()
    cy.findByText("CFDs", { exact: true }).should("be.visible")
    clickAddMt5Button()
    verifyDerivMT5Creation('Demo')
    verifyDemoCreationsMessage('Derived')

    cy.log("create demo mt5 svg financial account")
    cy.findByText("CFDs", { exact: true }).should("be.visible")
    clickAddMt5Button()
    verifyDerivMT5Creation('Demo')
    verifyDemoCreationsMessage('Financial')

      // this part is commented due to this bug [https://app.clickup.com/t/20696747/WALL-3302]
    // cy.log("create demo mt5 svg swap free account")
    // cy.findByText("CFDs", { exact: true }).should("be.visible")
    // clickAddMt5Button()
    // verifyDerivMT5Creation('Demo')
    // verifyDemoCreationsMessage('Swap-Free')
  })
  })
