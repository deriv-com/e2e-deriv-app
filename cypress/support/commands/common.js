import { getOAuthUrl, getWalletOAuthUrl } from '../helper/loginUtility'

Cypress.prevAppId = 0
Cypress.prevUser = ''
const expectedCookieValue = '{%22clients_country%22:%22br%22}'

let newApplicationId

const setLoginUser = (user = 'masterUser', options = {}) => {
  const { backEndProd = false } = options
  if (
    Cypress.config().baseUrl == Cypress.env('prodURL') ||
    backEndProd == true
  ) {
    return {
      loginEmail: Cypress.env('credentials').production[`${user}`].ID,
      loginPassword: Cypress.env('credentials').production[`${user}`].PSWD,
    }
  } else {
    return {
      loginEmail: Cypress.env('credentials').test[`${user}`].ID,
      loginPassword: Cypress.env('credentials').test[`${user}`].PSWD,
    }
  }
}

Cypress.Commands.add('c_visitResponsive', (path, size, options = {}) => {
  const { rateLimitCheck = false } = options
  //Custom command that allows us to use baseUrl + path and detect with this is a responsive run or not.
  cy.log(path)
  if (size === undefined) size = Cypress.env('viewPortSize')

  if (size == 'small') cy.viewport('iphone-xr')
  else if (size == 'medium') cy.viewport('ipad-2')
  else cy.viewport('macbook-16')

  cy.visit(path)
  cy.log('rateLimitCheck flag is set to: ', rateLimitCheck)
  if (rateLimitCheck == true) {
    cy.c_rateLimit({
      waitTimeAfterError: 15000,
      maxRetries: 5,
    })
    cy.then(() => {
      if (sessionStorage.getItem('c_rateLimitOnVisitOccured') == 'true') {
        cy.visit(path)
      }
    })
  }

  if (path.includes('region')) {
    //Wait for relevent elements to appear (based on page)
    cy.log('Home page Selected')
    cy.findByRole(
      'button',
      { name: 'whatsapp icon' },
      { timeout: 30000 }
    ).should('be.visible') //For the home page, this seems to be the best indicator that a page has fully loaded. It may change in the future.
  }

  if (path.includes('help-centre')) {
    //Wait for relevent elements to appear (based on page)
    cy.log('Help Centre Selected')
    cy.findByRole('heading', {
      name: 'Didn’t find your answer? We can help.',
    }).should('be.visible', { timeout: 30000 })
  }

  if (path.includes('traders-hub')) {
    //Wait for relevent elements to appear (based on page)
    cy.log('Trader Hub Selected')
  }
})

