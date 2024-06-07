const pixelmatch = require('pixelmatch')
const { PNG } = require('pngjs')
import { derivApp } from '../locators'

const dTraderSharedLocators = derivApp.dTraderPage.sharedLocators
const dTraderDesktopLocators = derivApp.dTraderPage.desktopLocators

Cypress.Commands.add('c_selectSymbol', (symbolName, deviceName) => {
  derivApp.dTraderPage.sharedLocators
    .symbolSelectBtn(20000)
    .should('be.visible')
  derivApp.dTraderPage.sharedLocators.symbolSelectBtn().click()
  if (deviceName == 'mobile') {
    derivApp.dTraderPage.mobileLocators.symbolExpandIcon().should('be.visible')
  } else if (deviceName == 'desktop') {
    derivApp.dTraderPage.desktopLocators.symbolExpandIcon().should('be.visible')
  } else {
    cy.log('Please check device entered')
  }
  cy.findByText('Synthetics').should('be.visible').click()
  cy.contains('div.sc-mcd__item__name', symbolName).click()
})

Cypress.Commands.add('c_selectTradeType', (category, tradeType) => {
  cy.findByTestId('dt_contract_dropdown').click()
  //cy.findByText(category).click()

  // Scroll to a specific element
  cy.findByText(tradeType).scrollIntoView()

  // Click on the element after scrolling
  cy.findByText(tradeType).should('be.visible').click()
})

Cypress.Commands.add('c_checkSymbolTickChange', (duration) => {
  let initialText
  dTraderDesktopLocators.chartCurrentPrice.invoke('text').then((text) => {
    initialText = text
  })
  cy.wait(duration)
  dTraderDesktopLocators.chartCurrentPrice.invoke('text').then((text) => {
    expect(text).to.not.eq(initialText)
  })
})

Cypress.Commands.add('c_selectTickDuration', (tickDuration) => {
  cy.findByTestId(`tick_step_${tickDuration}`).click({ force: true })
})

Cypress.Commands.add('c_validateDurationDigits', (tradetype) => {
  if (tradetype == 'Matches/Differs' || 'Even/Odd' || 'Over/Under') {
    cy.findByTestId('dt_dropdown_display').within(() => {
      cy.findByText('Ticks').should('be.visible')
    })
    cy.findByRole('button', { name: 'Ticks' }).should('not.exist')
    cy.findByRole('button', { name: 'Minutes' }).should('not.exist')
    cy.findByRole('button', { name: 'End time' }).should('not.exist')
    cy.findByRole('button', { name: 'Duration' }).should('not.exist')
  }
})
Cypress.Commands.add('c_validateDurationDigitsResponsive', (tradetype) => {
  if (tradetype == 'Matches/Differs' || 'Even/Odd' || 'Over/Under') {
    //cy.findByRole('button', { name: '5 ticks' }).click()
    cy.get('.mobile-widget__duration').click()
    //cy.get('.dc-tabs__list').click()
    cy.findByText('button', { name: 'Ticks' }).should('not.exist')
    cy.findByText('button', { name: 'Minutes' }).should('not.exist')
    cy.findByText('button', { name: 'End time' }).should('not.exist')
    cy.findByText('button', { name: 'Duration' }).should('not.exist')
    cy.findByTestId('dt_themed_scrollbars')
      .findAllByRole('button')
      .eq(0)
      .should('be.visible')
    cy.findByTestId('dt_themed_scrollbars')
      .findAllByRole('button')
      .eq(1)
      .should('be.visible')
    cy.findByRole('button', { name: 'OK' }).click()
  }
})

Cypress.Commands.add('c_matchStakePayoutValue', (tradeTypeParentLocator) => {
  let stakeValueUp
  let payoutValueUp
  cy.findByRole('button', { name: 'Stake' }).click()
  tradeTypeParentLocator().should('contain.text', 'Payout')

  tradeTypeParentLocator()
    .invoke('text')
    .then((textValue) => {
      payoutValueUp = textValue.trim().split(' ')[0].split('t')[1]
      cy.findByRole('button', { name: 'Payout' }).click()
      tradeTypeParentLocator().should('contain.text', 'Stake')

      tradeTypeParentLocator()
        .invoke('text')
        .then((textValue) => {
          stakeValueUp = textValue.trim().split(' ')[0].split('e')[1]
          expect(stakeValueUp).to.not.equal(payoutValueUp)
        })
    })
})

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
Cypress.Commands.add('c_checkTradeTablePageResponsive', (buyReference) => {
  cy.get('.dc-select-native__picker').select('Trade table')
  cy.get('.data-list__item').eq(0).should('be.visible')
  cy.contains(buyReference).should('be.visible')
})
Cypress.Commands.add(
  'c_checkStatementPageResponsive',
  (buyReference, sellReference) => {
    cy.get('.dc-select-native__picker').select('Statement')
    cy.get('.data-list__item').eq(0).should('be.visible')
    cy.contains(buyReference).should('be.visible')
    cy.contains(sellReference).should('be.visible')
  }
)

