import '@testing-library/cypress/add-commands'

Cypress.Commands.add('c_checkRateChanged', (options = {}) => {
  const { retryCount = 1, maxRetries = 3, retryWaitTime = 1000 } = options

  cy.get('#modal_root, .modal-root', { timeout: 10000, log: false }).then(
    ($element) => {
      if ($element.children().length > 0) {
        cy.document({ log: false }).then((doc) => {
          const rateChangeError = doc.querySelector(
            '.rate-change-modal__button'
          )
          if (rateChangeError) {
            cy.get('.rate-change-modal__button').within(() => {
              cy.get('button[type="submit"]', { log: false }).click({
                log: false,
              })
            })
            cy.findByRole('button', { name: 'Confirm' })
              .should('exist')
              .and('be.enabled')
              .click()
            options.retryCount = 1
          }
        })
      } else if (retryCount < maxRetries) {
        cy.log(
          `No rate change modal found, retrying in ${retryWaitTime / 1000}s... Attempt number: ${retryCount}`
        )
        cy.wait(retryWaitTime, { log: false })
        cy.c_checkRateChanged({ ...options, retryCount: retryCount + 1 })
      } else {
        cy.log('Max retries reached without detecting a rate change error.')
      }
    }
  )
})

function navToMyCounterparties() {
  cy.findByText('My profile').click()
  cy.findByText('Available Deriv P2P balance').should('be.visible')
  cy.findByText('My counterparties').should('be.visible').click()
  cy.findByText('My counterparties').should('be.visible')
  cy.findByText(
    "When you block someone, you won't see their ads, and they can't see yours. Your ads will be hidden from their search results, too."
  ).should('be.visible')
}

function createAnOrder(advertNickname) {
  cy.findAllByText(advertNickname)
    .first()
    .parentsUntil('.buy-sell-row')
    .next()
    .find('button')
    .should('be.visible')
    .click()
  cy.findByText('Orders must be completed in').should('be.visible')
  cy.findByRole('button', { name: 'Confirm' })
    .should('exist')
    .and('be.enabled')
    .click()
  cy.c_checkRateChanged()
  cy.findByText(
    "Don't risk your funds with cash transactions. Use bank transfers or e-wallets instead."
  ).should('be.visible')
  cy.findByTestId('dt_mobile_full_page_return_icon').should('exist').click()
  cy.findByRole('button', { name: 'Buy' }).should('exist')
}

function blockProfile(advertNickname) {
  cy.findAllByText(advertNickname).first().should('be.visible').click()
  cy.findByText("Advertiser's page").should('exist')
  cy.findByText(advertNickname).should('be.visible')
  cy.findByTestId('dt_page_return').next().click()
  cy.get('.advertiser-page-dropdown-menu').should('be.visible').click()
  cy.findByText(`Block ${advertNickname}?`).should('be.visible')
  cy.findByRole('button', { name: 'Block' }).should('exist').click()
  cy.findByText(`You have blocked ${advertNickname}.`).should('be.visible')
  cy.findByTestId('dt_page_return_icon').click()
  cy.findByText('Deriv P2P').should('exist')
}

function blockedAdvertiserValidation(advertNickname) {
  navToMyCounterparties()
  cy.findByPlaceholderText('Search by nickname')
    .type(advertNickname)
    .should('have.value', advertNickname)
  cy.findByText(advertNickname)
    .parentsUntil('dc-table__cell')
    .next()
    .findByRole('button', { name: 'Unblock' })
    .should('be.visible')
  cy.findByTestId('dt_mobile_full_page_return_icon').should('exist').click()
  cy.findByText('Available Deriv P2P balance').should('be.visible')
  cy.findByText('Buy / Sell').click()
  cy.findByText(advertNickname).should('not.exist')
  cy.findByText('Orders').click()
  cy.get('.ReactVirtualized__Grid__innerScrollContainer')
    .children()
    .first()
    .click()
  cy.findByText(advertNickname).should('be.visible')
  cy.findByRole('button', { name: "I've paid" }).should('not.be.disabled')
  cy.findByTestId('dt_mobile_full_page_return_icon').should('exist').click()
}

