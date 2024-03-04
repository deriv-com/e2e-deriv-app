Cypress.Commands.add('c_loadingCheck', () => {
  cy.findByTestId('dt_initial_loader').should('not.exist')
})

Cypress.Commands.add('navigate_to_poi', (country) => {
  cy.get('a[href="/account/personal-details"]').click()
  cy.findByRole('link', { name: 'Proof of identity' }).click()
  cy.findByLabel('Country').click()
  cy.findByText(country).click()
  cy.contains(country).click()
  cy.contains('button', 'Next').click()
})

Cypress.Commands.add('c_navigateToPOIResponsive', (country) => {
  cy.c_visitResponsive('/account/proof-of-identity', 'small')
  //cy.findByText('Proof of identity').should('exist')
  cy.findByText("Pending action required").should('exist')
  cy.c_closeNotificationHeader()
  cy.get('select[name="country_input"]').select(country)
  cy.findByRole('button', { name: 'Next' }).click()
})

Cypress.Commands.add("c_fillDate", (year, month, day) => {
  cy.get('input[name="date_of_birth"]').click()
  cy.get(`span[data-year="${year}"]`).click()
  cy.get(`span[data-month="${month - 1}"]`).click()
  cy.get(`span[data-date="2000-09-${day}"]`).click()
})



Cypress.Commands.add('c_checkTradersHubhomePage', () => {
  //cy.findByText('Total assets').should('be.visible')
  cy.findByText('Options & Multipliers').should('be.visible')
  cy.findByText('CFDs').should('be.visible')
  cy.findAllByText('Deriv cTrader').eq(0).should('be.visible')
  cy.findByText('Other CFD Platforms').scrollIntoView({ position: 'bottom' })
  cy.get('#traders-hub').scrollIntoView({ position: 'top' })
})

Cypress.Commands.add('c_enterValidEmail', (sign_up_mail) => {
  {
    cy.visit('https://deriv.com/signup/', {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          'config.server_url',
          Cypress.env('configServer')
        )
        win.localStorage.setItem('config.app_id', Cypress.env('configAppId'))
      },
    })
    //Wait for the signup page to load completely
    cy.findByRole('button', { name: 'whatsapp icon' }).should('be.visible', {
      timeout: 30000,
    })
    cy.findByPlaceholderText('Email').as('email').should('be.visible')
    cy.get('@email').type(sign_up_mail)
    cy.findByRole('checkbox').click()
    cy.get('.error').should('not.exist')
    cy.findByRole('button', { name: 'Create demo account' }).click()
    cy.findByRole('heading', { name: 'Check your email' }).should('be.visible')
  }
})

//Below functions are used in sign up forms
Cypress.Commands.add('c_selectCountryOfResidence', (CoR) => {
  cy.findByLabelText('Country of residence').should('be.visible')
  cy.findByLabelText('Country of residence').clear().type(CoR)
  cy.findByText(CoR).click()
})

Cypress.Commands.add('c_selectCitizenship', (Citizenship) => {
  cy.findByLabelText('Citizenship').type(Citizenship)
  cy.findByText(Citizenship).click()
  cy.findByRole('button', { name: 'Next' }).click()
})

Cypress.Commands.add('c_enterPassword', () => {
  cy.findByLabelText('Create a password').should('be.visible')
  cy.findByLabelText('Create a password').type(Cypress.env('user_password'), {
    log: false,
  })
  cy.findByRole('button', { name: 'Start trading' }).click()
})

Cypress.Commands.add('c_completeOnboarding', () => {
  for (let next_button_count = 0; next_button_count < 5; next_button_count++) {
    cy.contains('button', 'Next').should('be.visible')
    cy.contains('button', 'Next').click()
  }
  cy.contains('Start trading').should('be.visible')
  cy.contains('button', 'Start trading').click()
  cy.contains('Switch accounts').should('be.visible')
  cy.contains('button', 'Next').click()
  if (Cypress.env('diel_country_list').includes(Cypress.env('citizenship'))) {
    cy.contains('Choice of regulation').should('be.visible')
    cy.contains('button', 'Next').click()
  }
  cy.contains("Trader's Hub tour").should('be.visible')
  cy.contains('button', 'OK').click()
})

