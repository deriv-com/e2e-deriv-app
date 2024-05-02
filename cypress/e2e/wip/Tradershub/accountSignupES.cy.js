import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/helper/utility'

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
    // wait for the signup page to load completely
    cy.findByRole(
      'button',
      { name: 'whatsapp icon' },
      { timeout: 30000 }
    ).should('be.visible')
    cy.visit('https://deriv.com/es/signup/', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'config.server_url',
          Cypress.env('configServer')
        )
        win.localStorage.setItem('config.app_id', Cypress.env('configAppId'))
      },
    })
    // wait for the signup page to load completely
    cy.findByRole(
      'button',
      { name: 'whatsapp icon' },
      { timeout: 30000 }
    ).should('be.visible')
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
    cy.c_visitResponsive('https://deriv.com/es/', 'small')
  }
})

Cypress.Commands.add('c_currencyES', (currency) => {
  cy.findByRole('button', { name: 'Comience a operar' }).click()
  cy.findByText('Configure su cuenta').should('be.visible')
  cy.findByText(currency).should('be.visible').click()
  cy.findByRole('button', { name: 'Siguiente' }).click()
})

Cypress.Commands.add('c_personalDetailsES', (country, taxIDNum) => {
  cy.get('[type="radio"]').first().click({ force: true })
  cy.c_generateRandomName().then((firstName) => {
    cy.findByTestId('first_name').type(firstName)
  })
  cy.findByTestId('last_name').type('automation acc')
  // interacting with date picker in desktop mode
  cy.viewport('macbook-16')
  cy.findByTestId('date_of_birth').click()
  cy.findByText('2006').click()
  cy.findByText('feb.').click()
  cy.findByText('9', { exact: true }).click()
  cy.viewport('iphone-xr')
  cy.get('select[data-testid="place_of_birth_mobile"]').select(country)
  cy.findByTestId('phone').type('12345678')
  cy.get('select[data-testid="citizenship_mobile"]').select(country)
  cy.get('select[data-testid="tax_residence_mobile"]').select(country)
  cy.findByTestId('tax_identification_number').type(taxIDNum)
  cy.get('select[data-testid="account_opening_reason_mobile"]').select(1)
  cy.get('select[name="employment_status"]').select(1)
  cy.findByText(
    'Por la presente declaro que la información tributaria que he proporcionado es verdadera y completa. También informaré Deriv Investments (Europe) Limited acerca de cualquier cambio de esta información.'
  ).should('be.visible')
  cy.get('.dc-checkbox__box').click()
  // below check is to make sure previous button is working
  cy.findByRole('button', { name: 'Anterior' }).click()
  cy.findByRole('button', { name: 'Siguiente' }).click()
  cy.findByRole('button', { name: 'Siguiente' }).click()
})

Cypress.Commands.add('c_addressDetailsES', () => {
  cy.findByLabelText('Primera línea de dirección*').type('myaddress 1')
  cy.findByLabelText('Segunda línea de dirección').type('myaddress 2')
  cy.findByLabelText('Pueblo/Ciudad*').type('mycity')
  cy.findByLabelText('Código postal').type('1234')
  cy.findByRole('button', { name: 'Siguiente' }).click()
})

Cypress.Commands.add('c_completeTradingAssessmentES', () => {
  let countTA = 0
  cy.get('[type="radio"]').first().click({ force: true })
  cy.findByRole('button', { name: 'Siguiente' }).click()
  cy.get('[type="radio"]').eq(1).click({ force: true })
  cy.findByRole('button', { name: 'Siguiente' }).click()
  while (countTA < 4) {
    cy.get('select[id="dt_components_select-native_select-tag"]')
      .eq(countTA)
      .select(3)
    countTA++
  }
  cy.findByRole('button', { name: 'Siguiente' }).click()
  cy.get('[type="radio"]').eq(2).click({ force: true })
  cy.findByRole('button', { name: 'Siguiente' }).click()
  cy.get('[type="radio"]').eq(3).click({ force: true })
  cy.findByRole('button', { name: 'Siguiente' }).click()
  cy.get('[type="radio"]').eq(1).click({ force: true })
  cy.findByRole('button', { name: 'Siguiente' }).click()
  cy.get('[type="radio"]').eq(3).click({ force: true })
  cy.findByRole('button', { name: 'Siguiente' }).click()
})

