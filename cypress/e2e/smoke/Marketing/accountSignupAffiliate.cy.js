import { generateEpoch } from '../../../support/helper/utility'

describe('QATEST-122929 - Creating account with affiliate token', () => {
  const size = ['desktop', 'small']
  let countryIDV = Cypress.env('countries').ID
  const tracking_Link_URL = `https://${Cypress.env('trackingLink')}${Cypress.env('trackingLinkToken')}`

  size.forEach((size) => {
    it(`affliate token should be attached to the account created (check in BO affiliate token) ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive(tracking_Link_URL, size)
      cy.url().then((url) => {
        cy.log('The current URL is:', url)
        var longURL = new URL(url)
        var affiliate_token = longURL.searchParams.get('t')
        cy.wrap(affiliate_token).as('token')
      })

      const signUpEmail = `sanity${generateEpoch()}affiliate@deriv.com`
      cy.c_setEndpoint(signUpEmail, size)
      cy.c_demoAccountSignup(countryIDV, signUpEmail, size)

      /* Visit BO */
      cy.c_visitResponsive('/', 'large')
      cy.c_visitBackOffice()
      cy.findByText('Client Management').click()
      cy.findByPlaceholderText('email@domain.com')
        .should('exist')
        .clear()
        .type(signUpEmail)
      cy.findByRole('button', { name: /View \/ Edit/i }).click()
      cy.get('.link').eq(1).should('be.visible').click()

      /*  Verify that the account has affiliate token attached to it */
      cy.window().scrollTo('center', {
        ensureScrollable: false,
      })

      cy.contains(
        'This is the token currently registered with MyAffiliates.'
      ).should('be.visible')
      cy.get('@token').then((token) => {
        cy.contains(token).should('be.visible')
      })
    })
  })
})
