const { getLoginToken } = require('./common');

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

    if (path.includes('traders-hub')) //Wait for relevent elements to appear (based on page)
        {
            cy.log('Trader Hub Selected')
            cy.findByText('CFDs', { exact: true }).should('be.visible', { timeout: 30000 })
            cy.findByText('Options & Multipliers').should('be.visible', { timeout: 30000 })
            cy.findByTestId('dt_div_100_vh').findByText('Trader\'s Hub').should('be.visible', { timeout: 30000 })
            cy.findByText('Total assets').should('be.visible', { timeout: 30000 })
        }

});

Cypress.Commands.add('c_login', () => {

    cy.c_visitResponsive('/', 'large')

    localStorage.setItem('config.server_url', Cypress.env('configServer'))
    localStorage.setItem('config.app_id', Cypress.env('configAppId'))

    if (Cypress.env('E2EToken') == '')
    {
        getLoginToken('mark1@deriv.com', (token) => {
            cy.log('Token received: ' + token);
            Cypress.env('E2EToken', token);
            cy.c_visitResponsive(Cypress.env('oAuthUrl').replace('<token>', token), 'large')
            //cy.findByText('Trader\'s Hub').should('be.visible')
      });
    }

});


Cypress.Commands.add('c_mt5login', () => {

    cy.c_visitResponsive(Cypress.env('mt5BaseUrl') + '/terminal', 'large')

    cy.findByRole('button', { name: 'Accept' }).click()

    cy.findByPlaceholderText('Enter Login').click()
    cy.findByPlaceholderText('Enter Login').type(Cypress.env('mt5Login'))
    cy.findByPlaceholderText('Enter Password').click()
    cy.findByPlaceholderText('Enter Password').type(Cypress.env('mt5Password'))
    cy.findByRole('button', { name: 'Connect to account' }).click()

});

Cypress.on('uncaught:exception', (err, runnable, promise) => {

    console.log(err)
    return false
  })


 




  




  
