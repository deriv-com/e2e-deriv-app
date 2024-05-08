import '@testing-library/cypress/add-commands'

const linkValidations = [
  {
    linkName: 'options',
    expectedUrl: '/trade-types/options/digital-options/up-and-down/',
    contentCheck: 'Digital options available on Deriv',
  },
  {
    linkName: 'multipliers',
    expectedUrl: '/trade-types/multiplier/',
    contentCheck: 'Multipliers',
  },
  {
    linkName: 'Learn more',
    expectedUrl: '/trade-types/cfds/',
    contentCheck: 'CFD trading',
  },
]

const validateLink = (linkName, expectedUrl, contentCheck) => {
  cy.findByRole('link', { name: linkName }).then(($link) => {
    const url = $link.prop('href')
    cy.visit(url, {
      onBeforeLoad: (win) => {
        cy.stub(win, 'open').as('windowOpen')
      },
    })
    cy.url().should('contain', expectedUrl)
    cy.findByRole('heading', { name: `${contentCheck}` })
  })
  cy.go('back')
}

function checkHyperLinks(deviceType) {
  linkValidations.forEach(({ linkName, expectedUrl, contentCheck }) => {
    if (!(deviceType === 'mobile' && linkName === 'Learn more')) {
      validateLink(linkName, expectedUrl, contentCheck)
    } else {
      cy.findByRole('button', { name: 'CFDs' }).click()
      validateLink(linkName, expectedUrl, contentCheck)
    }
  })

  if (deviceType === 'mobile') {
    cy.findByRole('button', { name: 'CFDs' }).click()
  }

  cy.findByText('Compare accounts').click()
  cy.url().should('contain', 'appstore/cfd-compare-acccounts')
  cy.findByText('Compare CFDs accounts').should('be.visible')
  cy.go('back')
}

describe("QATEST 5930 - Validate the hyperlinks on Trader's hub", () => {
  beforeEach(() => {
    cy.c_createRealAccount()
    cy.c_login()
  })

  it('Should navigate to all links in traders hub home page and validate its redirection in mobile', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
    cy.c_skipPasskeysV2()
    cy.c_closeNotificationHeader()
    checkHyperLinks('mobile')
  })

  it('Should navigate to all links in traders hub home page and validate its redirection in desktop', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    checkHyperLinks('desktop')
  })
})
