import { derivApp } from '../../../support/locators'
import { getCurrentDate } from '../../../support/helper/utility'
import { isValidDateFormat } from '../../../support/helper/utility'

const currentDate = getCurrentDate()
let countryCode = 'id'

Cypress.Commands.add('c_validateDateFormat', () => {
  cy.get('span.dc-text')
    .contains('GMT')
    .invoke('text')
    .then((dateTimeString) => {
      const displayedDate = isValidDateFormat(dateTimeString)
      if (displayedDate != null) {
        expect(displayedDate).to.equal(currentDate)
        cy.log(
          `Displayed date '${displayedDate}' matches current date '${currentDate}'.`
        )
      } else {
        cy.log('Date format does not match expected pattern.')
      }
    })
})

describe('UPM-1183 - Verify Login history page', () => {
  beforeEach(() => {
    cy.c_createRealAccount(countryCode)
    cy.c_login()
  })

  it('Should validate Login history page on desktop is showing proper date info', () => {
    cy.c_visitResponsive('/', 'large')
    cy.get('a[href="/account/personal-details"]').click()
    cy.findByRole('link', { name: 'Login history' }).click()
    cy.c_validateDateFormat()
    /* Ensure 'Invalid date' is not displayed like in UPM-1162 */
    cy.findByText('Invalid date').should('not.exist')
  })
  it('Should validate Login history page on responsive is showing proper date info', () => {
    cy.c_visitResponsive('/', 'small')
    cy.c_skipPasskeysV2()
    cy.get('.traders-hub-header__setting').click()
    derivApp.commonPage.mobileLocators.header.hamburgerMenuButton().click()
    derivApp.commonPage.mobileLocators.sideMenu
      .sidePanel()
      .findByText('Account Settings')
      .click()
    derivApp.commonPage.mobileLocators.sideMenu
      .sidePanel()
      .findByRole('link', { name: 'Login history' })
      .click()
    cy.c_validateDateFormat()
    cy.findByText('Invalid date').should('not.exist')
  })
})
