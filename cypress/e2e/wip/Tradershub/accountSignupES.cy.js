import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/helper/utility'

Cypress.Commands.add('c_setEndpointES', (signUpMail) => {
  localStorage.setItem('config.server_url', Cypress.env('stdConfigServer'))
  localStorage.setItem('config.app_id', Cypress.env('stdConfigAppId'))
  const mainURL = 'https://staging-app.deriv.com/endpoint?lang=ES'
  cy.c_visitResponsive(mainURL, 'desktop')
  cy.findByRole('button', { name: 'Iniciar sesión' }).should('not.be.disabled')
  cy.c_enterValidEmailES(signUpMail)
})

Cypress.Commands.add('c_enterValidEmailES', (signUpMail) => {
  {
    cy.visit('https://deriv.com/es/', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'config.server_url',
          Cypress.env('configServer')
        )
        win.localStorage.setItem('config.app_id', Cypress.env('configAppId'))
      },
    })
    cy.wait(10000)
    cy.visit('https://deriv.com/es/signup/', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'config.server_url',
          Cypress.env('configServer')
        )
        win.localStorage.setItem('config.app_id', Cypress.env('configAppId'))
        //Wait for the signup page to load completely
        cy.findByRole('button', { name: 'whatsapp icon' }).should(
          'be.visible',
          {
            timeout: 30000,
          }
        )
        cy.findByPlaceholderText('Correo electrónico')
          .as('email')
          .should('be.visible')
        cy.get('@email').type(signUpMail)
        cy.findByRole('checkbox').click()
        cy.get('.error').should('not.exist')
        cy.findByRole('button', { name: 'Crear cuenta demo' }).click()
        cy.findByRole('heading', {
          name: 'Revise su correo electrónico',
        }).should('be.visible')
      },
    })
  }
})

Cypress.Commands.add('c_demoAccountSignupES', (country, accountEmail) => {
  cy.c_emailVerification('account_opening_new.html', accountEmail)
  cy.then(() => {
    cy.c_visitResponsive(Cypress.env('verificationUrl'), 'desktop').then(() => {
      cy.window().then((win) => {
        win.localStorage.setItem(
          'config.server_url',
          Cypress.env('stdConfigServer')
        )
        win.localStorage.setItem('config.app_id', Cypress.env('stdConfigAppId'))
      })
    })
    cy.c_visitResponsive(Cypress.env('verificationUrl'), 'desktop')
    cy.get('h1')
      .contains('Seleccione su país y su ciudadanía:')
      .should('be.visible')
    cy.findByLabelText('País de residencia').should('be.visible')
    cy.findByLabelText('País de residencia').clear().type(country)
    cy.findByText(country).click()
    cy.findByLabelText('Nacionalidad').type(country)
    cy.findByText(country).click()
    cy.findByRole('button', { name: 'Siguiente' }).click()
    cy.findByLabelText('Cree una contraseña').should('be.visible')
    cy.findByLabelText('Cree una contraseña').type(Cypress.env('user_password'))
    cy.wait(10000)
    cy.findByRole('button', { name: 'Comience a operar' }).click()
    cy.wait(10000)
    cy.findByText('Configure su cuenta').should('be.visible')
    cy.findByText('Seleccione su divisa preferida').should('be.visible')
    cy.findByText('US Dollar').should('be.visible')
    cy.findByText('US Dollar').click()
    cy.findByText('Siguiente').click()
  })
})

describe('TRAH-3089: Verify ES Language Sign-up Flow', () => {
  const signUpEmail = `sanity${generateEpoch()}es@deriv.com`
  let country = 'España'
  let nationalIDNum = Cypress.env('nationalIDNum').ES
  let taxIDNum = Cypress.env('taxIDNum').ES
  let currency = Cypress.env('accountCurrency').GBP

  beforeEach(() => {
    cy.c_setEndpointES(signUpEmail)
  })

  it('Verify I can sign-up using ES language', () => {
    cy.c_demoAccountSignupES(country, signUpEmail)
  })
})
