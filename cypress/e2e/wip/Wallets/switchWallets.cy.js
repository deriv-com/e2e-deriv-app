import '@testing-library/cypress/add-commands'
function switchWallets() {
  cy.get('.wallets-carousel-content')
    .find('.wallets-carousel-content__progress-bar')
    .find('.wallets-progress-bar')
    .find('.wallets-progress-bar-inactive.wallets-progress-bar-transition')
    .each(($element, index, $list) => {
        console.log(`Number of elements found: ${$list.length}`);
        cy.get('.wallets-carousel-content__container')
        .find('[data-testid="dt_wallet_gradient_background"]')
        .find('.wallets-card__carousel-content-details')
        .find('.wallets-card__details-bottom').should('contain', 'Wallet')

        // View deposit, withdraw and transfer.

        const actions = ['deposit', 'withdraw', 'transfer'];
        actions.forEach((action) => {
        cy.get('.wallets-mobile-actions__container')
        .find('.wallets-mobile-actions')
        .find(`button[aria-label="${action}"]`).click()
        .then(() => {
        cy.get('.wallets-cashier-header')
        .find('.wallets-cashier-header__close-icon').click()
        })
        })
      })
    }
       
describe('QATEST-139905 - Mobile wallet card redirection', () => {
  beforeEach(() => {
    cy.c_login({ app: 'wallets' })
  })

  it('should be able to switch and open correct deposit, withdraw and transfer in all the available wallets in Responsive', () => {
    cy.c_visitResponsive('/wallets', 'small')
    switchWallets()
  })
})
