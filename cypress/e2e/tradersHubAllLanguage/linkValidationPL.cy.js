describe('QATEST-125246 Verify the hyperlinks on Traders Hub', () => {
  const size = ['small', 'desktop']
  let countryCode = 'co'

  beforeEach(() => {
    cy.c_createCRAccount(countryCode)
    cy.c_login()
  })
  size.forEach((size) => {
    it(`Should validate the hyperlinks in tradershub for PL ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('/', size)
      if (isMobile) {
        cy.findAllByTestId('dt_balance_text_container').should(
          'have.length',
          '2'
        )
        cy.c_skipPasskeysV2()
        cy.c_checkTradersHubHomePage(isMobile)
        cy.c_changeLanguageMobile('PL')
      } else {
        cy.c_changeLanguageDesktop('PL')
      }
      cy.c_checkHyperLinks('PL', isMobile)
    })
  })
})
