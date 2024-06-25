
describe('verify the transactional email content', () => {
    
    beforeEach(() => {
      cy.c_createRealAccount()
      cy.c_login()
    })
      it(`Verify the account_closure transactional email content`, () => {
        cy.c_visitResponsive('/', 'desktop')

        cy.get('.traders-hub-header__setting').click()
        cy.findByRole('link', { name: 'Close your account' }).click()
        cy.findByRole('button', { name: 'Close my account' }).click()
        cy.findByText('I’m closing my account for other reasons.').click()
        cy.findByRole('button', { name: 'Continue' }).click()
        cy.findByRole('button', { name: 'Close account' }).click()
        cy.c_emailContentVerification('CustomerIO_account_closure.html', Cypress.env('credentials').test.masterUser.ID)
        })

    })
        