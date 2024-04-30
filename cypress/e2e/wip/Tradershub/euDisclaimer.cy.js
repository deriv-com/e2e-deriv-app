import '@testing-library/cypress/add-commands'
const size = ['small', 'desktop']

describe(`QATEST-42150 Validate the EU statutory disclaimer in footer for EU users on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
  beforeEach(() => {
    cy.c_login({ user: 'eu' })
  })
  size.forEach((size) => {
    it(`Should validate the EU statutory disclaimer in footer for EU users`, () => {
      cy.c_visitResponsive('/appstore/traders-hub', size)
      cy.c_validateEUDisclaimer()
    })
  })
})

describe(`QATEST-37723 Validate the EU statutory disclaimer in footer of EU account for DIEL users ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
  beforeEach(() => {
    cy.c_login({ user: 'diel' })
  })

  size.forEach(() => {
    it('Should validate the EU statutory disclaimer in footer of EU account for DIEL users', () => {
      cy.c_visitResponsive('/appstore/traders-hub', size)
      cy.findByText('EU', { exact: true }).click()
      cy.c_closeNotificationHeader()
      cy.c_validateEUDisclaimer()
    })
  })
})