Cypress.Commands.add('c_login', (options = {}) => {
  const {
    user = 'masterUser',
    app = '',
    backEndProd = false,
    rateLimitCheck = false,
  } = options
  const { loginEmail, loginPassword } = setLoginUser(user, {
    backEndProd: backEndProd,
  })
  cy.c_visitResponsive('/endpoint', 'large', { rateLimitCheck: rateLimitCheck })

  if (app == 'doughflow') {
    Cypress.env('configServer', Cypress.env('doughflowConfigServer'))
    Cypress.env('configAppId', Cypress.env('doughflowConfigAppId'))
  } //Use production server and app id for production base url
  else if (Cypress.config().baseUrl == Cypress.env('prodURL')) {
    Cypress.env('configServer', Cypress.env('prodServer'))
    Cypress.env('configAppId', Cypress.env('prodAppId'))
  } else if (
    Cypress.config().baseUrl != Cypress.env('prodURL') &&
    backEndProd == true
  ) {
    Cypress.env('configServer', Cypress.env('prodServer'))
    Cypress.env('configAppId', Cypress.env('stgAppId'))
  } else {
    Cypress.env('configServer', Cypress.env('stdConfigServer'))
    Cypress.env('configAppId', Cypress.env('stdConfigAppId'))
  }

  //If we're switching between apps or users, we'll need to re-authenticate
  if (
    Cypress.prevAppId != Cypress.env('configAppId') ||
    Cypress.prevUser != user
  ) {
    cy.log('prevAppId: ' + Cypress.prevAppId)
    cy.log(`Prev User: ${Cypress.prevUser}`)
    Cypress.prevUser = user
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
  if (Cypress.env('oAuthUrl') == '<empty>') {
    getOAuthUrl(
      (oAuthUrl) => {
        Cypress.env('oAuthUrl', oAuthUrl)
        const urlParams = new URLSearchParams(Cypress.env('oAuthUrl'))
        const token = urlParams.get('token1')

        Cypress.env('oAuthToken', token)
        cy.c_doOAuthLogin(app, { rateLimitCheck: rateLimitCheck })
      },
      loginEmail,
      loginPassword
    )
    // } else if (
    //   (Cypress.env('oAuthUrl') == '<empty>' && app == 'wallets') ||
    //   app == 'doughflow'
    // ) {
    //   getWalletOAuthUrl((oAuthUrl) => {
    //     cy.log('came inside wallet getOauth')
    //     Cypress.env('oAuthUrl', oAuthUrl)
    //     cy.c_doOAuthLogin(app, { rateLimitCheck: rateLimitCheck })
    //   })
    // }
  } else {
    cy.c_doOAuthLogin(app, { rateLimitCheck: rateLimitCheck })
  }
})

Cypress.Commands.add('c_doOAuthLogin', (app, options = {}) => {
  const { rateLimitCheck = false } = options
  cy.c_visitResponsive(Cypress.env('oAuthUrl'), 'large', {
    rateLimitCheck: rateLimitCheck,
  })
  cy.c_fakeLinkPopUpCheck()
  cy.document().then((doc) => {
    const launchModal = doc.querySelector('[data-test-id="launch-modal"]')
    if (launchModal) {
      cy.findByRole('button', { name: 'Ok' }).click()
    }
  })

  //Complete trading assessment for EU accounts if it's there
  cy.findByText('Trading Experience Assessment')
    .should(() => {})
    .then(($el) => {
      if ($el.length) {
        cy.findByRole('button', { name: 'OK' }).click()
        cy.c_completeTradingAssessment()
        cy.findByRole('button', { name: 'OK' }).click()
        cy.log('Completed trading assessment!!!')
      }
    })
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
          cy.findAllByText("Trader's Hub").last().should('be.visible')
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
        cy.findAllByText("Trader's Hub").last().should('be.visible')
      }
    }
  })
})

Cypress.Commands.add('c_mt5login', () => {
  cy.c_visitResponsive(Cypress.env('mt5BaseUrl') + '/terminal', 'large')
  cy.findByRole('button', { name: 'Accept' }).click()
  cy.findByPlaceholderText('Enter Login').click()
  cy.findByPlaceholderText('Enter Login').type(Cypress.env('mt5Login'))
  cy.findByPlaceholderText('Enter Password').click()
  cy.findByPlaceholderText('Enter Password').type(Cypress.env('mt5Password'))
  cy.findByRole('button', { name: 'Connect to account' }).click()
})

//To be added on hotspots as an edge case only when constantly hitting rate limits
Cypress.Commands.add('c_rateLimit', (options = {}) => {
  const {
    retryCount = 1,
    maxRetries = 3,
    waitTimeAfterError = 60000,
    retryWaitTime = 1000,
    isLanguageTest = false,
  } = options

  cy.get('#modal_root, .modal-root', { timeout: 10000, log: false }).then(
    ($element) => {
      if ($element.children().length > 0) {
        cy.document({ log: false }).then((doc) => {
          const rateLimitError = doc.querySelector(
            'div[class="unhandled-error"]'
          )
          if (rateLimitError) {
            cy.log(
              `Rate limit detected, waiting for ${waitTimeAfterError / 1000}s before retrying...`
            )
            sessionStorage.setItem('c_rateLimitOnVisitOccured', true)
            cy.wait(waitTimeAfterError, { log: false })
            cy.get('div[class="unhandled-error"]').within(() => {
              cy.get('button[type="submit"]', { log: false }).click({
                log: false,
              })
            })
            cy.c_loadingCheck()
            if (isLanguageTest == true) {
              sessionStorage.setItem('c_rateLimitOccurred', true)
            }
            cy.c_rateLimit({ ...options, retryCount: retryCount + 1 })
            options.retryCount = 1
          }
        })
      } else if (retryCount < maxRetries) {
        cy.log(
          `No rate limit modal found, retrying in ${retryWaitTime / 1000}s... Attempt number: ${retryCount}`
        )
        cy.wait(retryWaitTime, { log: false })
        cy.c_rateLimit({ ...options, retryCount: retryCount + 1 })
      } else {
        cy.log(
          `Max retries reached without detecting a rate limit error, after ${retryCount} attempts`
        )
      }
    }
  )
})

