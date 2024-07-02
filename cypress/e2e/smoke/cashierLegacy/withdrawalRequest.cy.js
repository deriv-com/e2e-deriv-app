let prevLanguage = ''

Cypress.Commands.add('c_verifyHeaderAndSidePanel', (language, size) => {
  cy.findByText(language.header).should('exist')
  if (size != 'small') {
    language.sidePanelHeadings.forEach((sidePanelHeading) => {
      cy.findByText(sidePanelHeading, { exact: true }).should('be.visible')
    })
  } else {
    cy.get('#dt_mobile_drawer_toggle').click()
    cy.findAllByTestId('dt_div_100_vh')
      .eq(0)
      .within(() => {
        cy.findByText(language.cashierBtnMobile).click()
        language.sidePanelHeadings.forEach((sidePanelHeading) => {
          cy.findByText(sidePanelHeading).should('be.visible')
        })
      })
    cy.get('.dc-mobile-drawer__header-close').click()
  }
})

Cypress.Commands.add(
  'c_verifyWithdrawalScreenContentBeforeLink',
  (language, size) => {
    cy.c_loadingCheck()
    // TODO uncomment when https://app.clickup.com/t/20696747/WALL-3521 is fixed.
    // cy.c_verifyHeaderAndSidePanel(language, size)

    cy.findByTestId('dt_empty_state_title')
      .should('contain.text', language.beforeEmailSentContent.summary)
      .and('be.visible')
    cy.findByTestId('dt_empty_state_description')
      .should('contain.text', language.beforeEmailSentContent.description)
      .and('be.visible')
    cy.findByTestId('dt_empty_state_action')
      .should('contain.text', language.beforeEmailSentContent.buttonText)
      .and('be.visible')
      .click()
    cy.findByTestId('dt_empty_state_title')
      .should('contain.text', language.afterEmailSentContent.summary)
      .and('be.visible')
    cy.findByTestId('dt_empty_state_description')
      .should('contain.text', language.afterEmailSentContent.description)
      .and('be.visible')
    cy.findByTestId('dt_empty_state_action')
      .should('contain.text', language.afterEmailSentContent.linkText)
      .and('be.visible')
  }
)

Cypress.Commands.add(
  'c_verifyWithdrawalScreenContentAfterLink',
  (options = {}) => {
    const {
      screenSize = 'small',
      currentLanguage = {},
      isExpired = false,
    } = options
    cy.c_visitResponsive(Cypress.env('verificationUrl'), screenSize)
    cy.c_rateLimit({
      waitTimeAfterError: 15000,
      isLanguageTest: true,
      maxRetries: 5,
    })
    cy.then(() => {
      if (
        isExpired == false &&
        !sessionStorage.getItem('c_rateLimitOccurred')
      ) {
        cy.frameLoaded('.cashier__content')
        cy.get('iframe[class=cashier__content]')
          .invoke('attr', 'height', '784')
          .then(() => {
            cy.findByTestId('dt_initial_loader').invoke('remove')
          })
        cy.get('iframe[class=cashier__content]').should('be.visible')
        cy.enter('iframe[class=cashier__content]').then((getBody) => {
          getBody().find('#prCurrentBalance').should('be.visible')
          getBody().find('#prPayoutReview').should('be.visible')
          getBody().find('#prAvailableBalance').should('be.visible')
          getBody().find('#payoutbanner').should('be.visible')
          getBody().find('#payoutoptions').should('be.visible')
          getBody().find('#morePayoutOptionsMsg').should('be.visible')
        })
        cy.c_loadingCheck()
      } else if (
        sessionStorage.getItem('c_rateLimitOccurred') == 'true' &&
        isExpired == false
      ) {
        sessionStorage.removeItem('c_rateLimitOccurred')
        if (isExpired == false) {
          sessionStorage.setItem('c_isValidLinkExpiredByRateLimit', true)
        }
        cy.c_verifyWithdrawalScreenContentAfterLinkExpired({ ...options })
      } else {
        cy.c_verifyWithdrawalScreenContentAfterLinkExpired({
          ...options,
          isExpired: true,
        })
      }
    })
  }
)

