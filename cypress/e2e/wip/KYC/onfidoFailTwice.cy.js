import '@testing-library/cypress/add-commands'

describe('QATEST-22853 Onfido (2 attempts) failed clients are redirected to manual upload', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_navigateToPoiResponsive('Colombia')
  })

  it('Onfido should fail twice and then manual upload screen should be displayed', () => {
    cy.get('.dc-checkbox__box').click()
    cy.findByText('Choose document').should('be.visible')
    cy.findByText('Passport').click()
    cy.findByText('Submit passport photo pages').should('be.visible')
    cy.findByText('or upload photo – no scans or photocopies').click()
    cy.findByText('Upload passport photo page').should('be.visible')
    cy.findByText('Upload photo').click()
    cy.findByRole('button', { name: 'Save and submit' }).should('be.disabled')
    cy.fixture('kyc/testDriversLicense.jpeg').then((fileContent) => {
      cy.findByTestId('dt_file_upload_input').selectFile({
        contents: fileContent,
        fileName: 'testDriversLicense.jpeg',
      })
    })
    /**cy.findByRole('button', { name: 'or upload photo – no scans or' }).click()
    cy.findByRole('button', { name: 'Continue' }).click()
    cy.findByRole('button', { name: 'Continue' }).setInputFiles('uk-driving-licence.jpeg')
    cy.findByRole('button', { name: 'Upload' }).click()
    cy.findByRole('button', { name: 'Continue' }).click()
    cy.findByRole('heading', { name: 'Allow camera access' }).click()
    cy.findByRole('button', { name: 'Enable camera' }).click()
    cy.findByLabel('Take a photo').click()
    cy.findByRole('button', { name: 'Upload' }).click()

    // try again button
    //cy.findByRole('button', { name: 'Verify again' }).click()
    **/
  })
})
