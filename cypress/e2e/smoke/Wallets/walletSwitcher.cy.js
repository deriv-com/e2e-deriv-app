function clickEachItemSequentially() {
  // Click the dropdown to reveal the list
  cy.get('[data-testid="dt_wallets_textfield_icon_right"]').click()
  return cy.get('[role=listbox]').find('[role=option]').its('length')
  }

  // function clickEachWalletSequentially() {
  //   cy.get('[data-testid="dt_wallets_textfield_icon_right"]').click()
  //   cy.get('[role=listbox]').within(() => {
  //       cy.get('[role=option]').then($list => {
  //         const listItems = $list.length 
  //         cy.log('Total list items:', listItems)
  //         for (let i = 1; i < listItems; i++) {
  //           cy.log('the index value is' + i)
  //           cy.get('.wallets-list-card-dropdown__item-content',{ timeout: 10000 }).should('be.visible').eq(i).click({ force: true }).debug().then(() => {
  //             cy.wait(1000)
  //             cy.get('[data-testid="dt_desktop_accounts_list"]').within(() => {
  //               cy.get('button').contains('Transfer').should('be.visible')})
  //           cy.get('.wallets-dropdown').click({ force: true })})
  //         }
  //     })})
 // }
  
describe('QATEST-157196 Demo and Real Wallet Switcher',() =>{
    beforeEach(() => {
        cy.c_login({ user: 'walletloginEmail' })
        cy.wait(10000)
      })
it.only('Check demo and Real wallet swticher' ,() =>{
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
          ///test
          //clickEachWalletSequentially()
            clickEachItemSequentially().then(listItems => {
            cy.log('Total list items:', listItems)
            for (let i = 1; i < listItems; i++) {
              cy.log('the index value is' + i)
              cy.get('.wallets-list-card-dropdown__item-content',{ timeout: 10000 }).should('be.visible').eq(i).click({ force: true }).debug().then(() => {
                cy.get('[data-testid="dt_desktop_accounts_list"]').within(() => {
                  cy.get('button').contains('Transfer').should('be.visible')})
              cy.get('.wallets-dropdown').click({ force: true })})
            }
            })
         
})
it('Responsive - Check demo and Real wallet switcher' ,() =>{
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
      .should('be.visible')
      })
    })

})

})
