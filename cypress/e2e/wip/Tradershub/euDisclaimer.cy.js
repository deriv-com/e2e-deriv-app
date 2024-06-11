const size = ['desktop', 'small']

describe('QATEST-42150 Validate the EU statutory disclaimer in footer for EU users', () => {
  beforeEach(() => {
    cy.c_login({ user: 'eu' })
  })
  size.forEach((size) => {
    it(`Should validate the EU statutory disclaimer in footer for EU users on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      cy.c_visitResponsive('/appstore/traders-hub', size)
      cy.c_validateEUDisclaimer()
    })
  })
})

describe('QATEST-37723 Validate the EU statutory disclaimer in footer of EU account for DIEL users', () => {
  beforeEach(() => {
    cy.c_login({ user: 'diel' })
  })

  size.forEach((size) => {
    it(`Should validate the EU statutory disclaimer in footer of EU account for DIEL users on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      cy.c_visitResponsive('/appstore/traders-hub', size)
      cy.findByText('EU', { exact: true }).click({ force: true })
      cy.c_validateEUDisclaimer()
    })
  })
})