Cypress.Commands.add('c_generateRandomName', () => {
  const characters = 'abcdefghijklmnopqrstuvwxyz'
  let randomText = ''
  for (let i = 0; i < 8; i++) {
    randomText += characters.charAt(
      Math.floor(Math.random() * characters.length)
    )
  }
  return 'cypress ' + randomText
})

Cypress.Commands.add(
  'c_personalDetails',
  (
    firstName,
    identity,
    taxResi,
    nationalIDNum,
    taxIDNum,
    currency = Cypress.env('accountCurrency').USD
  ) => {
    cy.findByText(currency).click()
    cy.findByRole('button', { name: 'Next' }).click()
    if (identity == 'Onfido') {
      cy.contains('Any information you provide is confidential').should(
        'be.visible'
      )
    } else if (identity == 'IDV') {
      cy.findByLabelText('Choose the document type').click()
      cy.findByText('National ID Number').click()
      cy.findByLabelText('Enter your document number').type(nationalIDNum)
    } else {
      cy.log('Not IDV or Onfido')
      cy.get('[type="radio"]').first().click({ force: true })
    }
    cy.findByTestId('first_name').type(firstName)
    cy.findByTestId('last_name').type('automation acc')
    cy.findByTestId('date_of_birth').click()
    cy.findByText('2006').click()
    cy.findByText('Feb').click()
    cy.findByText('9', { exact: true }).click()
    if (identity == 'IDV') {
      cy.get('.dc-checkbox__box').click()
    }
    cy.findByTestId('phone').type('12345678')
    cy.findByTestId('place_of_birth').type(taxResi)
    cy.findByText(taxResi).click()
    if (identity == 'MF') {
      cy.findByTestId('citizenship').clear().type(taxResi)
      cy.findByText(taxResi).click()
    }
    cy.findByTestId('tax_residence').clear().type(taxResi)
    cy.findByText(taxResi).click()
    cy.findByTestId('tax_identification_number').type(taxIDNum)
    if (identity == 'MF') {
      cy.findByTestId('dt_personal_details_container')
        .findAllByTestId('dt_dropdown_display')
        .eq(0)
        .click()
      cy.get('#Employed').click()
      cy.findByTestId('dt_personal_details_container')
        .findAllByTestId('dt_dropdown_display')
        .eq(1)
        .click()
      cy.get('#Hedging').click()
    } else {
      cy.findByTestId('dt_personal_details_container')
        .findByTestId('dt_dropdown_display')
        .click()
      cy.get('#Hedging').click()
    }
    if (identity == 'Onfido') {
      cy.get('.dc-checkbox__box').click()
    } else if (identity == 'IDV') {
      cy.get('.dc-checkbox__box').eq(1).click()
    } else {
      cy.log('Not IDV or Onfido') //for MF account check
      cy.get('.dc-checkbox__box').click()
    }
    //below check is to make sure previous button is working.
    cy.findByRole('button', { name: 'Previous' }).click()
    cy.findByRole('button', { name: 'Next' }).click()
    cy.findByRole('button', { name: 'Next' }).click()
  }
)

Cypress.Commands.add('c_addressDetails', () => {
  cy.findByLabelText('First line of address*').type('myaddress 1')
  cy.findByLabelText('Second line of address').type('myaddress 2')
  cy.findByLabelText('Town/City*').type('mycity')
  cy.findByLabelText('Postal/ZIP Code').type('1234')
  cy.findByRole('button', { name: 'Next' }).click()
})

