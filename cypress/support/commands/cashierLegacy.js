import { calculateTransferFee } from '../helper/utility'
import { derivApp } from '../locators'
const transferScreen = derivApp.cashierPage.transferScreen

Cypress.Commands.add('c_TransferBetweenAccounts', (options = {}) => {
  const {
    fromAccount = '',
    toAccount = '',
    withExtraVerifications = false,
    transferAmount = 10,
    size = 'large',
  } = options
  const fromAccountBalance = {
    withCurrency: sessionStorage.getItem(`c_balance${fromAccount.code}`),
    withoutCurrency: parseFloat(
      sessionStorage
        .getItem(`c_balance${fromAccount.code}`)
        .replace(/[^\d.]/g, '')
    ),
  }
  const toAccountBalance = {
    withCurrency: sessionStorage.getItem(`c_balance${toAccount.code}`),
    withoutCurrency: parseFloat(
      sessionStorage
        .getItem(`c_balance${toAccount.code}`)
        .replace(/[^\d.]/g, '')
    ),
  }
  transferScreen.sharedLocators.transferForm().within(() => {
    if (withExtraVerifications == true) {
      transferScreen.sharedLocators
        .transferFromField()
        .should('contain.text', fromAccount.name)
      transferScreen.sharedLocators
        .remainingTransferText()
        .should('be.visible')
        .then(($remainingTransfer) => {
          cy.log($remainingTransfer.text())
          sessionStorage.setItem(
            'c_remainingTransfers',
            $remainingTransfer.text().match(/(\d+)/)[0]
          )
        })
    }
    transferScreen.sharedLocators.depositButton().should('be.enabled')
    transferScreen.sharedLocators.transferButton().should('be.disabled')
    transferScreen.sharedLocators.transferFromField().click()
    transferScreen.sharedLocators
      .transferFromDropdown()
      .should('be.visible')
      .within(() => {
        cy.findByText(fromAccount.name).click({ force: true })
      })
    transferScreen.sharedLocators.transferToField().click()
    transferScreen.sharedLocators
      .transferToDropdown()
      .should('be.visible')
      .within(() => {
        cy.findByText(toAccount.name).click({ force: true })
      })
    if (withExtraVerifications == true) {
      transferScreen.sharedLocators.fromAmountField().type(1)
      transferScreen.sharedLocators
        .toAmountField()
        .should('not.have.value', '')
        .then((toAmountElement) => {
          expect(parseFloat(toAmountElement.val())).to.be.closeTo(
            parseFloat(
              sessionStorage.getItem(
                `c_conversionRate${fromAccount.code}To${toAccount.code}`
              )
            ),
            toAccount.accurateDelta
          )
        })
      cy.c_verifypercentageSelectorSection(fromAccountBalance)
      cy.c_verifyConvertorSection(fromAccountBalance, {
        fromAccount,
        toAccount,
      })
    }
    cy.then(() => {
      transferScreen.sharedLocators
        .fromAmountField()
        .clear()
        .type(transferAmount)
      console.log(
        'Current Exchange Rate: ',
        sessionStorage.getItem(
          `c_conversionRate${fromAccount.code}To${toAccount.code}`
        )
      )
      transferScreen.sharedLocators.fromAmountField().then(($fromAmount) => {
        let balanceFromAccounAfterTransfer =
          fromAccountBalance.withoutCurrency - parseFloat($fromAmount.val())
        cy.log(
          'Expected balance in From account after transfer',
          balanceFromAccounAfterTransfer
        )
        sessionStorage.setItem(
          'c_expectedFromAccountBalance',
          balanceFromAccounAfterTransfer
        )
      })
      transferScreen.sharedLocators.toAmountField().then(($toAmount) => {
        expect(parseFloat($toAmount.val())).to.be.closeTo(
          10 *
            parseFloat(
              sessionStorage.getItem(`c_conversionRateUSDTo${toAccount.code}`)
            ),
          toAccount.delta
        )
        let balanceToAccounAfterTransfer =
          toAccountBalance.withoutCurrency +
          (parseFloat($toAmount.val()) -
            calculateTransferFee(transferAmount) *
              parseFloat(
                sessionStorage.getItem(
                  `c_conversionRate${fromAccount.code}To${toAccount.code}`
                )
              ))
        cy.log(
          'Expected balance in ToAccount after transfer',
          balanceToAccounAfterTransfer
        )
        sessionStorage.setItem(
          'c_expectedToAccountBalance',
          balanceToAccounAfterTransfer
        )

        transferScreen.sharedLocators.percentageSelectorText(
          Math.round((10 / fromAccountBalance.withoutCurrency) * 100),
          fromAccountBalance.withCurrency
        )
      })
    })
    transferScreen.sharedLocators.transferButton().should('be.enabled').click()
  })
  if (size == 'small') {
    cy.c_verifyTransferDetails(transferAmount, fromAccount.code, toAccount.code)
  }
})

