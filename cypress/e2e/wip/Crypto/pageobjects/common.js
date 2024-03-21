class cryptoconfig {
    elements = {
        currencyswitcher: () => cy.findByTestId('dt_currency-switcher__arrow'),
        manageaccount: () => cy.findByRole('button', { name: 'Add or manage account' }),
        //closemanageaccount: () => cy.get('[class*="dc-modal-header__close"]'),
        closemanageaccount: () => cy.findByTestId('dt_modal_close_icon'),
        cryptoaddaccount: () => cy.findByRole('button', { name: 'Add account' }),
        //cryptoaddaccount: () => cy.get('[class*="dc-btn dc-btn__effect dc-btn--primary dc-btn__large"]'),
        maybelater: () => cy.findByRole('button', { name: 'Maybe later' }),
    }
 }
 
 
 module.exports = new cryptoconfig()