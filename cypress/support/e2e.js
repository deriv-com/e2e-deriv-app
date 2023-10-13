Cypress.Commands.add('c_visitResponsive', (path, size) => {
    //Custom command that allows us to use baseUrl + path and detect with this is a responsive run or not.
    cy.log(path)
    if (size === undefined)
        size = Cypress.env("viewPortSize")

    if (size == 'small')
        cy.viewport('iphone-xr')
    else if (size == 'medium')
        cy.viewport('ipad-2')
    else
        cy.viewport('macbook-16')

    cy.visit(path)

    if (path.includes('region')) //Wait for relevent elements to appear (based on page)
        {
            cy.log('Home page Selected')
            cy.findByRole('button', { name: 'whatsapp icon' }).should('be.visible', { timeout: 30000 }) //For the home page, this seems to be the best indicator that a page has fully loaded. It may change in the future.
        }

    if (path.includes('help-centre')) //Wait for relevent elements to appear (based on page)
        {
            cy.log('Help Centre Selected')
            cy.findByRole('heading', { name: "Didn’t find your answer? We can help." }).should('be.visible', { timeout: 30000 })
        }

});

Cypress.Commands.add('c_login', () => {
    cy.findByPlaceholderText('example@email.com').type(Cypress.env('loginEmail'), { log: false })
    cy.findByLabelText('Password').click()
    cy.findByLabelText('Password').type(Cypress.env('loginPassword'), { log: false })
    cy.findByRole('button', { name: 'Log in' }).click()
});

Cypress.on('uncaught:exception', (err, runnable, promise) => {
    // when the exception originated from an unhandled promise
    // rejection, the promise is provided as a third argument
    // you can turn off failing the test in this case
    if (promise) {
      return false
    }
    // we still want to ensure there are no other unexpected
    // errors, so we let them fail the test
  })





  