Cypress.Commands.add('c_addAccount', () => {
  cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
  cy.get('.fatca-declaration__agreement').click()
  cy.findAllByTestId('dti_list_item').eq(0).click()
  cy.get('.dc-checkbox__box').eq(0).click()
  cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
  cy.get('.dc-checkbox__box').eq(1).click()
  cy.findByRole('button', { name: 'Add account' }).click()
  cy.findByRole('heading', { name: 'Your account is ready' }).should(
    'be.visible'
  )
  cy.get('#real_account_signup_modal')
    .findByRole('button', { name: 'Deposit' })
    .should('be.visible')
  cy.findByRole('button', { name: 'Maybe later' }).should('be.visible').click()
  cy.url().should(
    'be.equal',
    Cypress.config('baseUrl') + '/appstore/traders-hub'
  )
  cy.get('#traders-hub').scrollIntoView({ position: 'top' })
  cy.c_closeNotificationHeader()
  cy.findAllByTestId('dt_balance_text_container').eq(0).should('be.visible')
})

Cypress.Commands.add('c_manageAccountsetting', (CoR) => {
  cy.get('.traders-hub-header__setting').click()
  cy.findByRole('link', { name: 'Proof of identity' }).click()
  cy.findByText('In which country was your document issued?').should(
    'be.visible'
  )
  cy.findByRole('button', { name: 'Next' }).should('be.disabled')
  cy.findByLabelText('Country').type(CoR)
  cy.findByText(CoR).click()
  cy.findByRole('button', { name: 'Next' }).should('not.be.disabled')
})

Cypress.Commands.add('c_completeTradingAssessment', () => {
  let count = 1
  cy.get('[type="radio"]').first().click({ force: true })
  cy.findByRole('button', { name: 'Next' }).click()
  cy.get('[type="radio"]').eq(1).click({ force: true })
  cy.findByRole('button', { name: 'Next' }).click()
  while (count < 5) {
    cy.findAllByTestId('dt_dropdown_display').eq(count).click()
    cy.findAllByTestId('dti_list_item').eq(2).click()
    count++
  }
  cy.findByRole('button', { name: 'Next' }).click()
  cy.get('[type="radio"]').eq(2).click({ force: true })
  cy.findByRole('button', { name: 'Next' }).click()
  cy.get('[type="radio"]').eq(3).click({ force: true })
  cy.findByRole('button', { name: 'Next' }).click()
  cy.get('[type="radio"]').eq(1).click({ force: true })
  cy.findByRole('button', { name: 'Next' }).click()
  cy.get('[type="radio"]').eq(3).click({ force: true })
  cy.findByRole('button', { name: 'Next' }).click()
})

Cypress.Commands.add('c_completeFinancialAssessment', () => {
  let count = 1
  while (count < 9) {
    cy.findAllByTestId('dt_dropdown_display').eq(count).click()
    cy.findAllByTestId('dti_list_item').eq(1).click()
    count++
  }
  cy.findByRole('button', { name: 'Next' }).click()
})

Cypress.Commands.add('c_addAccountMF', () => {
  cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
  cy.get('.dc-checkbox__box').eq(0).click()
  cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
  cy.get('.dc-checkbox__box').eq(1).click()
  cy.findByRole('button', { name: 'Add account' }).click()
  cy.findByRole('heading', { name: 'Deposit' }).should('be.visible')
  cy.findByTestId('dt_modal_close_icon').click()
  cy.findByRole('heading', { name: 'Account added' }).should('be.visible')
  cy.findByRole('button', { name: 'Verify now' }).should('be.visible')
  cy.findByRole('button', { name: 'Maybe later' }).should('be.visible').click()
  cy.url().should(
    'be.equal',
    Cypress.config('baseUrl') + '/appstore/traders-hub'
  )
  cy.findByRole('button', { name: 'Next' }).click()
  if (Cypress.env('diel_country_list').includes(Cypress.env('citizenship'))) {
    cy.contains('Choice of regulation').should('be.visible')
    cy.contains('button', 'Next').click()
  }
  cy.findByRole('button', { name: 'OK' }).click()
})