Cypress.Commands.add('c_transferLimit', (transferMessage) => {
  cy.get('.wallets-cashier-content', { timeout: 10000 })
    // IF ADDED ONLY IF CONDITION WORKS, IF REMOVED ONLY ELSE CONDITION WORKS
    // .contains(
    //   `You can only perform up to 10 transfers a day. Please try again tomorrow.` ||
    //     "You have exceeded 200.00 USD in cumulative transactions. To continue, you will need to verify your identity.",
    //     {timeout: 5000}
    // )
    .then(($element) => {
      if (
        $element
          .text()
          .includes(
            `You can only perform up to 10 transfers a day. Please try again tomorrow.` ||
              'You have exceeded 200.00 USD in cumulative transactions. To continue, you will need to verify your identity.'
          )
      ) {
        cy.contains('Reset error').then(($resetElement) => {
          if ($resetElement.length) {
            cy.wrap($resetElement).click()
          }
          cy.contains('Wallet', { timeout: 10000 }).should('exist')
        })
      } else {
        cy.findByText('Your transfer is successful!', {
          exact: true,
        }).should('be.visible')
        cy.contains(transferMessage)
      }
    })
})

Cypress.on('uncaught:exception', (err, runnable, promise) => {
  console.log(err)
  return false
})

//Select Real account from Dtrader
Cypress.Commands.add('c_selectRealAccount', () => {
  cy.findByTestId('dt_acc_info').should('be.visible').click()
  cy.findByText('Real').should('be.visible').click()
  cy.get('acc-switcher__new-account').should('not.exist')
  cy.get('.dc-content-expander__content').should('be.visible').click()
  cy.findByTestId('dt_acc_info').should('be.visible')
})

//Select Demo account from Dtrader
Cypress.Commands.add('c_selectDemoAccount', () => {
  cy.findByTestId('dt_acc_info').should('be.visible').click()
  cy.findByText('Demo').should('be.visible').click()
  cy.get('.dc-content-expander__content').should('be.visible').click()
  cy.findByTestId('dt_acc_info').should('be.visible')
})

