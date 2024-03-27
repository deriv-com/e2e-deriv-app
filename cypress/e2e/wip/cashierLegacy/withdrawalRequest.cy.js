import '@testing-library/cypress/add-commands'

const screenSizes = ['large']

const isLanguageTest = true

Cypress.Commands.add('c_verifyLink', (options = {}) => {
  const { screenSize = 'small', isExpired = false } = options
  cy.then(() => {
    cy.c_visitResponsive(Cypress.env('verificationUrl'), screenSize)
    cy.frameLoaded('.cashier__content')
    cy.c_loadingCheck()
  })

  cy.c_rateLimit({
    waitTimeAfterError: 15000,
    isLanguageTest: true,
    maxRetries: 5,
  })
  cy.then(() => {
    if (sessionStorage.getItem('c_rateLimitOccurred') == 'true') {
      sessionStorage.removeItem('c_rateLimitOccurred')
      if (isExpired == false) {
        sessionStorage.setItem('c_isValidLinkExpiredByRateLimit', true)
      }
      cy.c_verifyLink({ ...options })
    }
  })
})

Cypress.Commands.add('c_verifyErrorContent', (options = {}) => {
  const {
    isExpired = false,
    currentLanguage = {},
    screenSize = 'small',
  } = options
  cy.then(() => {
    if (sessionStorage.getItem('c_isValidLinkExpiredByRateLimit') == 'true') {
      cy.c_visitResponsive(
        `cashier/withdrawal/?lang=${currentLanguage.urlCode}`,
        screenSize
      )
      cy.then(() => {
        sessionStorage.removeItem('c_isValidLinkExpiredByRateLimit')
      })
      cy.c_verifyWithdrawalScreenContent(currentLanguage)
      cy.c_verifyLink()
    }
    cy.findByRole('heading', {
      name: currentLanguage.errorPopUpContent.header,
    }).should('be.visible')
    if (isExpired == true) {
      cy.findByText(
        currentLanguage.errorPopUpContent.descriptionAfterLinkExpired
      ).should('be.visible')
    } else {
      cy.findByText(
        currentLanguage.errorPopUpContent.descriptionAfterEmailVerification
      ).should('be.visible')
    }
    cy.findByRole('button', {
      name: currentLanguage.errorPopUpContent.button,
    }).click()
  })
})

Cypress.Commands.add('c_verifyWithdrawalScreenContent', (language) => {
  cy.c_loadingCheck()
  // TODO uncomment when https://app.clickup.com/t/20696747/WALL-3521 is fixed.
  //cy.findByText(language[1].header).should('exist')
  cy.findByTestId('dt_empty_state_title').should(
    'contain.text',
    language.beforeEmailSentContent.summary
  )
  cy.findByTestId('dt_empty_state_description').should(
    'contain.text',
    language.beforeEmailSentContent.description
  )
  cy.findByTestId('dt_empty_state_action')
    .should('contain.text', language.beforeEmailSentContent.buttonText)
    .click()
  cy.findByTestId('dt_empty_state_title').should(
    'contain.text',
    language.afterEmailSentContent.summary
  )
  cy.findByTestId('dt_empty_state_description').should(
    'contain.text',
    language.afterEmailSentContent.description
  )
  cy.findByTestId('dt_empty_state_action').should(
    'contain.text',
    language.afterEmailSentContent.linkText
  )

  cy.mailiskSearchInbox(Cypress.env('mailiskNamespace'), {
    to_addr_prefix:
      Cypress.env('credentials').production.cashierWithdrawal.ID.split('@')[0],
    subject_includes: language.emailSubject,
    from_timestamp: Math.floor((Date.now() - 30000) / 1000),
    wait: true,
  }).then((response) => {
    const email = response.data[0]
    const verificationLink = email.text.match(/https?:\/\/\S*redirect\?\S*/)
    cy.log(verificationLink)
    Cypress.env('verificationUrl', verificationLink[0])
  })
})

describe('QATEST-20010 Withdrawal Request: Fiat - Different language', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
    cy.c_login({ user: 'cashierWithdrawal', backEndProd: true })
    cy.fixture('cashierLegacy/withdrawalLanguageContent').as('languageDetails')
  })

  screenSizes.forEach((size) => {
    it(`should verify withdrawal request page with different languages for ${size} screen size`, () => {
      cy.get('@languageDetails').then((languageDetails) => {
        cy.c_visitResponsive(
          `cashier/withdrawal/?lang=${languageDetails.english.urlCode}`,
          size
        )
        cy.c_loadingCheck()
        let prevLanguage = languageDetails.english.urlCode
        Object.entries(languageDetails).forEach((language) => {
          cy.then(() => {
            sessionStorage.removeItem('c_isValidLinkExpiredByRateLimit')
          })
          cy.log(`Verifying for ${language[0]}`)
          if (size == 'small') {
            cy.get('#dt_mobile_drawer_toggle').click()
            cy.findByText(prevLanguage.toUpperCase(), { exact: true }).click()
            cy.get(
              `#dt_settings_${language[1].urlCode.toUpperCase().replace('-', '_')}_button`
            ).click()
          } else if (size == 'large') {
            cy.findByTestId('dt_toggle_language_settings').click()
            cy.get(
              `#dt_settings_${language[1].urlCode.toUpperCase().replace('-', '_')}_button`
            ).click()
          }
          cy.c_verifyWithdrawalScreenContent(language[1])
          cy.c_verifyLink({ isExpired: false, screenSize: size })

          cy.c_verifyErrorContent({
            isExpired: false,
            currentLanguage: language[1],
            screenSize: size,
          })
          cy.c_verifyLink({
            isExpired: true,
            screenSize: size,
            isExpired: true,
            currentLanguage: language[1],
          })
          cy.c_verifyErrorContent({
            isExpired: true,
            currentLanguage: language[1],
            screenSize: size,
          })
          prevLanguage = language[1].urlCode.replace('-', '_')
          cy.c_rateLimit({ waitTimeAfterError: 15000 })
        })
      })
    })
  })
})
