Cypress.Commands.add('c_setMaximumBalanceTo', (value) => {
  cy.get('input[name="max_balance"]').clear().type(value)
  cy.findByRole('button', { name: 'Next' }).click({ force: true })
  cy.findByRole('button', { name: 'Accept' }).click()
})

const screenSizes = ['small', 'desktop']

screenSizes.forEach((screenSize) => {
  describe(`QATEST-157260 - Verify maximum account balance setting for self exclusion: ${screenSize}`, () => {
    beforeEach(() => {
      cy.clearAllCookies()
      cy.clearAllLocalStorage()
      cy.clearAllSessionStorage()
      cy.c_createRealAccount()
      cy.c_login()
      cy.c_visitResponsive('account/self-exclusion', screenSize)
      cy.c_setMaximumBalanceTo(0)
      cy.c_visitResponsive('/', screenSize)
    })

    it('should not be able to deposit funds into account once maximum account balance is reached', () => {
      cy.c_visitResponsive('account/self-exclusion', screenSize)
      cy.c_setMaximumBalanceTo(10)
      cy.c_visitResponsive('cashier/deposit', screenSize)
      cy.get('.cashier-onboarding-icon-marquee__container').first().click()

      cy.then(() => {
        cy.get('iframe[class=deposit-fiat-iframe__iframe]').should('be.visible')
        cy.enter('iframe[class=deposit-fiat-iframe__iframe]').then(
          (getBody) => {
            getBody().findByText('Perfect Money').should('be.visible')
            getBody().findByText('Perfect Money').click()
          }
        )
        cy.wait(5000)
        cy.then(() => {
          cy.enter('iframe[class=deposit-fiat-iframe__iframe]').then(
            (getBody) => {
              getBody().find('[name="chargeamount"]').type(20)
              getBody().findByRole('button', { name: 'Next' }).click()
            }
          )
        })
        cy.wait(5000)
        cy.then(() => {
          cy.enter('iframe[class=deposit-fiat-iframe__iframe]').then(
            (getBody) => {
              getBody()
                .findByRole('button', { name: 'Continue' })
                .should('be.visible')
                .click()
            }
          )
        })
        /*  Need to add final assertion here but currently blocked due to the bug raised https://app.clickup.com/t/20696747/WALL-1372  */
      })
    })
  })
})
