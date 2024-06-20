import { derivApp } from '../../../support/locators'
import { getCurrentDate } from '../../../support/helper/utility'

const size = ['small', 'desktop']
const currentDate = getCurrentDate()
let countryCode = 'id'

/* Function to check if a string is in 'YYYY-mm-dd' format */
function isValidDateFormat(dateString) {
  // YYYY-mm-dd format regex pattern
  const dateFormatRegex = /^(\d{4}-\d{2}-\d{2})/
  const match = dateString.match(dateFormatRegex)
  if (match) {
    const dateOnly = match[1]
    return dateOnly
  }
}

describe('UPM-1183 - Verify Login history page on desktop', () => {
  before(() => {
    cy.c_createDemoAccount(countryCode)
  })

  beforeEach(() => {
    cy.c_login()
  })

  size.forEach((size) => {
    it('Should validate Login history page is showing proper date info', () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('appstore/traders-hub', size)
      cy.get('.traders-hub-header__setting').click()
      if (isMobile) {
        derivApp.commonPage.mobileLocators.header.hamburgerMenuButton().click()
        derivApp.commonPage.mobileLocators.sideMenu
          .sidePanel()
          .findByText('Account Settings')
          .click()
        derivApp.commonPage.mobileLocators.sideMenu
          .sidePanel()
          .findByRole('link', { name: 'Login history' })
          .click()
      } else {
        cy.get('#dc_login-history_link').click()
      }

      /* Validate the format of the date displayed on the page */
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
      /* Ensure 'Invalid date' is not displayed like in UPM-1162 */
      cy.findByText('Invalid date').should('not.exist')
    })
  })
})
