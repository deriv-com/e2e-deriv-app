import '@testing-library/cypress/add-commands'

describe('WALL-2817 - Fiat deposit iframe access', () => {
  //Prerequisites: Fiat wallet account in backend prod staging with USD wallet
  beforeEach(() => {
    cy.c_login({ user: 'wallets', backEndProd: true })
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to access doughflow iframe', () => {
    cy.log('Access Fiat Deposit Iframe')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.findByText('Deposit').click()
    cy.get('iframe[class=wallets-deposit-fiat__iframe]').should('be.visible')
    cy.enter('iframe[class=wallets-deposit-fiat__iframe]').then((getBody) => {
      getBody().find('#pmfilter').should('be.visible')
      getBody().find('#depositoptions').should('be.visible')
    })
  })
})

describe('WALL-2817 - Fiat deposit error', () => {
  //Prerequisites: Fiat wallet account in qa box besides qa04 with USD wallet
  beforeEach(() => {
    cy.c_login({ app: 'wallets', user: 'wallets' })
    cy.c_visitResponsive('/wallets', 'large')
  })

  it('should be able to see error message when no access provided', () => {
    cy.log('Error for Fiat Deposit')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.findByText('Deposit').click()
    cy.get('.wallets-action-screen')
      .findByText('Oops, something went wrong!', {
        exact: true,
      })
      .should('be.visible')
  })
})