Cypress.Commands.add(
  'c_emailVerification',
  (requestType, accountEmail, options = {}) => {
    const {
      retryCount = 0,
      maxRetries = 3,
      baseUrl = Cypress.env('configServer') + '/events',
    } = options
    cy.log(`Visit ${baseUrl}`)
    const userID = Cypress.env('qaBoxLoginEmail')
    const userPSWD = Cypress.env('qaBoxLoginPassword')
    cy.visit(
      `https://${Cypress.env('qaBoxLoginEmail')}:${Cypress.env(
        'qaBoxLoginPassword'
      )}@${baseUrl}`,
      { log: false }
    )
    cy.origin(
      `https://${Cypress.env('qaBoxLoginEmail', { log: false })}:${Cypress.env(
        'qaBoxLoginPassword',
        { log: false }
      )}@${baseUrl}`,
      { args: [requestType, accountEmail] },
      ([requestType, accountEmail]) => {
        cy.document().then((doc) => {
          const allRelatedEmails = Array.from(
            doc.querySelectorAll(`a[href*="${requestType}"]`)
          )
          if (allRelatedEmails.length) {
            const verificationEmail = allRelatedEmails.pop()
            cy.wrap(verificationEmail).click()
            cy.get('p')
              .filter(`:contains('${accountEmail}')`)
              .last()
              .should('be.visible')
              .parent()
              .children()
              .contains('a', Cypress.config('baseUrl'))
              .invoke('attr', 'href')
              .then((href) => {
                if (href) {
                  Cypress.env('verificationUrl', href)
                  const code = href.match(/code=([A-Za-z0-9]{8})/)
                  verification_code = code[1]
                  Cypress.env('walletsWithdrawalCode', verification_code)
                  cy.log('Verification link found')
                } else {
                  cy.log('Verification link not found')
                }
              })
          } else {
            cy.log('email not found')
          }
        })
      }
    )
    cy.then(() => {
      //Rotating credentials
      Cypress.env('qaBoxLoginEmail', userID)
      Cypress.env('qaBoxLoginPassword', userPSWD)
      //Retry finding email after 1 second interval
      if (retryCount < maxRetries && !Cypress.env('verificationUrl')) {
        cy.log(`Retrying... Attempt number: ${retryCount + 1}`)
        cy.wait(1000)
        cy.c_emailVerification(requestType, accountEmail, {
          ...options,
          retryCount: retryCount + 1,
        })
      }
      if (retryCount > maxRetries) {
        throw new Error(
          `Signup URL extraction failed after ${maxRetries} attempts.`
        )
      }
    })
  }
)

Cypress.Commands.add(
  'c_emailVerificationV2',
  (requestType, accountEmail, options = {}) => {
    const { baseUrl = Cypress.env('configServer') + '/events' } = options
    cy.log(`Visit ${baseUrl}`)
    cy.visit(
      `https://${Cypress.env('qaBoxLoginEmail')}:${Cypress.env(
        'qaBoxLoginPassword'
      )}@${baseUrl}`,
      { log: false }
    )
    cy.document().then((doc) => {
      let verification_code
      const allRelatedEmails = Array.from(
        doc.querySelectorAll(`a[href*="${requestType}"]`)
      )
      if (allRelatedEmails.length) {
        const verificationEmail = allRelatedEmails.pop()
        cy.wrap(verificationEmail).click()
        cy.get('p')
          .filter(`:contains('${accountEmail}')`)
          .last()
          .should('be.visible')
          .parent()
          .children()
          .contains('a', Cypress.config('baseUrl'))
          .invoke('attr', 'href')
          .then((href) => {
            if (href) {
              Cypress.env('verificationUrl', href)
              const code = href.match(/code=([A-Za-z0-9]{8})/)
              verification_code = code[1]
              cy.task('setVerificationCode', verification_code)
              cy.log('Verification link found')
            } else {
              cy.log('Verification link not found')
            }
          })
      } else {
        cy.log('email not found')
      }
    })
  }
)

Cypress.Commands.add(
  'c_retrieveVerificationLinkUsingMailisk',
  (account, subject, timestamp) => {
    cy.mailiskSearchInbox(Cypress.env('mailiskNamespace'), {
      to_addr_prefix: account,
      subject_includes: subject,
      wait: true,
      ...(timestamp ? { from_timestamp: timestamp } : {}),
    }).then((response) => {
      const email = response.data[0]
      const verificationLink = email.text.match(/https?:\/\/\S*redirect\?\S*/)
      cy.log(verificationLink)
      Cypress.env('verificationUrl', verificationLink[0])
    })
  }
)

Cypress.Commands.add('c_loadingCheck', () => {
  cy.findByTestId('dt_initial_loader').should('not.exist')
})

/**
 * Method to perform Authorization Call
 */
Cypress.Commands.add('c_authorizeCall', () => {
  try {
    const oAuthNewToken = Cypress.env('oAuthToken')
    cy.task('authorizeCallTask', oAuthNewToken)
  } catch (e) {
    console.error('An error occurred during the account creation process:', e)
  }
})

/**
 * Method to perform Balance Call
 */
