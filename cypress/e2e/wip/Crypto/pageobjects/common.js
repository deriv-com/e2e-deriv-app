class cryptoconfig {
    elements = {
        currencyswitcher: () => cy.findByTestId('dt_currency-switcher__arrow'),
        manageaccount: () => cy.get('[class*="dc-btn dc-btn--secondary dc-btn__large block-button"]'),
        closemanageaccount: () => cy.get('[class*="dc-modal-header__close"]'),
        cryptoaddaccount: () => cy.get('[class*="dc-btn dc-btn__effect dc-btn--primary dc-btn__large"]'),
        maybelater: () => cy.findByRole('button', { name: 'Maybe later' }),
        closenotification: () => cy.get('.notification__close-button')
    }
 }
 
 
 module.exports = new cryptoconfig()