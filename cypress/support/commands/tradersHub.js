import { derivApp } from '../locators'

Cypress.Commands.add('c_checkTradersHubHomePage', (isMobile = false) => {
  if (isMobile) {
    cy.c_closeNotificationHeader()
    cy.findByRole('button', { name: 'Options & Multipliers' }).should(
      'be.visible'
    )
    cy.c_closeNotificationHeader()
    cy.findByRole('button', { name: 'CFDs' }).click()
    cy.findAllByText('Deriv cTrader')
      .first()
      .scrollIntoView({ position: 'bottom' })
      .should('be.visible')
    cy.findByText('Other CFD Platforms').scrollIntoView({ position: 'bottom' })
    cy.findByRole('button', { name: 'CFDs' }).click()
    cy.c_closeNotificationHeader()
    cy.findByRole('button', { name: 'Options & Multipliers' }).click()
  } else {
    cy.findByText('Options').should('be.visible')
    cy.findByText('CFDs').should('be.visible')
    cy.findAllByText('Deriv cTrader')
      .first()
      .scrollIntoView({ position: 'bottom' })
      .should('be.visible')
    cy.findByText('Other CFD Platforms').scrollIntoView({
      position: 'bottom',
    })
    cy.findByText('Options').click()
  }
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

Cypress.Commands.add('c_enterValidEmail', (signUpMail, options = {}) => {
  const { language = 'english' } = options
  {
    cy.fixture('tradersHub/signupLanguageContent.json').then((langData) => {
      const lang = langData[language]
      cy.visit(`${Cypress.env('derivComProdURL')}${lang.urlCode}/`, {
        onBeforeLoad(win) {
          win.localStorage.setItem(
            'config.server_url',
            Cypress.env('configServer')
          )
          win.localStorage.setItem('config.app_id', Cypress.env('configAppId'))
        },
      })
      cy.visit(`${Cypress.env('derivComProdURL')}${lang.urlCode}/signup/`, {
        onBeforeLoad(win) {
          win.localStorage.setItem(
            'config.server_url',
            Cypress.env('configServer')
          )
          win.localStorage.setItem('config.app_id', Cypress.env('configAppId'))
        },
      })
      //Wait for the signup page to load completely
      cy.findByRole(
        'button',
        { name: 'whatsapp icon' },
        { timeout: 30000 }
      ).should('be.visible')
      cy.findByPlaceholderText(lang.signUpForm.emailTxtBox)
        .as('email')
        .should('be.visible')
      cy.get('@email').type(signUpMail)
      cy.findByRole('checkbox').click()
      cy.get('.error').should('not.exist')
      cy.findByRole('button', {
        name: lang.signUpForm.createDemoAccTxt,
      }).click()
      cy.findByRole('heading', { name: lang.signUpForm.checkMailTxt }).should(
        'be.visible'
      )
    })
  }
})

//Below functions are used in sign up forms
Cypress.Commands.add('c_selectCountryOfResidence', (CoR, options = {}) => {
  const { language = 'english' } = options
  cy.fixture('tradersHub/signupLanguageContent.json').then((langData) => {
    const lang = langData[language]
    cy.findByLabelText(lang.demoAccountSignUp.CoRTxt).should('be.visible')
    cy.findByLabelText(lang.demoAccountSignUp.CoRTxt).clear().type(CoR)
    cy.findByText(CoR).click()
  })
})

Cypress.Commands.add('c_selectCitizenship', (Citizenship, options = {}) => {
  const { language = 'english' } = options
  cy.fixture('tradersHub/signupLanguageContent.json').then((langData) => {
    const lang = langData[language]
    cy.findByLabelText(lang.demoAccountSignUp.citizenshipTxt).type(Citizenship)
    cy.findByText(Citizenship).click()
    cy.findByRole('button', { name: lang.realAccountFormUtils.nextBtn }).click()
  })
})

Cypress.Commands.add('c_enterPassword', (options = {}) => {
  const { language = 'english' } = options
  cy.fixture('tradersHub/signupLanguageContent.json').then((langData) => {
    const lang = langData[language]
    cy.findByLabelText(lang.demoAccountSignUp.pwdTxtBox).should('be.visible')
    cy.findByLabelText(lang.demoAccountSignUp.pwdTxtBox).type(
      Cypress.env('user_password'),
      {
        log: false,
      }
    )
    cy.findByRole('button', {
      name: lang.demoAccountSignUp.startTradingBtn,
    }).click()
  })
})

Cypress.Commands.add('c_completeOnboarding', (options = {}) => {
  const { language = 'english' } = options
  cy.contains('Switch accounts').should('be.visible')
  cy.contains('button', 'Next').click()
  if (Cypress.env('diel_country_list').includes(Cypress.env('citizenship'))) {
    cy.contains('Choice of regulation').should('be.visible')
    cy.contains('button', 'Next').click()
  }
  cy.contains("Trader's Hub tour").should('be.visible')
  cy.contains('button', 'OK').click()
  cy.c_skipPasskeysV2({ language: language })
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
    currency = Cypress.env('accountCurrency').USD,
    options = {}
  ) => {
    const { isMobile = false, language = 'english' } = options
    cy.fixture('tradersHub/signupLanguageContent.json').then((langData) => {
      const lang = langData[language]
      cy.findByText(currency).click()
      cy.findByRole('button', {
        name: lang.realAccountFormUtils.nextBtn,
      }).click()
      if (identity == 'Onfido') {
        cy.contains('Any information you provide is confidential').should(
          'be.visible'
        )
      } else if (identity == 'IDV') {
        if (isMobile) {
          cy.get(`select[name='document_type']`).select('National ID Number')
        } else {
          cy.findByLabelText('Choose the document type').click()
          cy.findByText('National ID Number').click()
        }
        cy.findByLabelText('Enter your document number').type(nationalIDNum)
      } else {
        cy.log('Not IDV or Onfido')
        cy.get('[type="radio"]').first().click({ force: true })
      }
      cy.findByTestId('first_name').type(firstName)
      cy.findByTestId('last_name').type('automation acc')
      if (isMobile) cy.findByTestId('date_of_birth').type('2006-02-09')
      else {
        cy.findByTestId('date_of_birth').click()
        cy.findByText('2006').click()
        cy.findByText('Feb').click()
        cy.findByText('9', { exact: true }).click()
      }
      if (identity == 'IDV') {
        cy.get('.dc-checkbox__box').click()
      }
      cy.findByTestId('phone').type('12345678')
      if (isMobile) cy.findByTestId(/place_of_birth/).select(taxResi)
      else {
        cy.findByTestId('place_of_birth').type(taxResi)
        cy.findByText(taxResi).click()
      }

      if (identity == 'MF') {
        if (isMobile) cy.findByTestId(/citizenship/).select(taxResi)
        else {
          cy.findByTestId('citizenship').clear().type(taxResi)
          cy.findByText(taxResi).click()
        }
      }
      if (isMobile) {
        cy.findAllByTestId(/tax_residence/i)
          .first()
          .select(taxResi)
      } else {
        cy.findByTestId('tax_residence').clear().type(taxResi)
        cy.findByText(taxResi).click()
      }

      cy.findByTestId('tax_identification_number').type(taxIDNum)
      if (identity == 'MF') {
        cy.findByText(lang.personalDetailsForm.validTaxInfoChkBox).should(
          'be.visible'
        )
        if (isMobile) {
          cy.get(`select[name='employment_status']`).select(
            lang.personalDetailsForm.employedTxt
          )
          cy.findByTestId(/account_opening_reason/).select(
            lang.personalDetailsForm.hedgingTxt
          )
        } else {
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
        }
      } else {
        if (isMobile)
          cy.findByTestId(/account_opening_reason/).select('Hedging')
        else {
          cy.findByTestId('dt_personal_details_container')
            .findByTestId('dt_dropdown_display')
            .click()
          cy.get('#Hedging').click()
        }
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
      cy.findByRole('button', {
        name: lang.realAccountFormUtils.prevBtn,
      }).click()
      cy.findByRole('button', {
        name: lang.realAccountFormUtils.nextBtn,
      }).click()
      cy.findByRole('button', {
        name: lang.realAccountFormUtils.nextBtn,
      }).click()
    })
  }
)

Cypress.Commands.add('c_addressDetails', (options = {}) => {
  const { language = 'english' } = options
  cy.fixture('tradersHub/signupLanguageContent.json').then((langData) => {
    const lang = langData[language]
    cy.findByLabelText(lang.addressDetailsForm.firstLineAddressTxtBox).type(
      'myaddress 1'
    )
    cy.findByLabelText(lang.addressDetailsForm.secondLineAddressTxtBox).type(
      'myaddress 2'
    )
    cy.findByLabelText(lang.addressDetailsForm.cityTxtBox).type('mycity')
    cy.findByLabelText(lang.addressDetailsForm.zipTxtBox).type('1234')
    cy.findByRole('button', { name: lang.realAccountFormUtils.nextBtn }).click()
  })
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
  cy.findByRole('button', { name: 'Deposit' }).should('be.visible')
  cy.findByRole('button', { name: 'Maybe later' }).should('be.visible').click()
  cy.url().should(
    'be.equal',
    Cypress.config('baseUrl') + 'appstore/traders-hub'
  )
  cy.get('#traders-hub').scrollIntoView({ position: 'top' })
  cy.c_closeNotificationHeader()
  cy.findAllByTestId('dt_balance_text_container').eq(0).should('be.visible')
})

Cypress.Commands.add('c_manageAccountsetting', (CoR, options = {}) => {
  const { isMobile = false, language = 'english' } = options
  cy.fixture('tradersHub/signupLanguageContent.json').then((langData) => {
    const lang = langData[language]
    if (isMobile) {
      derivApp.commonPage.mobileLocators.header.hamburgerMenuButton().click()
      cy.findByRole('heading', {
        name: lang.accountSettings.accountSettingsTxt,
      }).click()
    } else {
      cy.get('.traders-hub-header__setting').click()
    }
    cy.findByRole('link', { name: lang.accountSettings.poiTxt }).click()
    cy.findByText(lang.accountSettings.issuedCountryTxt).should('be.visible')
    cy.findByRole('button', { name: lang.realAccountFormUtils.nextBtn }).should(
      'be.disabled'
    )
    if (isMobile) cy.get(`select[name='country_input']`).select(CoR)
    else {
      cy.findByLabelText('Country').should('not.be.disabled').type(CoR)
      cy.findByText(CoR).as('COR').scrollIntoView().should('be.visible')
      cy.get('@COR', { timeout: 15000 }).click()
    }
    cy.findByRole('button', { name: lang.realAccountFormUtils.nextBtn }).should(
      'not.be.disabled'
    )
  })
})

Cypress.Commands.add('c_completeTradingAssessment', (options = {}) => {
  const { isMobile = false, language = 'english' } = options
  cy.fixture('tradersHub/signupLanguageContent.json').then((langData) => {
    const lang = langData[language]
    cy.get('[type="radio"]').first().click({ force: true })
    cy.findByRole('button', { name: lang.realAccountFormUtils.nextBtn }).click()
    cy.get('[type="radio"]').eq(1).click({ force: true })
    cy.findByRole('button', { name: lang.realAccountFormUtils.nextBtn }).click()
    let count = 1
    while (count < 5) {
      if (isMobile) {
        cy.get('.dc-select-native__picker')
          .eq(count - 1)
          .select(2)
      } else {
        cy.findAllByTestId('dt_dropdown_display').eq(count).click()
        cy.findAllByTestId('dti_list_item').eq(2).click()
      }
      count++
    }

    cy.findByRole('button', { name: lang.realAccountFormUtils.nextBtn }).click()
    cy.get('[type="radio"]').eq(2).click({ force: true })
    cy.findByRole('button', { name: lang.realAccountFormUtils.nextBtn }).click()
    cy.get('[type="radio"]').eq(3).click({ force: true })
    cy.findByRole('button', { name: lang.realAccountFormUtils.nextBtn }).click()
    cy.get('[type="radio"]').eq(1).click({ force: true })
    cy.findByRole('button', { name: lang.realAccountFormUtils.nextBtn }).click()
    cy.get('[type="radio"]').eq(3).click({ force: true })
    cy.findByRole('button', { name: lang.realAccountFormUtils.nextBtn }).click()
  })
})

Cypress.Commands.add('c_completeFinancialAssessment', (options = {}) => {
  const { isMobile = false, language = 'english' } = options
  cy.fixture('tradersHub/signupLanguageContent.json').then((langData) => {
    const lang = langData[language]
    let count = 1
    while (count < 9) {
      if (isMobile) {
        cy.get('.dc-select-native__picker')
          .eq(count - 1)
          .select(1)
      } else {
        cy.findAllByTestId('dt_dropdown_display').eq(count).click()
        cy.findAllByTestId('dti_list_item').eq(1).click()
      }

      count++
    }
    cy.findByRole('button', { name: lang.realAccountFormUtils.nextBtn }).click()
  })
})

Cypress.Commands.add('c_completeFatcaDeclarationAgreement', () => {
  cy.get('.fatca-declaration__agreement').click()
  cy.findAllByTestId('dti_list_item').eq(0).click()
})

Cypress.Commands.add('c_addAccountMF', (type, options = {}) => {
  const { isMobile = false, language = 'english' } = options
  cy.fixture('tradersHub/signupLanguageContent.json').then((langData) => {
    const lang = langData[language]
    cy.findByRole('button', {
      name: lang.addRealAccountTexts.addAccountBtn,
    }).should('be.disabled')
    cy.get('.dc-checkbox__box').eq(0).click()
    cy.findByRole('button', {
      name: lang.addRealAccountTexts.addAccountBtn,
    }).should('be.disabled')
    cy.get('.dc-checkbox__box').eq(1).click()
    if (type == 'MF') {
      cy.log('Country is ' + type)
      cy.findByText(lang.addRealAccountTexts.ownInitiativeVerify).should(
        'be.visible'
      )
      cy.findByRole('button', {
        name: lang.addRealAccountTexts.addAccountBtn,
      }).should('be.disabled')
      cy.get('.dc-checkbox__box').eq(2).click()
    }
    cy.findByRole('button', {
      name: lang.addRealAccountTexts.addAccountBtn,
    }).click()
    cy.findByRole('heading', {
      name: lang.addRealAccountTexts.depositeBtn,
    }).should('be.visible')
    if (isMobile) {
      cy.findByTestId('dt_page_overlay_header_close').click()
    } else {
      cy.findByTestId('dt_modal_close_icon').click()
    }
    if (language != 'english') {
      cy.url().should(
        'be.equal',
        Cypress.config('baseUrl') +
          `appstore/traders-hub?lang=${lang.shortCode}`
      )
    } else {
      cy.url().should(
        'be.equal',
        Cypress.config('baseUrl') + 'appstore/traders-hub'
      )
    }
    cy.findByRole('heading', {
      name: lang.addRealAccountTexts.accAddedTxt,
    }).should('be.visible')
    cy.findByText(lang.addRealAccountTexts.accVerificationTxt).should(
      'be.visible'
    )
    cy.findByRole('button', { name: lang.addRealAccountTexts.verifyNowBtn })
      .should('be.visible')
      .and('be.enabled')
    cy.findByRole('button', {
      name: lang.addRealAccountTexts.maybeLaterBtn,
    }).click()
    cy.c_completeTradersHubTour(options)
  })
})

Cypress.Commands.add(
  'c_demoAccountSignup',
  (country, accountEmail, size = 'desktop', options = {}) => {
    const { language = 'english' } = options
    const countriesToCheck = [Cypress.env('countries').ES, 'España']
    cy.fixture('tradersHub/signupLanguageContent.json').then((langData) => {
      const lang = langData[language]
      cy.c_emailVerification('account_opening_new.html', accountEmail)
      cy.then(() => {
        cy.c_visitResponsive(Cypress.env('verificationUrl'), size).then(() => {
          cy.window().then((win) => {
            win.localStorage.setItem(
              'config.server_url',
              Cypress.env('stdConfigServer')
            )
            win.localStorage.setItem(
              'config.app_id',
              Cypress.env('stdConfigAppId')
            )
          })
        })
        cy.get('h1')
          .contains(lang.demoAccountSignUp.selectCountryDropdown)
          .should('be.visible')
        cy.c_selectCountryOfResidence(country, options)
        cy.c_selectCitizenship(country, options)
        cy.c_enterPassword(options)
        if (!countriesToCheck.includes(country)) {
          cy.c_completeOnboarding()
        }
      })
    })
  }
)

Cypress.Commands.add(
  'c_setEndpoint',
  (
    signUpMail,
    size = 'desktop',
    mainURL = Cypress.config('baseUrl'),
    options = {}
  ) => {
    const { language = 'english' } = options
    cy.log(Cypress.config('baseUrl'))
    cy.log(language)
    cy.fixture('tradersHub/signupLanguageContent.json').then((langData) => {
      const lang = langData[language]
      localStorage.setItem('config.server_url', Cypress.env('stdConfigServer'))
      localStorage.setItem('config.app_id', Cypress.env('stdConfigAppId'))
      if (language != 'english') {
        cy.c_visitResponsive(`${mainURL}endpoint?lang=${lang.urlCode}`, size)
      } else {
        cy.c_visitResponsive(`${mainURL}endpoint`, size)
      }
      cy.findByRole('button', { name: lang.signUpForm.signUpBtn }).should(
        'not.be.disabled'
      )
      cy.c_enterValidEmail(signUpMail, options)
    })
  }
)

Cypress.Commands.add('c_validateEUDisclaimer', () => {
  cy.findByTestId('dt_traders_hub_disclaimer').should('be.visible')
  cy.findByText(
    'The products offered on our website are complex derivative products that carry a significant risk of potential loss. CFDs are complex instruments with a high risk of losing money rapidly due to leverage. 70.1% of retail investor accounts lose money when trading CFDs with this provider. You should consider whether you understand how these products work and whether you can afford to take the high risk of losing your money.'
  ).should('be.visible')
})

<<<<<<< HEAD
/**
 * Requires a currency object that consists of both currency name and currency code and delta
 * currency={
 *  name: "Us Dollar"
 *  code: "USD"
 *  delta: "0.0"
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

/**
 * Requires a Account object
 * Account = {
 * type: 'Deriv MT5',
 * subType: 'Derived',
 * code: 'SVG',
 * delta: 0.0, // needed for approximately equal to
 * accurateDelta: 0.0, // this for BTC to match exact exchangerate
 * }
 */
Cypress.Commands.add('c_checkMt5AccountExists', (Account) => {
  cy.log(
    `Checking if ${Account.type} ${Account.subType} ${Account.jurisdiction} account already exists.`
  )
  cy.document().then((doc) => {
    sessionStorage.setItem(
      `c_is${Account.subType}${Account.jurisdiction}AccountCreated`,
      false
    )
    const transferBtnAccount = doc.querySelector(
      `[data-testid="dt_trading-app-card_real_${Account.subType.toLowerCase()}_${Account.jurisdiction.toLowerCase()}"] .trading-app-card__actions [name="transfer-btn"]`
    )
    if (transferBtnAccount && transferBtnAccount != null) {
      cy.log(
        `Account for ${Account.type} ${Account.subType} ${Account.jurisdiction} already exists`
      )
      sessionStorage.setItem(
        `c_is${Account.subType}${Account.jurisdiction}AccountCreated`,
        true
      )
    } else {
      cy.log(
        `Account for ${Account.type} ${Account.subType} ${Account.jurisdiction} does not exist.`
      )
    }
  })
})

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
 *  delta: "0.0"
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
 * Requires a Account object
 * Account = {
 * type: 'Deriv MT5',
 * subType: 'Derived',
 * code: 'SVG',
 * delta: 0.0, // needed for approximately equal to
 * accurateDelta: 0.0, // this for BTC to match exact exchangerate
 * }
 */
Cypress.Commands.add('c_getMt5AccountBalance', (Account) => {
  cy.log(
    `Getting the balance for ${Account.type} ${Account.subType} ${Account.jurisdiction} account.`
  )
  cy.findByTestId(
    `dt_trading-app-card_real_${Account.subType.toLowerCase()}_${Account.jurisdiction.toLowerCase()}`
  )
    .findByTestId('dt_account-balance')
    .then((balance) => {
      sessionStorage.setItem(
        `c_balance${Account.subType}${Account.jurisdiction}`,
        balance.text()
      )
    })
})

/**
 * Requires a currency object that consists of both currency name and currency code
 * currency={
 *  name: "Us Dollar"
 *  code: "USD"
 *  delta: "0.0"
 * }
 */
Cypress.Commands.add('c_createNewCurrencyAccount', (currency, options = {}) => {
  const { size = 'large' } = options
  cy.log(`Creating ${currency.name} account`)
  cy.get('.dc-modal').within(() => {
    cy.findByRole('button', { name: 'Add or manage account' }).click()
    if (size == 'small') {
      cy.get('form', { withinSubject: null }).within(() => {
        cy.findByText('Choose your preferred cryptocurrency').should(
          'be.visible'
        )
        cy.findByText(currency.name).click()
        cy.findByRole('button', { name: 'Add account' }).click()
        cy.get('body', { withinSubject: null }).within(() => {
          cy.findByText('Success!').should('exist')
          cy.findByText(`You have added a ${currency.code} account.`).should(
            'be.visible'
          )
          cy.findByRole('button', { name: 'Maybe later' }).click()
        })
      })
    } else {
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
    }
  })
})

/**
 * Requires a Account object
 * Account = {
 * type: 'Deriv MT5',
 * subType: 'Derived',
 * code: 'SVG',
 * fullCode: 'St. Vincent & Grenadines',
 * delta: 0.0, // needed for approximately equal to
 * accurateDelta: 0.0, // this for BTC to match exact exchangerate
 * }
 */
Cypress.Commands.add('c_createNewMt5Account', (Account, options = {}) => {
  const { size = 'large' } = options
  cy.log(
    `Creating ${Account.type} ${Account.subType} ${Account.jurisdiction} account`
  )
  cy.findByTestId(`dt_trading-app-card_real_${Account.subType.toLowerCase()}`)
    .findByRole('button', { name: 'Get' })
    .click()
  cy.findByText(Account.fullJurisdiction).should('be.visible').click()
  cy.findByTestId('dt-jurisdiction-footnote')
    .should('be.visible')
    .should(
      'contain.text',
      `Add your Deriv MT5 ${Account.subType} account under Deriv (SVG) LLC (company no. 273 LLC 2020).`
    )
  cy.findByRole('button', { name: 'Next' }).click()
  const isNewPassword = Cypress.$(':contains("Create a Deriv MT5 password")')
  const isAlreadyCreatedPassword = Cypress.$(
    ':contains("Enter your Deriv MT5 password")'
  )
  cy.get('.dc-modal').within(() => {
    if (isNewPassword) {
      cy.findByText('Create a Deriv MT5 password').should('be.visible')
      cy.findByText(
        'You can use this password for all your Deriv MT5 accounts.'
      ).should('be.visible')
      cy.findByRole('button', { name: 'Create Deriv MT5 password' })
        .should('be.visible')
        .and('be.disabled')
      cy.findByTestId('dt_mt5_password')
        .should('be.visible')
        .type(Cypress.env('mt5Password'))
      cy.findByRole('button', { name: 'Create Deriv MT5 password' })
        .should('be.visible')
        .and('be.enabled')
        .click()
    } else if (isAlreadyCreatedPassword) {
      cy.findByText('Enter your Deriv MT5 password').should('be.visible')
      cy.findByText(
        `Enter your Deriv MT5 password to add a MT5 ${Account.type} ${Account.jurisdiction} account`
      ).should('be.visible')
      cy.findByRole('button', { name: 'Forgot password?' })
        .should('be.visible')
        .and('be.enabled')
      cy.findByRole('button', { name: 'Add account' })
        .should('be.visible')
        .and('be.disabled')
      cy.findByTestId('dt_mt5_password')
        .should('be.visible')
        .type(Cypress.env('mt5Password'))
      cy.findByRole('button', { name: 'Add account' })
        .should('be.visible')
        .and('be.enabled')
        .click()
    }
  })
  cy.findByRole('heading', { name: 'Success!' }).should('be.visible')
  cy.findByText(
    `Congratulations, you have successfully created your real ${Account.type} ${Account.subType} ${Account.jurisdiction} account. To start trading, transfer funds from your Deriv account into this account.`
  )
  cy.findByRole('button', { name: 'Transfer now' })
    .should('be.visible')
    .and('be.enabled')
  cy.findByRole('button', { name: 'Maybe later' })
    .should('be.visible')
    .and('be.enabled')
    .click()
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
 *  delta: "0.0"
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
 *  delta: "0.0"
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
=======
Cypress.Commands.add('c_validateEUDisclaimer', () => {
  cy.findByTestId('dt_traders_hub_disclaimer').should('be.visible')
  cy.findByText('EU statutory disclaimer')
  cy.findByText(
    '70.1% of retail investor accounts lose money when trading CFDs with this provider'
  ).should('be.visible')
})
>>>>>>> 1bf8af3e (eudisclaimer (#169))
