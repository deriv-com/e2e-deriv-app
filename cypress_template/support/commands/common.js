import './appModule1'
import { getOAuthUrl } from '../helper/utility'
import { derivApp } from '../locators/index'

Cypress.Commands.add('c_setServerUrlAndAppId', (serverUrl, appId) => {
  localStorage.setItem('config.server_url', serverUrl)
  localStorage.setItem('config.app_id', appId)
})

Cypress.Commands.add(
  'c_clickToOpenInSamePage',
  { prevSubject: true },
  (locator) => {
    cy.wrap(locator).invoke('attr', 'target', '_self').click()
  }
)

Cypress.Commands.add('c_login', (app) => {
  cy.c_visitResponsive('/endpoint', 'large')

  if (app == 'doughflow') {
    Cypress.env('configServer', Cypress.env('doughflowConfigServer'))
    Cypress.env('configAppId', Cypress.env('doughflowConfigAppId'))
  } //Use production server and app id for production base url
  else if (Cypress.config().baseUrl == Cypress.env('prodURL')) {
    Cypress.env('configServer', Cypress.env('prodServer'))
    Cypress.env('configAppId', Cypress.env('prodAppId'))
  } else {
    Cypress.env('configServer', Cypress.env('stdConfigServer'))
    Cypress.env('configAppId', Cypress.env('stdConfigAppId'))
  }

  //If we're switching between apps, we'll need to re-authenticate
  if (Cypress.prevAppId != Cypress.env('configAppId')) {
    cy.log('prevAppId: ' + Cypress.prevAppId)
    Cypress.prevAppId = Cypress.env('configAppId')
    Cypress.env('oAuthUrl', '<empty>')
  }

  cy.log('server: ' + Cypress.env('configServer'))
  cy.log('appId: ' + Cypress.env('configAppId'))

  //Do not set the server for production as it uses two servers: green & blue
  if (Cypress.config().baseUrl != Cypress.env('prodURL')) {
    localStorage.setItem('config.server_url', Cypress.env('configServer'))
    localStorage.setItem('config.app_id', Cypress.env('configAppId'))
  }
  if (app == 'wallets' || app == 'doughflow' || app == 'demoonlywallet') {
    cy.contains('next_wallet').then(($element) => {
      //Check if the element exists
      if ($element.length) {
        // If the element exists, click on it
        cy.wrap($element).click()
      }
    })
  }

  cy.log('getOAuthUrl - value before: ' + Cypress.env('oAuthUrl'))
  if (Cypress.env('oAuthUrl') == '<empty>') {
    getOAuthUrl((oAuthUrl) => {
      Cypress.env('oAuthUrl', oAuthUrl)
      cy.log('getOAuthUrl - value after: ' + Cypress.env('oAuthUrl'))
      cy.c_doOAuthLogin(app)
    })
  } else {
    cy.c_doOAuthLogin(app)
  }
})

Cypress.Commands.add('c_doOAuthLogin', (app) => {
  cy.c_visitResponsive(Cypress.env('oAuthUrl'), 'large')
  //To let the dtrader page load completely
  cy.get('.cq-symbol-select-btn', { timeout: 10000 }).should('exist')
  // cy.findByTestId('launch-modal').then(($element) =>{
  //   if($element){
  //     cy.findByRole('button', { name: 'Ok' }).click();
  //   }
  // })
  cy.get('#modal_root, .modal-root', { timeout: 10000 }).then(($element) => {
    if ($element.children().length > 0) {
      cy.contains('Continue').then(($element) => {
        if ($element.length) {
          cy.wrap($element).click()
        }
        //To redirect to wallet page
        if (
          app == 'wallets' ||
          app == 'doughflow' ||
          app == 'demoonlywallet' ||
          app == 'onramp'
        ) {
          cy.findByRole('banner').should('be.visible')
        } else {
          //To redirect to trader's hub page
          cy.findByText("Trader's Hub").should('be.visible')
        }
      })
    } else {
      //when deriv charts popup is not available and if we need to redirect to wallet page
      if (
        app == 'wallets' ||
        app == 'doughflow' ||
        app == 'demoonlywallet' ||
        app == 'onramp'
      ) {
        cy.findByRole('banner').should('be.visible')
      } else {
        //when deriv charts popup is not available and if we need to redirect to trader's hub page
        cy.findByText("Trader's Hub").should('be.visible')
      }
    }
  })
})

Cypress.Commands.add('c_visitResponsive', (path, size) => {
  //Custom command that allows us to use baseUrl + path and detect with this is a responsive run or not.
  cy.log(path)
  if (size === undefined) size = Cypress.env('viewPortSize')

  if (size == 'small') cy.viewport('iphone-xr')
  else if (size == 'medium') cy.viewport('ipad-2')
  else cy.viewport('macbook-16')

  cy.visit(path)

  if (path.includes('region')) {
    //Wait for relevent elements to appear (based on page)
    cy.log('Home page Selected')
    cy.findByRole('button', { name: 'whatsapp icon', timeout: 30000 }).should(
      'be.visible'
    ) //For the home page, this seems to be the best indicator that a page has fully loaded. It may change in the future.
  }

  if (path.includes('help-centre')) {
    //Wait for relevent elements to appear (based on page)
    cy.log('Help Centre Selected')
    cy.findByRole('heading', {
      name: 'Didn’t find your answer? We can help.',
      timeout: 30000,
    }).should('be.visible')
  }

  if (path.includes('traders-hub')) {
    //Wait for relevent elements to appear (based on page)
    cy.log('Trader Hub Selected')
  }
})

Cypress.Commands.add('c_waitForLoader', () => {
  derivApp.commonPage.loader().should('not.exist')
})
