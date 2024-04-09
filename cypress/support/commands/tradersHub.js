Cypress.Commands.add('c_checkTradersHubHomePage', () => {
  cy.findByText('Options & Multipliers').should('be.visible')
  cy.findByText('CFDs').should('be.visible')
  cy.findAllByText('Deriv cTrader')
    .eq(0)
    .scrollIntoView({ position: 'bottom' })
    .should('be.visible')
  cy.findByText('Other CFD Platforms').scrollIntoView({ position: 'bottom' })
  cy.get('#traders-hub').scrollIntoView({ position: 'top' })
})

Cypress.Commands.add('c_switchToReal', () => {
  cy.findByTestId('dt_dropdown_display').click()
  cy.get('#real').click()
})

Cypress.Commands.add('c_switchToDemo', () => {
  cy.findByTestId('dt_dropdown_display').click()
  cy.get('#demo').click()
})

Cypress.Commands.add('c_completeTradersHubTour', () => {
  cy.findByRole('button', { name: 'Next' }).click()
  cy.findByRole('button', { name: 'OK' }).click()
})

Cypress.Commands.add('c_enterValidEmail', (signUpMail) => {
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
    cy.get('@email').type(signUpMail)
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
  cy.contains('Switch accounts').should('be.visible')
  cy.contains('button', 'Next').click()
  if (Cypress.env('diel_country_list').includes(Cypress.env('citizenship'))) {
    cy.contains('Choice of regulation').should('be.visible')
    cy.contains('button', 'Next').click()
  }
  cy.contains("Trader's Hub tour").should('be.visible')
  cy.contains('button', 'OK').click()
})

// TODO move to Utility finction
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
  cy.url().should('be.equal', Cypress.env('baseUrl') + 'appstore/traders-hub')
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

Cypress.Commands.add('c_completeFatcaDeclarationAgreement', () => {
  cy.get('.fatca-declaration__agreement').click()
  cy.findAllByTestId('dti_list_item').eq(0).click()
})

Cypress.Commands.add('c_addAccountMF', (type) => {
  cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
  cy.get('.dc-checkbox__box').eq(0).click()
  cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
  cy.get('.dc-checkbox__box').eq(1).click()
  if (type == 'MF') {
    cy.log('Country is ' + type)
    cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
    cy.get('.dc-checkbox__box').eq(2).click()
  }
  cy.findByRole('button', { name: 'Add account' }).click()
  cy.findByRole('heading', { name: 'Deposit' }).should('be.visible')
  cy.findByTestId('dt_modal_close_icon').click()
  cy.findByRole('heading', { name: 'Account added' }).should('be.visible')
  cy.findByRole('button', { name: 'Verify now' }).should('be.visible')
  cy.findByRole('button', { name: 'Maybe later' }).should('be.visible').click()
  cy.url().should('be.equal', Cypress.env('baseUrl') + 'appstore/traders-hub')
  cy.findByRole('button', { name: 'Next' }).click()
  if (Cypress.env('diel_country_list').includes(Cypress.env('citizenship'))) {
    cy.contains('Choice of regulation').should('be.visible')
    cy.contains('button', 'Next').click()
  }
  cy.findByRole('button', { name: 'OK' }).click()
})

Cypress.Commands.add('c_demoAccountSignup', (country, accountEmail) => {
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
    cy.get('h1').contains('Select your country and').should('be.visible')
    cy.c_selectCountryOfResidence(country)
    cy.c_selectCitizenship(country)
    cy.c_enterPassword()
    if (country !== Cypress.env('countries').ES) {
      cy.c_completeOnboarding()
    }
  })
})

Cypress.Commands.add('c_setEndpoint', (signUpMail) => {
  localStorage.setItem('config.server_url', Cypress.env('stdConfigServer'))
  localStorage.setItem('config.app_id', Cypress.env('stdConfigAppId'))
  const mainURL = Cypress.config('baseUrl')
  cy.c_visitResponsive(mainURL + 'endpoint', 'desktop')
  cy.findByRole('button', { name: 'Sign up' }).should('not.be.disabled')
  cy.c_enterValidEmail(signUpMail)
})

Cypress.Commands.add('c_validateEUDisclaimer', () => {
  cy.findByTestId('dt_traders_hub_disclaimer').should('be.visible')
  cy.findByText('EU statutory disclaimer')
  cy.findByText(
    '70.1% of retail investor accounts lose money when trading CFDs with this provider'
  ).should('be.visible')
})

/**
 * Requires a currency object that consists of both currency name and currency code
 * currency={
 *  name: "Us Dollar"
 *  code: "USD"
 * }
 */
