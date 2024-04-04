const pixelmatch = require('pixelmatch')
const { PNG } = require('pngjs')
import { derivApp } from '../locators'

Cypress.Commands.add('c_selectSymbol', (symbolName) => {
  derivApp.dTraderPage.sharedLocators
    .symbolSelectBtn(20000)
    .should('be.visible')
  derivApp.dTraderPage.sharedLocators.symbolSelectBtn().click()
  derivApp.dTraderPage.desktopLocators.symbolExpandIcon().should('be.visible')
  cy.findByText('Synthetics').should('be.visible').click()
  cy.contains('div.sc-mcd__item__name', symbolName).click()
})

Cypress.Commands.add('c_selectTradeType', (category, tradeType) => {
  cy.findByTestId('dt_contract_dropdown').click()
  cy.findByText(category).click()
  cy.findByText(tradeType).should('be.visible').click()
})

Cypress.Commands.add('c_checkSymbolTickChange', (duration) => {
  let initialText
  cy.get('div.cq-animated-price.cq-current-price.cq-down')
    .invoke('text')
    .then((text) => {
      initialText = text
    })
  cy.wait(duration)
  cy.get('div.cq-animated-price.cq-current-price.cq-down')
    .invoke('text')
    .then((text) => {
      expect(text).to.not.eq(initialText)
    })
})

//TODO: Remove it. No need for a command for a single action
Cypress.Commands.add('c_selectStakeTab', () => {
  cy.findByRole('button', { name: 'Stake' }).click()
})

//TODO: Remove it. No need for a command for a single action
Cypress.Commands.add('c_selectPayoutTab', () => {
  cy.findByRole('button', { name: 'Payout' }).click()
})

Cypress.Commands.add('c_selectTickDuration', (tickDuration) => {
  cy.get(`[data-testid="tick_step_${tickDuration}"]`).click({ force: true }) // adding force true due to scss in locator
})

Cypress.Commands.add('c_validateDurationDigits', (tradetype) => {
  if (tradetype == 'Matches/Differs' || 'Even/Odd' || 'Over/Under') {
    cy.contains('span.dc-text.dc-dropdown__display-text', 'Ticks').should(
      'be.visible'
    )
    cy.findByRole('button', { name: 'Ticks' }).should('not.exist')
    cy.findByRole('button', { name: 'Minutes' }).should('not.exist')
    cy.findByRole('button', { name: 'End time' }).should('not.exist')
    cy.findByRole('button', { name: 'Duration' }).should('not.exist')
  }
})

Cypress.Commands.add(
  'c_matchStakePayoutValue',
  (tradeType, tradeTypeParentLocator) => {
    let stakeValueUp
    let payoutValueUp
    cy.c_selectStakeTab()
    cy.get(tradeTypeParentLocator).contains(
      '.trade-container__price-info-basis',
      'Payout'
    )

    cy.get(tradeTypeParentLocator)
      .find(
        '.trade-container__price-info-value span.trade-container__price-info-currency'
      )
      .invoke('text')
      .then((textValue) => {
        stakeValueUp = textValue.trim().split(' ')[0]
        cy.c_selectPayoutTab()
        cy.get(tradeTypeParentLocator).contains(
          '.trade-container__price-info-basis',
          'Stake'
        )

        cy.get(tradeTypeParentLocator)
          .find(
            '.trade-container__price-info-value span.trade-container__price-info-currency'
          )
          .invoke('text')
          .then((textValue) => {
            payoutValueUp = textValue.trim().split(' ')[0]
            expect(stakeValueUp).to.not.equal(payoutValueUp)
          })
      })
  }
)

Cypress.Commands.add('c_checkTradeTablePage', (buyReference) => {
  cy.findByRole('link', { name: 'Trade table' }).click()
  cy.findByText('Type').should('be.visible')
  cy.findByText('Ref. ID').should('be.visible')
  cy.findByText('Currency').should('be.visible')
  cy.findByText('Buy time').should('be.visible')
  cy.findByText('Buy price').should('be.visible')
  cy.findByText('Sell time').should('be.visible')
  cy.findByText('Sell price').should('be.visible')
  cy.findByText('Profit / Loss').should('be.visible')
  cy.contains(buyReference).should('be.visible')
})

