describe('QATEST-157196 Demo and Real Wallet Switcher',() =>{
    beforeEach(() => {
        cy.c_login({ user: 'walletloginEmail' })
        cy.wait(10000)
      })
it('Check demo and Real wallet swticher' ,() =>{
    cy.c_visitResponsive('/', 'large')
    //Land on Trader's Hub home Demo and Real Switcher should be visible
    cy.findByTestId('dt_themed_scrollbars').findByText('Trader\'s Hub').should('be.visible')
    cy.findByTestId('dt_themed_scrollbars').find('label span').should('be.visible')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    //Navigate to demo wallet
    cy.findByTestId('dt_themed_scrollbars').find('label span').should('be.visible').click()
    cy.findByText('USD Demo Wallet').should('be.visible')
    cy.findByLabelText('reset-balance').should('be.visible')
    cy.findAllByText('Options').eq(1).should('be.visible')
  .then(() => cy.findByTestId('dt_desktop_accounts_list').findByText('Demo').should('be.visible'))
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    cy.findByRole('button', { name: /Derived [\d.,]+ USD/ }).should(
        'be.visible'
      )
    //Navigate back to real  wallet
    cy.findByTestId('dt_themed_scrollbars').find('label span').should('be.visible').click()
    cy.findByTestId('dt_wallets_textfield_box').should('be.visible')
    cy.findByLabelText('deposit').should('be.visible')
    cy.findByLabelText('withdrawal').should('be.visible')
    cy.findByLabelText('account-transfer').should('be.visible')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    cy.findAllByText('Options').eq(1).should('be.visible')
    .then(() => cy.findByTestId('dt_desktop_accounts_list').findByText('SVG').should('be.visible'))
    cy.findByText('Add more Wallets').scrollIntoView().should('be.visible')
    cy.findByText('USD Wallet').should('be.visible').then(() => {
    cy.get('[class*="wallets-add-more__content"]')
        .contains('USD')
        .parent()
        .parent()
        .find('button', { timeout: 15000 })
        .then((button) => {
          expect(button).to.contain('Added')})})

})
it.only('Responsive - Check demo and Real wallet switcher' ,() =>{
    cy.c_visitResponsive('/', 'small')
    cy.findByText('Trader\'s Hub').should('be.visible')
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    //Navigate to demo wallet
    cy.c_switchWalletsAccountDemo()
    cy.findByLabelText('reset-balance').should('be.visible')
    cy.findByLabelText('account-transfer').should('be.visible')
    cy.findByRole('button', { name: 'Options' }).click().then(() => {
      cy.findByTestId('dt_tab_panels')
      .findAllByText('Options', { exact: true })
      .should('be.visible')
      .then(() => {
        cy.findByText('Demo').should('be.visible')
        cy.contains(/VRTC/)
      .should('be.visible').click()
      })
    })

})

})
