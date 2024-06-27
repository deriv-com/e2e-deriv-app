import { getOAuthUrl } from '../helper/loginUtility'

/**
 * Method to perform Authorization Call
 */
Cypress.Commands.add('c_authorizeCall', () => {
  try {
    const oAuthNewToken = Cypress.env('oAuthToken')
    cy.task('authorizeCallTask', oAuthNewToken).then((response) => {
      Cypress.env('actualEmail', response)
    })
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
 * Method to perform Price Proposal Call
 */
Cypress.Commands.add('c_getPriceProposal', (options = {}) => {
  try {
    const { apiCall = 'priceProposal' } = options
    cy.fixture('api/apiFixture.json').then((priceData) => {
      const price = priceData[apiCall]
      cy.task(
        'createPriceProposalTask',
        price.priceProposal.priceProposalCurrency,
        price.priceProposal.priceProposalAmount,
        price.priceProposal.priceProposalBarrier,
        price.priceProposal.priceProposalBasis,
        price.priceProposal.priceProposalContractType,
        price.priceProposal.priceProposalDuration,
        price.priceProposal.priceProposalDurationUnit,
        price.priceProposal.priceProposalSymbol
      ).then((response) => {
        Cypress.env('priceProposalResponse', response)
      })
    })
  } catch (e) {
    console.error('An error occurred while creating price proposal: ', e)
  }
})

/**
 * Method to perform Buy Contract Call
 */
Cypress.Commands.add('c_buyContract', (options = {}) => {
  try {
    const { apiCall = 'buyContract' } = options
    const priceProposalID = Cypress.env('priceProposalResponse')
    cy.fixture('api/apiFixture.json').then((buyData) => {
      const buy = buyData[apiCall]

      cy.task(
        'createBuyContractTask',
        priceProposalID,
        buy.buyContract.buyAmount
      ).then((response) => {
        Cypress.env('balanceAfterBuy', response)
      })
    })
  } catch (e) {
    console.error('An error occurred during buy contract process: ', e)
  }
})

/**
 * Method to perform Authorization and Create Application ID
 * by calling ApplicationRegister API call
 */
Cypress.Commands.add('c_createApplicationId', () => {
  try {
    cy.log('Registering Url...')

    cy.c_login_setToken() // We need Auth Token for running WS API calls.
    cy.task('wsConnect')
    cy.c_authorizeCall()

    cy.task('registerNewAppIDTask').then((response) => {
      const appId = response
      cy.log('The Newly Generated App Id is: ', appId)
      Cypress.env('updatedAppId', appId)

      cy.task('wsDisconnect')

      Cypress.config('baseUrl', Cypress.env('appRegisterUrl'))

      Cypress.env('configAppId', appId)
      Cypress.env('stdConfigAppId', appId)
      Cypress.prevAppId = appId
      Cypress.env('oAuthUrl', '<empty>') //This needs to be empty as we need to auto-auth the app after first login.

      cy.log(
        '...Url registered and baseUrl switched. AppId = ' +
          Cypress.env('updatedAppId')
      )
    })
  } catch (e) {
    console.error('An error occurred during the app registration process:', e)
  }
})

Cypress.Commands.add('c_login_setToken', () => {
  getOAuthUrl(
    (oAuthUrl) => {
      Cypress.env('oAuthUrl', oAuthUrl)

      const urlParams = new URLSearchParams(Cypress.env('oAuthUrl'))
      const token = urlParams.get('token1')
      cy.log('----------- token is : ------------ ', token)
      Cypress.env('oAuthToken', token) //Set token here
    },
    Cypress.env('credentials').test.masterUser.ID,
    Cypress.env('credentials').test.masterUser.PSWD
  )
})
