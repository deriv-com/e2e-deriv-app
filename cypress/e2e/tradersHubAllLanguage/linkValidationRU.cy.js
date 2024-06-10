import '@testing-library/cypress/add-commands'

describe('QATEST-125246 Verify the hyperlinks on Traders Hub', () => {
  const size = ['small', 'desktop']
  let countryCode = 'co'

  beforeEach(() => {
    cy.c_createRealAccount(countryCode)
    cy.c_login()
  })
  size.forEach((size) => {
    it(`Should validate the hyperlinks in tradershub for RU ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('/', size)
      if (isMobile) {
        cy.wait(2000)
        cy.c_skipPasskeysV2()
        cy.c_checkTradersHubHomePage(isMobile)
        cy.c_changeLanguageMobile('RU')
      } else {
        cy.c_changeLanguageDesktop('RU')
      }
      cy.checkHyperLinks('RU', isMobile)
    })
  })
})