Cypress.Commands.add('c_getBalance', () => {
  try {
    cy.task('checkBalanceTask').then((response) => {
      const balance = response
      Cypress.env('actualAmount', balance)
    })
  } catch (e) {
    console.error('An error occurred during the account creation process:', e)
  }
})

/**
 * Method to Register a New Application ID
 */
Cypress.Commands.add('c_registerNewApplicationID', () => {
  cy.task('registerNewAppIDTask').then((response) => {
    const appId = response
    cy.log('The Newly Generated App Id is: ', appId)
    Cypress.env('updatedAppId', appId)
  })
})

/**
 * Method to Logout from Application.
 * This will click on account dropdown and click on logout link
 */
Cypress.Commands.add('c_logout', () => {
  cy.get('#dt_core_header_acc-info-container').click()
  cy.findByText('Log out').should('be.visible')
  cy.get('[data-testid="acc-switcher"]').within(() => {
    cy.contains('Log out').click()
  })
})
Cypress.Commands.add('c_walletLogout', () => {
  cy.visit('/account/personal-details')
  cy.findByText('Log out').should('exist')
  cy.findByText('Log out').click()
})

/*
  Usage cy.c_createRealAccount('co', 'EUR') or you may not pass in anything to go with default.
  Currently works for CR countries as well as DIEL - non-EU account.
*/
Cypress.Commands.add(
  'c_createRealAccount',
  (country_code = 'id', currency = 'USD') => {
    cy.c_visitResponsive('/')
    // Call Verify Email and then set the Verification code in env
    try {
      cy.task('wsConnect')
      cy.task('verifyEmailTask').then((accountEmail) => {
        cy.c_emailVerificationV2('account_opening_new.html', accountEmail)
        cy.task('createRealAccountTask', {
          country_code: country_code,
          currency: currency,
        }).then(() => {
          // Updating Cypress environment variables with the new email
          const currentCredentials = Cypress.env('credentials')
          currentCredentials.test.masterUser.ID = accountEmail
          Cypress.env('credentials', currentCredentials)
          //Reset oAuthUrl otherwise it will use the previous URL
          Cypress.env('oAuthUrl', '<empty>')
        })
      })
    } catch (e) {
      console.error('An error occurred during the account creation process:', e)
    } finally {
      cy.task('wsDisconnect')
    }
  }
)

Cypress.Commands.add(
  'c_createDemoAccount',
  (country_code = 'id', currency = 'USD') => {
    cy.c_visitResponsive('/')
    // Call Verify Email and then set the Verification code in env
    try {
      cy.task('wsConnect')
      cy.task('verifyEmailTask').then((accountEmail) => {
        cy.c_emailVerificationV2('account_opening_new.html', accountEmail)
        cy.task('createVirtualAccountTask', {
          country_code: country_code,
          currency: currency,
        }).then(() => {
          // Updating Cypress environment variables with the new email
          const currentCredentials = Cypress.env('credentials')
          currentCredentials.test.masterUser.ID = accountEmail
          Cypress.env('credentials', currentCredentials)
          //Reset oAuthUrl otherwise it will use the previous URL
          Cypress.env('oAuthUrl', '<empty>')
        })
      })
    } catch (e) {
      console.error('An error occurred during the account creation process:', e)
    } finally {
      cy.task('wsDisconnect')
    }
  }
)

Cypress.Commands.add('c_closeModal', () => {
  cy.log('Closing the modal')
  cy.get('.dc-modal').within(() => {
    cy.get('.currency-selection-modal__header .close-icon').click()
  })
})