function unblockProfile(advertNickname) {
  navToMyCounterparties()
  cy.findByPlaceholderText('Search by nickname')
    .type(advertNickname)
    .should('have.value', advertNickname)
  cy.findByText(advertNickname).should('be.visible').click()
  cy.findAllByText('verified').should('be.visible')
  cy.findByText(`You have blocked ${advertNickname}.`).should('be.visible')
  cy.findByRole('button', { name: 'Unblock' }).should('be.enabled').click()
  cy.findByText(
    `You will be able to see ${advertNickname}'s ads. They\'ll be able to place orders on your ads, too.`
  ).should('be.visible')
  cy.findByText(`Unblock ${advertNickname}?`).should('be.visible')
  cy.findByTestId('dt_modal_footer')
    .findByRole('button', { name: 'Unblock' })
    .should('be.enabled')
    .click()
  cy.findByText("Advertiser's page").should('exist')
  cy.findByTestId('dt_page_return_icon').click()
  cy.findByText('My counterparties').should('be.visible')
  cy.findByTestId('dt_mobile_full_page_return_icon').should('exist').click()
  cy.findByText('Available Deriv P2P balance').should('be.visible')
  cy.findByText('Buy / Sell').click()
  cy.findAllByText(advertNickname).should('be.visible')
}

function unblockedAdvertiserValidation(advertNickname) {
  cy.findByText('Orders').click()
  cy.get('.ReactVirtualized__Grid__innerScrollContainer')
    .children()
    .first()
    .click()
  cy.findByText(advertNickname).should('be.visible')
  cy.findByRole('button', { name: 'Cancel order' }).should('be.enabled').click()
  cy.findByText('Do you want to cancel this order?').should('be.visible')
  cy.findByText(
    'Please do not cancel if you have already made payment.'
  ).should('be.visible')
  cy.findByRole('button', { name: 'Cancel this order' })
    .should('be.enabled')
    .click()
  cy.findByText(advertNickname).should('be.visible')
  cy.findByText('Cancelled').should('be.visible')
  cy.findByTestId('dt_mobile_full_page_return_icon').should('exist').click()
  navToMyCounterparties()
  cy.findByPlaceholderText('Search by nickname')
    .type(advertNickname)
    .should('have.value', advertNickname)
  cy.findByText(advertNickname)
    .parentsUntil('dc-table__cell')
    .next()
    .findByRole('button', { name: 'Block' })
    .should('be.visible')
}

describe('QATEST-2871 - Block and unblock user from advertisers profile page', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.clearAllSessionStorage()
    cy.clearAllCookies()
    cy.c_login({ user: 'p2pStandardAccountWithoutAds' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('Should be able to block and unblock the advertiser from profile page in responsive mode.', () => {
    cy.c_navigateToDerivP2P()
    cy.c_closeSafetyInstructions()
    cy.findByText('Deriv P2P').should('exist')
    cy.c_closeNotificationHeader()
    cy.get('.buy-sell-row__advertiser-name--text')
      .first()
      .invoke('text')
      .then((clientNickname) => {
        const advertNickname = clientNickname.trim()
        sessionStorage.setItem('c_clientNickName', advertNickname)
      })
    cy.then(() => {
      cy.log(sessionStorage.getItem('c_clientNickName'))
      createAnOrder(sessionStorage.getItem('c_clientNickName'))
      blockProfile(sessionStorage.getItem('c_clientNickName'))
      blockedAdvertiserValidation(sessionStorage.getItem('c_clientNickName'))
      unblockProfile(sessionStorage.getItem('c_clientNickName'))
      unblockedAdvertiserValidation(sessionStorage.getItem('c_clientNickName'))
    })
  })
})
