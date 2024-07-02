import { derivApp } from '../../../support/locators'

const size = ['small', 'desktop']

describe('QATEST-155356 - Verify user should able to see Passkey (UI) option under Account settings and QATEST-155377 - Verify user should not able to see Passkey option under Account settings for Desktop ', () => {
  const size = ['small', 'desktop']
  size.forEach((size) => {
    it('Verify the Passkeys UI under account settings in Mobile Responsive and should not contain for Desktop', () => {
      cy.log('Creating a New Account')
      cy.c_createDemoAccount()
      cy.c_login()
      //  cy.findByRole('link', { name: '/account/personal-details' }).click()
      cy.get('a[href="/account/personal-details"]').click()
      cy.c_logout()
      cy.c_createApplicationId()
      cy.c_setEndpointUat()
      cy.c_login({ passkeys: true })

      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('/', size)
      if (isMobile) {
        cy.c_waitUntilElementIsFound({
          cyLocator: () => cy.findByText('Maybe later').click(),
          timeout: 3000,
          maxRetries: 5,
        })
        cy.c_waitUntilElementIsFound({
          cyLocator: () =>
            cy.get('.dc-text.main-title-bar__text').should('be.visible'),
          timeout: 3000,
          maxRetries: 3,
        })
        derivApp.commonPage.mobileLocators.header.hamburgerMenuButton().click()
        derivApp.commonPage.mobileLocators.sideMenu
          .sidePanel()
          .findByText('Account Settings')
          .click()
          .wait(1000)
        derivApp.commonPage.mobileLocators.sideMenu
          .sidePanel()
          .findByText('Passkeys')
          .click()

        //Verify the 'Experience safer logins' screen
        cy.c_experienceSafeLogin()
        //cy.findByRole('button', { name: 'learn more' }).should('be.visible').click() // not working
        cy.get('.dc-btn--secondary').should('be.visible').click()
        //Verify the 'Learn More' screen
        cy.c_passkeysLearnMore()
        // verify the 'Just a reminder' Pop-up
        cy.c_justAReminderPopUp()
        // cy.findByTestId('dt_initial_loader') // not working
        cy.get('.passkeys-status__description-back-button').click() // <- back icon
        cy.findByTestId('dt_div_100_vh')
          .should('contain.text', 'Experience safer logins')
          .should('be.visible')
        // verify the 'Just a reminder' Pop-up
        cy.c_justAReminderPopUp()
        cy.get('.dc-page-overlay__header-close').click() // 'X' icon
      } else {
        // Verify 'Passkey (New)' option should not available under Security and safety menu for desktop
        cy.get('a[href="/account/personal-details"]').click()
        cy.get('a#btnPasskeys.button.passkey-btn').should('not.exist')
      }
    })
  })
})