Cypress.Commands.add(
  'c_verifypercentageSelectorSection',
  (fromAccountBalance) => {
    transferScreen.sharedLocators
      .percentageSelectorSection()
      .should('be.visible')
      .within(() => {
        transferScreen.sharedLocators.percentageSelector().should('be.visible')
        transferScreen.sharedLocators.percentageSelectorText(
          '0',
          fromAccountBalance.withCurrency
        )
      })

    const percentages = [25, 50, 75, 100]

    percentages.forEach((percentage) => {
      cy.log(`Verifying for ${percentage}%`)
      transferScreen.sharedLocators
        .percentageSelector(percentage)
        .click()
        .should(
          'have.attr',
          'style',
          'background-color: var(--status-success);'
        )
      percentages
        .filter((per) => per <= percentage)
        .forEach((per) => {
          transferScreen.sharedLocators
            .percentageSelector(per)
            .should(
              'have.attr',
              'style',
              'background-color: var(--status-success);'
            )
        })
      percentages
        .filter((per) => per > percentage)
        .forEach((per) => {
          transferScreen.sharedLocators
            .percentageSelector(per)
            .should(
              'have.attr',
              'style',
              'background-color: var(--general-section-1);'
            )
        })
      transferScreen.sharedLocators
        .fromAmountField()
        .should(
          'contain.value',
          (fromAccountBalance.withoutCurrency * (percentage / 100)).toFixed(2)
        )
      transferScreen.sharedLocators.percentageSelectorText(
        percentage,
        fromAccountBalance.withCurrency
      )
    })
  }
)

Cypress.Commands.add(
  'c_verifyConvertorSection',
  (fromAccountBalance, options = {}) => {
    const { fromAccount = '', toAccount = '' } = options
    const randomFromAmount = Math.floor(Math.random() * (5000 + 1))
    const randomToAmount = (Math.random() * 0.0001).toFixed(8)
    transferScreen.sharedLocators
      .fromAmountField()
      .clear()
      .type(randomFromAmount)
    console.log(
      sessionStorage.getItem(
        `c_conversionRate${fromAccount.code}To${toAccount.code}`
      )
    )
    cy.then(() => {
      transferScreen.sharedLocators.toAmountField().then(($toAmount) => {
        expect(parseFloat($toAmount.val())).to.be.closeTo(
          randomFromAmount *
            parseFloat(
              sessionStorage.getItem(`c_conversionRateUSDTo${toAccount.code}`)
            ),
          toAccount.delta
        )
        transferScreen.sharedLocators.percentageSelectorText(
          Math.round(
            (randomFromAmount / fromAccountBalance.withoutCurrency) * 100
          ),
          fromAccountBalance.withCurrency
        )
      })
    })
    transferScreen.sharedLocators.toAmountField().clear().type(randomToAmount)
    cy.then(() => {
      transferScreen.sharedLocators.fromAmountField().then(($fromAmount) => {
        expect(parseFloat($fromAmount.val())).to.be.closeTo(
          randomToAmount /
            parseFloat(
              sessionStorage.getItem(`c_conversionRateUSDTo${toAccount.code}`)
            ).toFixed(8),
          fromAccount.delta
        )
        transferScreen.sharedLocators.percentageSelectorText(
          Math.round(
            (parseFloat($fromAmount.val()) /
              fromAccountBalance.withoutCurrency) *
              100
          ),
          fromAccountBalance.withCurrency
        )
      })
    })
    transferScreen.sharedLocators.fromAmountField().clear()
    transferScreen.sharedLocators
      .fromAmountField()
      .parent()
      .next()
      .within(() => {
        transferScreen.sharedLocators.fieldRequiredError().should('be.visible')
      })
    transferScreen.sharedLocators.fromAmountField().type('test Validation')
    transferScreen.sharedLocators
      .fromAmountField()
      .parent()
      .next()
      .within(() => {
        transferScreen.sharedLocators.validNumberError().should('be.visible')
      })
    transferScreen.sharedLocators.fromAmountField().clear().type('5001')
    transferScreen.sharedLocators
      .fromAmountField()
      .parent()
      .next()
      .within(() => {
        transferScreen.sharedLocators.rangeError().should('be.visible')
      })
    transferScreen.sharedLocators.toAmountField().type('test Validation')
    transferScreen.sharedLocators
      .toAmountField()
      .parent()
      .next()
      .within(() => {
        transferScreen.sharedLocators.validNumberError().should('be.visible')
      })
    transferScreen.sharedLocators.toAmountField().clear().type('999999999')
    transferScreen.sharedLocators
      .fromAmountField()
      .parent()
      .next()
      .within(() => {
        transferScreen.sharedLocators.rangeError().should('be.visible')
      })
  }
)

Cypress.Commands.add(
  'c_verifyTransferDetails',
  (transferAmount, fromCurrency, toCurrency) => {
    cy.findByText('Transfer').should('be.visible')
    cy.findByText('Your funds have been transferred').should('be.visible')
    cy.findByText(`${transferAmount.toFixed(2)} ${fromCurrency}`)
    cy.get('.crypto-transfer-from').within(() => {
      cy.findByText(fromCurrency).should('be.visible')
    })
    cy.get('.crypto-transfer-to').within(() => {
      cy.findByText(toCurrency).should('be.visible')
    })
    cy.findByRole('button', { name: 'Make a new transfer' }).click()
  }
)
