import '@testing-library/cypress/add-commands'

describe('QATEST-707 - Create crypto account', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })

  it('should be able to create crypto account from Traders Hub.', () => {
    cy.c_closeNotificationHeader()
    cy.findByTestId('dt_currency-switcher__arrow').should('be.visible').click()
    cy.findByText('Bitcoin').click()
    cy.wait(10000)
    cy.c_closeNotificationHeader()
    cy.findByRole('button', { name: 'Deposit' }).click()
    cy.xpath('//canvas[contains(@class,"qrcode")]').should('exist') // assert that the QR code element exists
    cy.get('.deposit-crypto-wallet-address__hash-container').should('exist') // Assert that the container exists
    cy.get('.deposit-crypto-wallet-address__action-container').click()
    cy.get('.deposit-crypto-wallet-address__hash-container')
      .invoke('text')
      .then((expectedValue) => {
        cy.get('.deposit-crypto-wallet-address__action-container')
          .click()
          .then(() => {
            // After clicking, retrieve the value from the clipboard
            cy.window().then((win) => {
              cy.wrap(win.navigator.clipboard.readText()).then(
                (copiedValue) => {
                  // Assert that the copied value matches the expected value
                  expect(copiedValue.trim()).to.equal(expectedValue.trim())
                }
              )
            })
          })
      })
    cy.findAllByText('Transaction status').should('be.visible')
    cy.get('.transactions-crypto-transaction-status-side-note').should('exist')
    cy.get('.side-note').should('exist')
  })
})
