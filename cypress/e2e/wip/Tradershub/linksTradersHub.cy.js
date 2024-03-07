import "@testing-library/cypress/add-commands"

const linkValidations = [
    { linkName: 'options', expectedUrl: '/trade-types/options/digital-options/up-and-down/', contentCheck: 'Digital options available on Deriv' },
    { linkName: 'multipliers', expectedUrl: '/trade-types/multiplier/', contentCheck: 'Multipliers' },
    { linkName: 'Learn more', expectedUrl: '/trade-types/cfds/', contentCheck: 'CFD trading' },
  ]

const validateLink = (linkName, expectedUrl, contentCheck) => {
    cy.findByRole('link', { name: linkName }).then($link => {
      const url = $link.prop('href');
      cy.visit(url, { onBeforeLoad: (win) => {
        cy.stub(win, 'open').as('windowOpen')
      }})
      cy.url().should('contain', expectedUrl)
      cy.findByRole('heading', { name: `${contentCheck}` })
    })
    cy.go('back')
  }

describe("QATEST 5930 - Validate the hyperlinks on Trader's hub", () => {
  
it("Should navigate to all links in traders hub home page and validate its redirection", () => {
    cy.c_login()
    cy.c_visitResponsive("/appstore/traders-hub", "large")
    linkValidations.forEach(({ linkName, expectedUrl, contentCheck }) => {
        validateLink(linkName, expectedUrl, contentCheck);
      })
    cy.findByText('Compare accounts').click()
    cy.url().should('contain', 'appstore/cfd-compare-acccounts')
    cy.findByText('Compare CFDs accounts').should('be.visible')
  })
 
})