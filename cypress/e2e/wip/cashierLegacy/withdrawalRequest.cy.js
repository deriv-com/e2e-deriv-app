import '@testing-library/cypress/add-commands'

const screenSizes = ['small', 'large']

const isLanguageTest = true

Cypress.Commands.add('c_verifyLink', (options = {}) => {
  const { screenSize = 'small', isExpired = false } = options
  cy.c_visitResponsive(Cypress.env('verificationdUrl'), screenSize)
  cy.c_loadingCheck()
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
  // TODO update c_withdrawalEmailVerification to c_emailVerification after PR 132 is merged.
  cy.c_withdrawalEmailVerification(
    'qa10.deriv.dev/events',
    'request_payment_withdraw.html',
    Cypress.env('loginEmail'),
    language.shortCode
  )
})

// TODO remove after PR https://github.com/deriv-com/e2e-deriv-app/pull/132 is merged
Cypress.Commands.add(
  'c_withdrawalEmailVerification',
  (
    base_url,
    request_type,
    account_email,
    language = 'EN',
    retryCount = 0,
    maxRetries = 3
  ) => {
    cy.visit(
      `https://${Cypress.env('qaBoxLoginEmail')}:${Cypress.env(
        'qaBoxLoginPassword'
      )}@${base_url}`
    )
    const sentArgs = { request_type, account_email }
    cy.origin(
      `https://${Cypress.env('qaBoxLoginEmail')}:${Cypress.env(
        'qaBoxLoginPassword'
      )}@${base_url}`,
      { args: [request_type, account_email, language] },
      ([request_type, account_email, language]) => {
        cy.document().then((doc) => {
          const allRelatedEmails = Array.from(
            doc.querySelectorAll(`a[href*="${request_type}"]`)
          )
          if (allRelatedEmails.length) {
            const verificationEmail = allRelatedEmails.pop()
            cy.wrap(verificationEmail).click()
            cy.contains('p', `${account_email}`).should('be.visible')
            cy.contains('p', `lang: ${language}`)
              .parent()
              .within(() => {
                cy.contains('a', Cypress.config('baseUrl'))
                  .invoke('attr', 'href')
                  .then((href) => {
                    if (href) {
                      Cypress.env('verificationdUrl', href)
                      cy.log(Cypress.env('verificationdUrl'))
                      const code = href.match(/code=([A-Za-z0-9]{8})/)
                      verification_code = code[1]
                      cy.log('Verification link found')
                      Cypress.env('walletsWithdrawalCode', verification_code)
                    } else {
                      cy.log('Verification link not found')
                    }
                  })
              })
          } else {
            cy.log('email not found')
          }
        })
      }
    )
    cy.then(() => {
      //Retry finding email after 1 second interval
      if (retryCount <= maxRetries && !Cypress.env('verificationdUrl')) {
        cy.log(`Retrying... Attempt number: ${retryCount + 1}`)
        cy.wait(1000)
        cy.c_withdrawalEmailVerification(
          base_url,
          request_type,
          account_email,
          ++retryCount
        )
      }
      if (retryCount > maxRetries) {
        throw new Error(
          `Signup URL extraction failed after ${maxRetries} attempts.`
        )
      }
    })
  }
)

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