Cypress.Commands.add('c_checkStatementPage', (buyReference, sellReference) => {
  cy.findByRole('link', { name: 'Statement' }).click()
  cy.findByText('Type').should('be.visible')
  cy.findByText('Ref. ID').should('be.visible')
  cy.findByText('Currency').should('be.visible')
  cy.findByText('Transaction time').should('be.visible')
  cy.findByText('Transaction', { exact: true }).should('be.visible')
  cy.findByText('Credit/Debit').should('be.visible')
  cy.contains(buyReference).should('be.visible')
  cy.contains(buyReference).should('be.visible')
})

Cypress.Commands.add(
  'c_checkContractDetailsPage',
  (tradeType, stakeAmount, tickDuration) => {
    cy.get('a.dc-result__caption-wrapper').click()
    cy.findByText('Contract details').should('be.visible')
    cy.contains('span[data-testid="dt_span"]', stakeAmount).should('be.visible') //verify stake amount
    if (tradeType == 'Matches/Differs' || 'Even/Odd' || 'Over/Under') {
      cy.get('#dt_duration_label')
        .contains('span', `${tickDuration} ticks`)
        .should('be.visible') //verify ticks entered
    }
    let buyReference, sellReference
    cy.get('#dt_id_label')
      .find('.contract-audit__value')
      .invoke('text')
      .then((text) => {
        const match = text.match(/(\d+) \(Buy\)/)
        if (match) {
          buyReference = match[1]
        }
      })
      .then(() => {
        cy.get('#dt_id_label')
          .find('.contract-audit__value2')
          .invoke('text')
          .then((text) => {
            const match = text.match(/(\d+) \(Sell\)/)
            if (match) {
              sellReference = match[1]
            }
          })
          .then(() => {
            cy.get('#dt_reports_tab > .dc-text').click()
            cy.c_checkTradeTablePage(buyReference)
            cy.c_checkStatementPage(buyReference, sellReference)
          })
      })
  }
)

Cypress.Commands.add(
  'c_compareElementScreenshots',
  (elementSelector, imageName1, imageName2, diffImageName) => {
    const timestamp = new Date().getTime()

    // To hide the timestamp in the footer
    cy.get('.dc-popover.server-time').invoke('css', 'visibility', 'hidden')

    cy.get(elementSelector).then(($el) => {
      const { top, left, width, height } = $el[0].getBoundingClientRect()

      cy.screenshot(`${imageName1}_${timestamp}`, {
        clip: { x: left, y: top, width, height },
      })

      cy.wait(2000) // 2 seconds wait time for new tick

      cy.screenshot(`${imageName2}_${timestamp}`, {
        clip: { x: left, y: top, width, height },
      })
    })

    cy.readFile(
      `./cypress/screenshots/chartStreaming.cy.js/${imageName1}_${timestamp}.png`,
      'base64'
    ).then((img1Data) => {
      cy.readFile(
        `./cypress/screenshots/chartStreaming.cy.js/${imageName2}_${timestamp}.png`,
        'base64'
      ).then((img2Data) => {
        const img1 = PNG.sync.read(Buffer.from(img1Data, 'base64'))
        const img2 = PNG.sync.read(Buffer.from(img2Data, 'base64'))
        const { width, height } = img1
        const diff = new PNG({ width, height })

        const mismatchedPixels = pixelmatch(
          img1.data,
          img2.data,
          diff.data,
          width,
          height,
          {
            threshold: 0.1, // this threshold is to adjust the sensitivity of the mismatched pixels
          }
        )

        cy.writeFile(
          `./cypress/screenshots/chartStreaming.cy.js/${diffImageName}_${timestamp}.png`,
          PNG.sync.write(diff),
          'base64'
        )

        expect(mismatchedPixels).to.be.greaterThan(0) // we expect the feed is updating, so the mismatchedPixels must be more than 0 to prove differences in both screenshots
      })
    })
  }
)
