describe('QATEST-98805 - Fiat deposit iframe access', () => {
  //Prerequisites: Fiat wallet account in backend prod staging with USD wallet
  beforeEach(() => {
    cy.c_login({ user: 'wallets', backEndProd: true })
  })

  it('should be able to access doughflow iframe', () => {
    cy.log('Access Fiat Deposit Iframe')
    cy.c_visitResponsive('/', 'large')
    cy.findByText(/Wallet/, { timeout: 10000 }).should('exist')
    cy.findByText('Deposit').click()
    cy.get('iframe[class=wallets-deposit-fiat__iframe]').should('be.visible')
    cy.enter('iframe[class=wallets-deposit-fiat__iframe]').then((getBody) => {
      getBody().find('#pmfilter').should('be.visible')
      getBody().find('#depositoptions').should('be.visible')
    })
  })
  it('should be able to access doughflow iframe in responsive', () => {
    cy.log('Access Fiat Deposit Iframe')
    cy.c_visitResponsive('/', 'small')
    cy.findByText(/Wallet/, { timeout: 10000 }).should('exist')
    cy.findAllByText('Financial', { timeout: 10000 }).should('exist')
    cy.findByText('Deposit')
      .prev('button')
      .scrollIntoView()
      .click({ force: true })
    cy.get('iframe[class=wallets-deposit-fiat__iframe]').should('be.visible')
    cy.enter('iframe[class=wallets-deposit-fiat__iframe]').then((getBody) => {
      getBody().find('#pmfilter').should('be.visible')
      getBody().find('#depositoptions').should('be.visible')
    })
  })
})
