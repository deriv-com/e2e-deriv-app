import '@testing-library/cypress/add-commands'
describe('QATEST-98812 - Fiat withdrawal access iframe from email verification link', () => {
  //Prerequisites: Fiat wallet account in backend prod staging with USD wallet
  beforeEach(() => {
    cy.c_login({ user: 'wallets', backEndProd: true })
  })

  it('should be able to access doughflow iframe', () => {
    cy.log('Access Fiat Withdrawal Iframe Through Email Link')
    cy.c_visitResponsive('/wallets', 'large')
    cy.c_skipPasskeysV2()
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_skipPasskeysV2()
    cy.c_rateLimit({ waitTimeAfterError: 15000, maxRetries: 5 })
    performFiatWithdraw()
    cy.c_verifyWalletsWithdrawalScreenContentAfterLink('desktop')
  })
  it('should be able to access doughflow iframe in responsive', () => {
    cy.log('Access Fiat Withdrawal Iframe Through Email Link')
    cy.c_visitResponsive('/wallets', 'small')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_rateLimit({ waitTimeAfterError: 15000, maxRetries: 5 })
    performFiatWithdraw()
    cy.c_verifyWalletsWithdrawalScreenContentAfterLink('mobile')
  })
})
