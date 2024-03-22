class cryptoconfig {
  elements = {
    currencyswitcher: () => cy.findByTestId('dt_currency-switcher__arrow'),
    manageaccount: () =>
      cy.findByRole('button', { name: 'Add or manage account' }),
    closemanageaccount: () => cy.findByTestId('dt_modal_close_icon'),
    cryptoaddaccount: () => cy.findByRole('button', { name: 'Add account' }),
    maybelater: () => cy.findByRole('button', { name: 'Maybe later' }),
  }
}

module.exports = new cryptoconfig()
