import '@testing-library/cypress/add-commands'
import { derivApp } from '../../../support/locators'

const derivAppProdUrl = new RegExp(
  `${Cypress._.escapeRegExp(Cypress.env('prodURL'))}\\?chart_type=[a-z]+\\&interval=[0-9]+[a-z]\\&symbol=[0-9a-zA-Z]+\\&trade_type=[a-z]+`
)
const derivAppStagingUrl = new RegExp(
  `${Cypress._.escapeRegExp(Cypress.env('stagingUrl'))}\\?chart_type=[a-z]+\\&interval=[0-9]+[a-z]\\&symbol=[0-9a-zA-Z]+\\&trade_type=[a-z]+`
)
const bBotStagingUrl = Cypress.env('binaryBotUrl').staging
const bBotProdUrl = Cypress.env('binaryBotUrl').prod
const smartTraderStagingUrl = Cypress.env('smartTraderUrl').staging
const smartTraderProdUrl = Cypress.env('smartTraderUrl').prod
const dBotProdUrl = `${Cypress.env('prodURL')}bot`
const dBotStagingUrl = `${Cypress.env('stagingUrl')}bot`
const derivGoProdUrl = `${Cypress.env('derivComProdURL')}deriv-go/`
const size = ['small', 'desktop']

describe('QATEST-5948: Verify platforms navigations on Options and Multipliers', () => {
  size.forEach((size) => {
    it(`Should navigate to correct platform on clicking Open button on ${size == 'small' ? 'mobile' : 'desktop'} and should remain logged in`, () => {
      const isMobile = size == 'small' ? true : false
      cy.c_uiLogin(size)
      //Wait for page to completely load
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')
      if (isMobile) cy.c_skipPasskeysV2()

      //Open Dtrader
      cy.findByTestId('dt_trading-app-card_real_deriv-trader')
        .findByRole('button', { name: 'Open' })
        .click({ force: true })
      cy.get('flt-glass-pane', { timeout: 15000 }).should('be.visible')
      if (Cypress.config().baseUrl.includes('staging'))
        cy.url().should('match', derivAppStagingUrl)
      else cy.url().should('match', derivAppProdUrl)
      cy.findByTestId('dt_acc_info').should('exist')
      if (!isMobile)
        cy.findByRole('button', { name: 'Deposit' }).should('be.visible')

      cy.go('back')
      //Wait for page to completely load
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')

      //Open DBot
      cy.findByTestId('dt_trading-app-card_real_deriv-bot')
        .findByRole('button', { name: 'Open' })
        .click({ force: true })
      if (isMobile) {
        cy.findAllByText('Welcome to Deriv Bot!')
          .should(() => {})
          .then(($el) => {
            if ($el.length) cy.findByTestId('close-icon').click()
          })
      }
      cy.findByRole('button', { name: 'Skip' }).click({ force: true })
      cy.c_closeNotificationHeader()
      cy.findByText(
        'Import a bot from your computer or Google Drive, build it from scratch, or start with a quick strategy.',
        { timeout: 15000 }
      ).should('be.visible')
      if (Cypress.config().baseUrl.includes('staging'))
        cy.url().should('eql', dBotStagingUrl)
      else cy.url().should('eql', dBotProdUrl)
      cy.findByTestId('dt_acc_info').should('exist')
      if (!isMobile)
        cy.findByRole('button', { name: 'Deposit' }).should('be.visible')

      cy.go('back')
      //Wait for page to completely load
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')

      //Open SmartTrader
      cy.findByTestId('dt_trading-app-card_real_smarttrader')
        .findByRole('button', { name: 'Open' })
        .click({ force: true })
      cy.findByRole('heading', { name: 'Rise' }, { timeout: 15000 }).should(
        'be.visible'
      )
      cy.findByRole('heading', { name: 'Fall' }, { timeout: 15000 }).should(
        'be.visible'
      )
      if (!isMobile)
        cy.findByRole('link', { name: 'Chart' }, { timeout: 15000 }).should(
          'be.visible'
        )
      if (Cypress.config().baseUrl.includes('staging'))
        cy.url().should('include', smartTraderStagingUrl)
      else cy.url().should('include', smartTraderProdUrl)
      derivApp.tradersHubPage.sharedLocators
        .legacyAccountInfo()
        .should('be.visible')

      cy.go('back')
      //Wait for page to completely load
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')

      //Open BinaryBot
      cy.findByTestId('dt_trading-app-card_real_binary-bot')
        .findByRole('button', { name: 'Open' })
        .click({ force: true })
      //Wait for blockly to load
      cy.get('.blocklyPathDark').should('be.visible')
      if (Cypress.config().baseUrl.includes('staging'))
        cy.url().should('eq', bBotStagingUrl)
      else cy.url().should('eq', bBotProdUrl)
      derivApp.tradersHubPage.sharedLocators
        .legacyAccountInfo()
        .should('be.visible')

      cy.go('back')
      //Wait for page to completely load
      cy.findAllByTestId('dt_balance_text_container').should('have.length', '2')

      //Open DerivGo
      cy.findByTestId('dt_trading-app-card_real_deriv-go')
        .findByRole('button', { name: 'Open' })
        .parent()
        .c_clickToOpenInSamePage()
      cy.findByText('A trading platform for on-the-go traders').should(
        'be.visible'
      )
      cy.url().should('eql', derivGoProdUrl)
    })
  })
})
