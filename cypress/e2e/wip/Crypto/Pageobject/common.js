class cyrpto {
    elements = {
        currency_switcher: () => cy.findByTestId('dt_currency-switcher__arrow'),
        manage_account: () => cy.get('[class*="dc-btn dc-btn--secondary dc-btn__large block-button"]'),
        crypto_add_account: () => cy.get('[class*="dc-btn dc-btn__effect dc-btn--primary dc-btn__large"]'),
        maybe_later: () => cy.findByRole('button', { name: 'Maybe later' }),
        close_notification: () => cy.get('.notification__close-button')
 }
}

module.exports = new cyrpto();