Cypress.Commands.add(
  'c_checkContractDetailsPage',
  (tradeType, stakeAmount, tickDuration) => {
    dTraderDesktopLocators.contractCard().click({ force: true })
    cy.findByText('Contract details').should('be.visible')
    cy.contains('span[data-testid="dt_span"]', stakeAmount).should('be.visible') //verify stake amount
    if (tradeType == 'Matches/Differs' || 'Even/Odd' || 'Over/Under') {
      cy.findByTestId('dt_duration_label').should(
        'contain.text',
        `${tickDuration} ticks`
      )
    }
    let buyReference, sellReference
    cy.findByTestId('dt_id_label')
      .get('.contract-audit__value')
      .invoke('text')
      .then((text) => {
        const match = text.match(/(\d+) \(Buy\)/)
        if (match) {
          buyReference = match[1]
        }
      })
      .then(() => {
        cy.findByTestId('dt_id_label')
          .get('.contract-audit__value2')
          .invoke('text')
          .then((text) => {
            const match = text.match(/(\d+) \(Sell\)/)
            if (match) {
              sellReference = match[1]
            }
          })
          .then(() => {
            cy.findAllByText('Reports').first().click()
            cy.c_checkTradeTablePage(buyReference)
            cy.c_checkStatementPage(buyReference, sellReference)
          })
      })
  }
)

Cypress.Commands.add('c_checkContractDetailsPageMobile', (stakeAmount) => {
  cy.findByRole('link', { class: 'data-list__item--wrapper' }).click()
  cy.findByText('Contract details').should('be.visible')
  cy.contains('span[data-testid="dt_span"]', stakeAmount).should('be.visible')
  cy.findByTestId('dt_handle_button').click()

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
          cy.findByTestId('dt_positions_toggle').click()
          cy.findByRole('link', { name: 'Go to Reports' }).click()
          cy.c_checkTradeTablePageResponsive(buyReference)
          cy.c_checkStatementPageResponsive(buyReference, sellReference)
        })
    })
})

const clearStakeField = () => {
  cy.findByRole('button', { name: '⌫' }).then(($button) => {
    if (!$button.is(':disabled')) {
      cy.wrap($button)
        .click()
        .then(() => {
          clearStakeField()
        })
    }
  })
}

Cypress.Commands.add('c_inputStakeAmountMobile', () => {
  const stakeAmount = '5'
  cy.findByTestId('dt_themed_scrollbars').findByText('Stake').click()
  clearStakeField()
  cy.findByTestId('dt_themed_scrollbars')
    .findByRole('button', { name: stakeAmount })
    .click()
  cy.findByRole('button', { name: 'OK' }).click()
})

Cypress.Commands.add('c_placeEvenorOddTradetype', (tradeType) => {
  if (tradeType == 'Even') {
    cy.get('button.btn-purchase.btn-purchase--1').click()
  } else if (tradeType == 'Odd') {
    cy.get('button.btn-purchase.btn-purchase--2').click()
  } else {
    cy.log('Please check trade type entered and locator')
  }
})

Cypress.Commands.add(
  'c_validateContractNotification',
  (symbol, stakeAmount) => {
    cy.contains('.swipeable-notification', stakeAmount).should('be.visible')
    cy.contains('.swipeable-notification', symbol).should('be.visible')
  }
)

Cypress.Commands.add(
  'c_checkRecentPositionIconAndOpenPosition',
  (stakeAmount) => {
    cy.findByTestId('dt_positions_toggle').click()
    cy.findByText('Even').should('be.visible')
    cy.findByRole('link', { name: 'Go to Reports' }).click()
    cy.findByText('Ref. ID').should('be.visible')
    cy.findByText('Currency').should('be.visible')
    cy.contains('.data-list', stakeAmount).should('be.visible')
    cy.contains('.data-list', 'Contract value').should('be.visible')
    cy.contains('.data-list', 'Potential payout').should('be.visible')
    cy.contains('.data-list', 'Total profit/loss').should('be.visible')
    cy.contains('.data-list', 'Resale not offered').should('be.visible')
  }
)

Cypress.Commands.add('c_checkDigitStatsChartsAndStakePayoutError', () => {
  cy.get('.digits--trade').should('be.visible')
  cy.get('.dc-swipeable__nav__item').eq(1).should('be.visible').click()
  cy.get('.chartContainer').should('be.visible')
  cy.get('.dc-swipeable__nav__item').eq(0).should('be.visible').click()
  cy.get('.digits--trade').should('be.visible')
  cy.get('.digits__toast-info').should('be.visible')

  cy.findByRole('button', { name: 'Stake' }).click()
  cy.findByTestId('dt_themed_scrollbars').findByText('Payout').click()
  cy.findByTestId('dt_themed_scrollbars').findByText('Stake').click()
  clearStakeField()
  cy.findByText('Should not be 0 or empty').should('be.visible')
  cy.findByTestId('dt_themed_scrollbars')
    .findByRole('button', { name: '0' })
    .click()
  cy.findByText('Should not be 0 or empty').should('be.visible')
  clearStakeField()
  cy.findByTestId('dt_themed_scrollbars')
    .findByRole('button', { name: '5' }) // Find and click the button with name "5"
    .click()

  for (let i = 0; i < 4; i++) {
    cy.findByTestId('dt_themed_scrollbars')
      .findByRole('button', { name: '0' })
      .click()
  }
  cy.findByRole('button', { name: 'OK' }).click()
  cy.get('.btn-purchase__error').should('be.visible')
  cy.findByRole('button', { name: 'Stake' }).click()
  cy.findByTestId('dt_themed_scrollbars').findByText('Payout').click()
  clearStakeField()
  cy.findByTestId('dt_themed_scrollbars')
    .findByRole('button', { name: '8' })
    .click()

  for (let i = 0; i < 4; i++) {
    cy.findByTestId('dt_themed_scrollbars')
      .findByRole('button', { name: '0' })
      .click()
  }
  cy.findByRole('button', { name: 'OK' }).click()
  cy.get('.btn-purchase__error').should('be.visible')
  cy.findByRole('button', { name: 'Payout' }).click()
})

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
