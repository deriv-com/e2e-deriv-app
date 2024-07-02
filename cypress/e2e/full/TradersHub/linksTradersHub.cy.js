const size = ['small', 'desktop']

describe("QATEST-5930 - Validate the hyperlinks on Trader's hub", () => {
  beforeEach(() => {
    cy.c_createCRAccount()
    cy.c_login()
  })
  size.forEach((size) => {
    it(`Should navigate to all links in traders hub home page and validate its redirection in ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('/appstore/traders-hub', size)
      //Wait for page to load
      cy.findByTestId('dt_trading-app-card_real_deriv-trader')
        .findByText('Deriv Trader')
        .should('be.visible')
      if (isMobile) cy.c_skipPasskeysV2()
      cy.c_closeNotificationHeader()
      cy.findAllByRole('link', { name: 'Learn more' })
        .first()
        .c_clickToOpenInSamePage()
      cy.findByRole('heading', {
        name: 'Digital options available on Deriv',
      }).should('be.visible')
      cy.url().should(
        'contain',
        '/trade-types/options/digital-options/up-and-down/'
      )
      cy.go('back')
      if (isMobile) {
        cy.findByRole('button', { name: 'CFDs' }).click()
      }
      cy.findAllByRole('link', { name: 'Learn more' })
        .last()
        .c_clickToOpenInSamePage()
      cy.findByRole('heading', { name: 'CFD trading' }).should('be.visible')
      cy.url().should('contain', '/trade-types/cfds/')
      cy.go('back')
      if (isMobile) {
        cy.findByRole('button', { name: 'CFDs' }).click()
      }
      cy.findByText('Compare accounts').click()
      cy.findByText('Compare CFDs accounts').should('be.visible')
      cy.url().should('contain', '/cfd-compare-acccounts')
    })
  })
})