Cypress.Commands.add('c_waitUntilElementIsFound', (options = {}) => {
  const {
    cyLocator,
    locator,
    retry = 0,
    maxRetries = 3,
    timeout = 500,
  } = options
  let found = false
  cy.c_loadingCheck()
  cy.c_closeNotificationHeader()
  if (locator) {
    cy.document().then((doc) => {
      const element = doc.querySelector(locator)
      recurse(element)
    })
  } else {
    cyLocator()
      .should((_) => {})
      .then(($el) => {
        recurse($el.length)
      })
  }

  const recurse = (el) => {
    if (el) {
      cy.log(`Element found in attempt number ${retry}!`)
      found = true
      return
    } else if (!el && retry < maxRetries && !found) {
      cy.log(`Retrying... Attempt number: ${retry + 1}`)
      cy.wait(timeout)
      cy.reload()
      cy.c_loadingCheck()
      cy.c_closeNotificationHeader()
      cy.c_waitUntilElementIsFound({ ...options, retry: retry + 1 })
    } else {
      throw new Error(`Element not found after ${maxRetries} attempt(s)!`)
    }
  }
})

Cypress.Commands.add('c_getCurrentExchangeRate', (fromCurrency, toCurrency) => {
  cy.request({
    url: `https://api.coinbase.com/v2/exchange-rates?currency=${fromCurrency}`,
  }).then((response) => {
    const responseBody = response.body
    expect(response.status).to.be.eq(200)
    expect(responseBody.data.currency).to.be.eql(fromCurrency)
    let exchangeRate = responseBody.data.rates[toCurrency]
    sessionStorage.setItem(
      `c_conversionRate${fromCurrency}To${toCurrency}`,
      exchangeRate
    )
  })
})

Cypress.Commands.add('c_closeNotificationHeader', () => {
  cy.document().then((doc) => {
    let notification = doc.querySelector('.notification__header')
    if (notification) {
      cy.log('Notification header appeared')
      cy.get('.notification__text-body')
        .invoke('text')
        .then((text) => {
          cy.log(text)
        })
      cy.findAllByRole('button', { name: 'Close' })
        .first()
        .should('be.visible')
        .click()
        .and('not.exist')
      notification = null
      cy.then(() => {
        cy.c_closeNotificationHeader()
      })
    } else {
      cy.log('Notification header did not appear')
    }
  })
})

Cypress.Commands.add('c_skipPasskeysV2', (options = {}) => {
  const { language = 'english', retryCount = 0, maxRetries = 3 } = options
  cy.fixture('common/common.json').then((langData) => {
    const lang = langData[language]
    cy.findByText(lang.passkeysModal.title)
      .should(() => {})
      .then(($el) => {
        if ($el.length) {
          cy.findByText(lang.passkeysModal.maybeLaterBtn).click()
          cy.log('Skipped Passkeys prompt !!!')
        } else if (retryCount < maxRetries) {
          cy.wait(300)
          cy.log(
            `Passkeys prompt did not appear, Retrying... Attempt ${retryCount + 1}`
          )
          cy.c_skipPasskeysV2({ ...options, retryCount: retryCount + 1 })
        }
      })
  })
})

Cypress.Commands.add(
  'c_clickToOpenInSamePage',
  { prevSubject: true },
  (locator) => {
    cy.wrap(locator).invoke('attr', 'target', '_self').click()
  }
)

Cypress.Commands.add(
  'c_uiLogin',
  (
    size = 'large',
    username = Cypress.env('loginEmailProd'),
    password = Cypress.env('loginPasswordProd')
  ) => {
    cy.c_visitResponsive('/', size)
    cy.findByRole('button', { name: 'Log in' }).click()
    cy.findByLabelText('Email').type(username)
    cy.findByLabelText('Password').type(password, { log: false })
    cy.findByRole('button', { name: 'Log in' }).click()
  }
)

Cypress.Commands.add('c_fakeLinkPopUpCheck', () => {
  cy.getCookie('website_status').then((cookie) => {
    if (cookie) cy.log('The website_status cookie value :' + cookie.value)
    else cy.log(`website_status cookie not found`)
    if (cookie?.value === expectedCookieValue) {
      cy.findByText('Beware of fake links.').should('exist', { timeout: 12000 })
      cy.findByRole('checkbox').check()
      cy.findByRole('button', { name: 'OK, got it' }).click()
      cy.findAllByText('Beware of fake links.').should('not.exist')
    } else {
      cy.log('The fake link pop up does not exist!')
    }
  })
})