Cypress.Commands.add(
  'c_verifyWithdrawalScreenContentAfterLinkExpired',
  (options = {}) => {
    const {
      isExpired = true,
      currentLanguage = {},
      screenSize = 'small',
    } = options
    cy.then(() => {
      if (
        sessionStorage.getItem('c_isValidLinkExpiredByRateLimit') == 'true' &&
        isExpired == false
      ) {
        cy.c_visitResponsive(
          `cashier/withdrawal/?lang=${currentLanguage.urlCode}`,
          screenSize
        )
        cy.then(() => {
          sessionStorage.removeItem('c_isValidLinkExpiredByRateLimit')
        })
        cy.c_verifyWithdrawalScreenContentBeforeLink(
          currentLanguage,
          screenSize
        )
        cy.c_retrieveVerificationLinkUsingMailisk(
          Cypress.env('credentials').production.cashierWithdrawal.ID.split(
            '@'
          )[0],
          currentLanguage.emailSubject,
          Math.floor((Date.now() - 3000) / 1000)
        )
        cy.c_verifyWithdrawalScreenContentAfterLink()
      }
      if (isExpired == true) {
        cy.c_visitResponsive(Cypress.env('verificationUrl'), screenSize)
        cy.findByRole('heading', {
          name: currentLanguage.errorPopUpContent.header,
        }).should('be.visible')
        cy.findByText(
          currentLanguage.errorPopUpContent.descriptionAfterLinkExpired
        ).should('be.visible')
        cy.findByRole('button', {
          name: currentLanguage.errorPopUpContent.button,
        }).click()
      }
    })
  }
)

Cypress.Commands.add('c_checkLanguage', (languageEntry, size) => {
  const language = languageEntry[1]
  cy.then(() => {
    sessionStorage.removeItem('c_isValidLinkExpiredByRateLimit')
  })
  cy.log(`Verifying for ${languageEntry[0]}`)
  if (size == 'small') {
    cy.get('#dt_mobile_drawer_toggle').click()
    cy.findByText(prevLanguage.toUpperCase(), { exact: true }).click()
    cy.get(
      `#dt_settings_${language.urlCode.toUpperCase().replace('-', '_')}_button`
    ).click()
  } else if (size == 'large') {
    cy.findByTestId('dt_toggle_language_settings').click()
    cy.get(
      `#dt_settings_${language.urlCode.toUpperCase().replace('-', '_')}_button`
    ).click()
  }
  cy.get('.dc-mobile-drawer__overlay').should('not.be.visible')
  cy.c_verifyWithdrawalScreenContentBeforeLink(language, size)
  cy.c_retrieveVerificationLinkUsingMailisk(
    Cypress.env('credentials').production.cashierWithdrawal.ID.split('@')[0],
    language.emailSubject,
    Math.floor((Date.now() - 3000) / 1000)
  )
  cy.c_verifyWithdrawalScreenContentAfterLink({
    screenSize: size,
    currentLanguage: language,
  })
  prevLanguage = language.urlCode.replace('-', '_')
  cy.c_rateLimit({ waitTimeAfterError: 15000, maxRetries: 5 })
})

describe('QATEST-20010 Withdrawal Request: Fiat - Different language', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
    cy.c_login({
      user: 'cashierWithdrawal',
      backEndProd: true,
      rateLimitCheck: true,
    })
    cy.fixture('cashierLegacy/withdrawalLanguageContent').as('languageDetails')
  })
  it(`should verify withdrawal request page with different languages for mobile screen size`, () => {
    cy.get('@languageDetails').then((languageDetails) => {
      cy.c_visitResponsive(
        `appstore/traders-hub?lang=${languageDetails.english.urlCode}`,
        'small',
        {
          rateLimitCheck: true,
          skipPassKeys: true,
        }
      )
      cy.c_visitResponsive(
        `cashier/withdrawal/?lang=${languageDetails.english.urlCode}`,
        'small',
        { rateLimitCheck: true }
      )
      cy.c_loadingCheck()
      prevLanguage = languageDetails.english.urlCode
      const languageDetailsArray = Object.entries(languageDetails)
      const randomIndex = Math.floor(Math.random() * 4)
      cy.c_checkLanguage(languageDetailsArray[randomIndex], 'small')
      cy.c_checkLanguage(languageDetailsArray[4], 'small')
    })
  })
  it(`should verify withdrawal request page with different languages for desktop screen size`, () => {
    cy.get('@languageDetails').then((languageDetails) => {
      cy.c_visitResponsive(
        `cashier/withdrawal/?lang=${languageDetails.english.urlCode}`,
        'large',
        { rateLimitCheck: true }
      )
      cy.then(() => {
        if (sessionStorage.getItem('c_rateLimitOnVisitOccured') == 'true') {
          cy.reload()
          sessionStorage.removeItem('c_rateLimitOnVisitOccured')
        }
      })
      cy.c_loadingCheck()
      prevLanguage = languageDetails.english.urlCode
      const languageDetailsArray = Object.entries(languageDetails)
      const randomIndex = Math.floor(Math.random() * 4)
      cy.c_checkLanguage(languageDetailsArray[randomIndex], 'large')
      cy.c_checkLanguage(languageDetailsArray[4], 'large')
    })
  })
})