Cypress.Commands.add(
  'c_checkCurrencyAccountExists',
  (currency, options = {}) => {
    const { closeModalAtEnd = true, modalAlreadyOpened = false } = options
    cy.log(`Checking if ${currency.name} account already exists.`)
    if (modalAlreadyOpened == false) {
      cy.c_openCurrencyAccountSelector()
    }
    cy.document().then((doc) => {
      sessionStorage.setItem(`c_is${currency.code}AccountCreated`, false)
      doc
        .querySelectorAll('.currency-item-card__details .dc-text')
        .forEach((element) => {
          if (element.textContent.includes(currency.name)) {
            cy.log(`Account for currency ${currency.name} already exists`)
            sessionStorage.setItem(`c_is${currency.code}AccountCreated`, true)
          }
        })
    })
    if (closeModalAtEnd == true) {
      cy.c_closeModal()
    }
  }
)

Cypress.Commands.add('c_getCurrentCurrencyBalance', () => {
  cy.log('Getting the current currency accounts Balance')
  cy.get('.currency-switcher-container').within(() => {
    cy.findByTestId('dt_balance_text_container').then((currentBalance) => {
      sessionStorage.setItem(
        'c_currentCurrencyBalance',
        currentBalance.text().replace(/(\d)([A-Za-z])/, '$1 $2')
      )
    })
  })
})

/**
 * Requires a currency object that consists of both currency name and currency code
 * currency={
 *  name: "Us Dollar"
 *  code: "USD"
 * }
 */
Cypress.Commands.add('c_getCurrencyBalance', (currency, options = {}) => {
  const { closeModalAtEnd = true, modalAlreadyOpened = false } = options
  cy.log(`Getting the balance for ${currency.name} account.`)
  if (modalAlreadyOpened == false) {
    cy.c_openCurrencyAccountSelector()
  }
  cy.get('.dc-modal').within(() => {
    cy.contains('div[class="currency-item-card__balance"]', currency.code).then(
      (balance) => {
        sessionStorage.setItem(`c_balance${currency.code}`, balance.text())
      }
    )
  })
  if (closeModalAtEnd == true) {
    cy.c_closeModal()
  }
})

/**
 * Requires a currency object that consists of both currency name and currency code
 * currency={
 *  name: "Us Dollar"
 *  code: "USD"
 * }
 */
Cypress.Commands.add('c_createNewCurrencyAccount', (currency) => {
  cy.log(`Creating ${currency.name} account`)
  cy.get('.dc-modal').within(() => {
    cy.findByRole('button', { name: 'Add or manage account' }).click()
    cy.findByRole('heading', {
      name: 'Choose your preferred cryptocurrency',
    }).should('exist')
    cy.findByText(currency.name).click()
    cy.findByRole('button', { name: 'Add account' }).click()
    cy.findByText('Success!').should('exist')
    cy.findByText(`You have added a ${currency.code} account.`).should(
      'be.visible'
    )
    cy.findByRole('button', { name: 'Maybe later' }).click()
  })
})

Cypress.Commands.add('c_openCurrencyAccountSelector', () => {
  cy.log('Opening currency account selector modal')
  cy.get('.currency-switcher-container').within(() => {
    cy.findByTestId('dt_currency-switcher__arrow').click()
  })
  cy.findByText('Select account').should('be.visible')
})

/**
 * Requires a currency object that consists of both currency name and currency code
 * currency={
 *  name: "Us Dollar"
 *  code: "USD"
 * }
 */
Cypress.Commands.add('c_selectCurrency', (currency, options = {}) => {
  const { modalAlreadyOpened = false } = options
  cy.log(`Selecting ${currency.name} account.`)
  if (modalAlreadyOpened == false) {
    cy.c_openCurrencyAccountSelector()
  }
  cy.get('.dc-modal').within(() => {
    cy.findByText(currency.name).click()
  })
})

/**
 * Requires a currency object that consists of both currency name and currency code
 * currency={
 *  name: "Us Dollar"
 *  code: "USD"
 * }
 */
Cypress.Commands.add(
  'c_verifyActiveCurrencyAccount',
  (currency, options = {}) => {
    const { closeModalAtEnd = true, modalAlreadyOpened = false } = options
    cy.log(`Checking if ${currency.name} account is active currency Account.`)
    if (modalAlreadyOpened == false) {
      cy.c_openCurrencyAccountSelector()
    }
    cy.get('.dc-modal').within(() => {
      cy.get('.currency-item-card--active').within(() => {
        cy.findByText(currency.name).should('exist')
      })
    })
    if (closeModalAtEnd == true) {
      cy.c_closeModal()
    }
  }
)
