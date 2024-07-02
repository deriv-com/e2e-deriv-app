describe('QATEST-169019: Verify user can change currency after duplicate account lock from BO', () => {
  const size = ['small', 'desktop']
  const oldCurrency = Cypress.env('accountCurrency').USD
  const newCurrency = Cypress.env('accountCurrency').EUR

  const setDuplicateAccountStatus = () => {
    cy.c_visitBackOffice()
    cy.findByText('Client Management').click()
    cy.findByPlaceholderText('email@domain.com')
      .should('exist')
      .clear()
      .type(Cypress.env('credentials').test.masterUser.ID)
    cy.findByRole('button', { name: /View \/ Edit/i }).click()
    cy.get('.link').eq(1).should('be.visible').click()
    cy.findAllByText(/CLIENT DETAILS/).should('be.visible')
    cy.findByPlaceholderText('email@domain.com').should(
      'have.value',
      Cypress.env('credentials').test.masterUser.ID
    )
    cy.get(`select[name='untrusted_action_type']`).select('duplicateaccount')
    cy.get(`select[name='untrusted_reason']`).select(
      'Duplicate account - currency change'
    )
    cy.get(`select[name='status_op']`).select('add')
    cy.findAllByRole('button', { name: 'Save' }).first().click({ force: true })
    cy.findByText(/Duplicate account - currency change/).should('be.visible')
  }

  beforeEach(() => {
    cy.c_createRealAccount().then(() => {
      setDuplicateAccountStatus()
    })
    cy.c_login()
  })

  size.forEach((size) => {
    it(`Should be able to successfully change currency on ${size == 'small' ? 'mobile' : 'desktop'}`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_visitResponsive('/', size)
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
      cy.c_skipPasskeysV2()
      cy.c_switchToReal()
      cy.findByText('Add a Deriv account').should('be.visible')
      if (isMobile)
        cy.findByText('Step 1: Account currency (1 of 4)').should('be.visible')
      else cy.findByText('Select your preferred currency').should('be.visible')
      cy.findByText(
        'If you want to change your account currency, please contact us via '
      ).should('not.exist')
      cy.findByText(newCurrency).click()
      cy.findByRole('button', { name: 'Next' }).click()
      if (isMobile) {
        cy.get(`select[name='document_type']`).select('I want to do this later')
      } else {
        cy.findByLabelText('Choose the document type').click()
        cy.findByText('I want to do this later').click()
      }
      cy.get(`input[name='crs_confirmation']`)
        .scrollIntoView()
        .check({ force: true })
      cy.findByRole('button', { name: 'Next' }).click()
      cy.findByRole('button', { name: 'Next' }).click()
      cy.c_completeFatcaDeclarationAgreement()
      cy.get('#agreed_tos').check({ force: true })
      cy.get('#agreed_tnc').check({ force: true })
      cy.findByRole('button', { name: 'Add account' }).click()
      cy.findByRole('heading', { name: 'Your account is ready' }).should(
        'be.visible'
      )
      cy.findByRole('button', { name: 'Deposit' }).should('be.visible')
      cy.findByRole('button', { name: 'Maybe later' })
        .should('be.visible')
        .click()
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
      cy.findByTestId('dt_currency-switcher__arrow').click()
      cy.findByText('Select account').should('be.visible')
      cy.get('.currency-selection-modal__body').should(
        'not.include.text',
        oldCurrency
      )
      cy.get('.currency-selection-modal__body').should(
        'include.text',
        newCurrency
      )
    })
  })
})