Cypress.Commands.add('c_completeFinancialAssessmentES', () => {
  let countFA = 0
  while (countFA < 8) {
    cy.get('select[id="dt_components_select-native_select-tag"]')
      .eq(countFA)
      .select(3)
    countFA++
  }
  cy.findByRole('button', { name: 'Siguiente' }).click()
})

Cypress.Commands.add('c_completeFatcaDeclarationAgreementES', () => {
  cy.get('.fatca-declaration__agreement').click()
  cy.findAllByTestId('dti_list_item').eq(0).click()
  cy.findByText(
    'No soy una PEP, y no he sido una PEP en los últimos 12 meses.'
  ).should('be.visible')
  cy.contains('Acepto los términos y condiciones').should('be.visible')
  cy.findByText(
    'Por la presente confirmo que mi solicitud de apertura de una cuenta en Deriv Investments (Europe) Ltd se realiza por iniciativa propia.'
  ).should('be.visible')
  cy.findByRole('button', { name: 'Añadir cuenta' }).should('be.disabled')
  cy.get('.dc-checkbox__box').eq(0).click()
  cy.findByRole('button', { name: 'Añadir cuenta' }).should('be.disabled')
  cy.get('.dc-checkbox__box').eq(1).click()
  cy.findByRole('button', { name: 'Añadir cuenta' }).should('be.disabled')
  cy.get('.dc-checkbox__box').eq(2).click()
  cy.findByRole('button', { name: 'Añadir cuenta' }).click()
})

Cypress.Commands.add('c_addAccountES', () => {
  cy.findByRole('heading', { name: 'Depositar' }).should('be.visible')
  cy.findByTestId('dt_page_overlay_header_close').click()

  cy.findByRole('heading', { name: 'Cuenta añadida' }).should('be.visible')
  cy.findByRole('button', { name: 'Verifique ahora' }).should('be.visible')
  cy.findByRole('button', { name: 'Quizás más tarde' })
    .should('be.visible')
    .click()

  cy.url().should(
    'be.equal',
    'https://staging-app.deriv.com/appstore/traders-hub?lang=ES'
  )
  cy.findByRole('button', { name: 'Siguiente' }).click()
  cy.findByRole('button', { name: 'OK' }).click()
})

Cypress.Commands.add(
  'c_realAccountSignupES',
  (country, taxIDNum, currency, accountEmail) => {
    cy.c_emailVerification('account_opening_new.html', accountEmail)
    cy.then(() => {
      cy.c_visitResponsive(Cypress.env('verificationUrl'), 'small')
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
      cy.findByLabelText('Cree una contraseña').type(
        Cypress.env('user_password')
      )
      cy.c_currencyES(currency)
      cy.c_personalDetailsES(country, taxIDNum)
      cy.c_addressDetailsES()
      cy.c_completeTradingAssessmentES()
      cy.c_completeFinancialAssessmentES()
      cy.c_completeFatcaDeclarationAgreementES()
      cy.c_addAccountES()
    })
  }
)

describe('TRAH-3089: Verify Sign-up Flow in ES Language', () => {
  const signUpEmail = `sanity${generateEpoch()}es@deriv.com`
  let country = 'España'
  let taxIDNum = Cypress.env('taxIDNum').ES
  let currency = Cypress.env('accountCurrency').USD

  it('Verify I can sign-up using ES language', () => {
    cy.c_setEndpoint(signUpEmail, 'small', 'https://staging-app.deriv.com/', {
      language: 'spanish',
    })
    // cy.c_enterValidEmailES(signUpEmail)
    // cy.c_realAccountSignupES(country, taxIDNum, currency, signUpEmail)
    // cy.get('#traders-hub').scrollIntoView({ position: 'top' })
    // cy.findByText('0.00', { timeout: 40000 }).should('be.visible')
  })
})
