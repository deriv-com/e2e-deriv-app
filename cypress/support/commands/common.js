const { getLoginToken } = require('./../helper/loginUtility')
const { getOAuthUrl } = require('./../helper/loginUtility')

Cypress.prevAppId = 0

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
    cy.findByRole('button', { name: 'whatsapp icon' }).should('be.visible', {
      timeout: 30000,
    }) //For the home page, this seems to be the best indicator that a page has fully loaded. It may change in the future.
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
  cy.document().then((doc) => {
    const launchModal = doc.querySelector('[data-test-id="launch-modal"]')
    if (launchModal) {
      cy.findByRole('button', { name: 'Ok' }).click()
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

Cypress.Commands.add('c_mt5login', () => {
  cy.c_visitResponsive(Cypress.env('mt5BaseUrl') + '/terminal', 'large')
  cy.findByRole('button', { name: 'Accept' }).click()
  cy.findByPlaceholderText('Enter Login').click()
  cy.findByPlaceholderText('Enter Login').type(Cypress.env('mt5Login'))
  cy.findByPlaceholderText('Enter Password').click()
  cy.findByPlaceholderText('Enter Password').type(Cypress.env('mt5Password'))
  cy.findByRole('button', { name: 'Connect to account' }).click()
})

Cypress.Commands.add('c_emailVerification', (verification_code, base_url) => {
  cy.visit(
    `https://${Cypress.env('qaBoxLoginEmail')}:${Cypress.env(
      'qaBoxLoginPassword'
    )}@${base_url}`
  )
  cy.origin(
    `https://${Cypress.env('qaBoxLoginEmail')}:${Cypress.env(
      'qaBoxLoginPassword'
    )}@${base_url}`,
    () => {
      cy.scrollTo('bottom')
      cy.get('a').last().click()
      cy.get('a')
        .eq(1)
        .invoke('attr', 'href')
        .then((href) => {
          const code = href.match(/code=([A-Za-z0-9]{8})/)
          if (code) {
            verification_code = code[1]
            Cypress.env('walletsWithdrawalCode', verification_code)
            cy.log(verification_code)
          } else {
            cy.log('Unable to find code in the URL')
          }
        })
    }
  )
})
Cypress.Commands.add(
  'c_emailVerificationMT5',
  (verification_code, base_url) => {
    cy.visit(
      `https://${Cypress.env('qaBoxLoginEmail')}:${Cypress.env(
        'qaBoxLoginPassword'
      )}@${base_url}`
    )
    cy.origin(
      `https://${Cypress.env('qaBoxLoginEmail')}:${Cypress.env(
        'qaBoxLoginPassword'
      )}@${base_url}`,
      () => {
        cy.scrollTo('bottom')
        const date = new Date()
        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()
        let currentDate = `${year}${month}${day}`
        const emailTitlePrefix = `${currentDate}-New DMT5 password request`
        cy.contains('a', (text, element) => {
          // Check if the text contains the emailTitlePrefix
          return element.textContent.includes(emailTitlePrefix)
        }).click()
        cy.get('a')
          .eq(1)
          .invoke('attr', 'href')
          .then((href) => {
            Cypress.env('verificationdUrl', href)
            const code = href.match(/code=([A-Za-z0-9]{8})/)
            if (code) {
              verification_code = code[1]
              Cypress.env('walletsWithdrawalCode', verification_code)
              cy.log(verification_code)
            } else {
              cy.log('Unable to find code in the URL')
            }
          })
      }
    )
  }
)
//To be added on hotspots as an edge case only when constantly hitting rate limits
Cypress.Commands.add('c_rateLimit', () => {
  cy.get('#modal_root, .modal-root', { timeout: 10000 }).then(($element) => {
    if ($element.children().length > 0) {
      cy.contains('Refresh').then(($element) => {
        if (
          $element.length &&
          cy.contains('You have reached your rate limit')
        ) {
          cy.wrap($element).click()
          //Timeout if rate limited and should wait until content is re-rendered
          cy.wait(30000)
        }
        return
      })
    } else {
      return
    }
  })
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
        cy.contains('Transfer fees:')
        cy.findByRole('button', { name: 'Make a new transfer' }).click()
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
  'c_emailVerificationSignUp',
  (epoch, retryCount = 0, maxRetries = 3) => {
    const authUrl = `https://${Cypress.env('emailUser')}:${Cypress.env('emailPassword')}@${Cypress.env('event_email_url')}`
    cy.visit(authUrl)

    cy.origin(
      `https://${Cypress.env('event_email_url')}`,
      { args: { epoch } },
      ({ epoch }) => {
        cy.document().then((doc) => {
          const allSignupEmails = Array.from(
            doc.querySelectorAll('a[href*="account_opening_new"]')
          )
          if (allSignupEmails.length) {
            const signUpEmail = allSignupEmails.pop()
            cy.wrap(signUpEmail).click()
            cy.contains('p', `sanity${epoch}`).should('be.visible')
            cy.get('a')
              .last()
              .invoke('attr', 'href')
              .then((href) => {
                if (href) {
                  Cypress.env('signUpUrl', href)
                  cy.log('Sign up URL found')
                } else {
                  cy.log('Sign up URL not found')
                }
              })
          } else {
            cy.log('Sign up email not found')
          }
        })
      }
    )
    cy.then(() => {
      //Retry finding email after 1 second interval
      if (retryCount <= maxRetries && !Cypress.env('signUpUrl')) {
        cy.log(`Retrying... Attempt number: ${retryCount + 1}`)
        cy.wait(1000)
        cy.c_emailVerificationSignUp(epoch, ++retryCount)
      }
      if (retryCount > maxRetries) {
        throw new Error(
          `Signup URL extraction failed after ${maxRetries} attempts.`
        )
      }
    })
  }
)

Cypress.Commands.add('c_loadingCheck', () => {
  cy.findByTestId('dt_initial_loader').should('not.exist')
})
