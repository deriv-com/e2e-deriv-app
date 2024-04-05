import { parse } from 'path'
import { calculateTransferFee } from '../helper/utility'
import { derivApp } from '../locators'
const transferScreen = derivApp.cashierPage.transferScreen

Cypress.Commands.add('c_TransferBetweenAccounts', (options = {}) => {
  const {
    fromAccount = '',
    toAccount = '',
    usingAmount = '',
    usingPercentageSelector = '',
    withExtraVerifications = false,
  } = options
  const fromAccountBalance = {
    withCurrency: sessionStorage.getItem(`c_balance${fromAccount.code}`),
    withoutCurrency: parseFloat(
      sessionStorage
        .getItem(`c_balance${fromAccount.code}`)
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
      transferScreen.sharedLocators.fromAmmountField().type(1)
      transferScreen.sharedLocators
        .toAmmountField()
        .should('not.have.value', '')
        .then((toAmmountElement) => {
          sessionStorage.setItem(
            `c_conversionRate${fromAccount.code}To${toAccount.code}`,
            toAmmountElement.val()
          )
        })
      cy.c_verifypercentageSelectorSection(fromAccountBalance)
      cy.c_verifyConvertorSection(fromAccountBalance, {
        fromAccount,
        toAccount,
      })
    }
    transferScreen.sharedLocators.fromAmmountField().clear().type(10)
    console.log(
      sessionStorage.getItem(
        `c_conversionRate${fromAccount.code}To${toAccount.code}`
      )
    )
    cy.then(() => {
      transferScreen.sharedLocators.toAmmountField().then(($toAmount) => {
        expect(parseFloat($toAmount.val())).to.be.closeTo(
          10 *
            parseFloat(
              sessionStorage.getItem(`c_conversionRateUSDTo${toAccount.code}`)
            ),
          0.0001
        )
        let BalanceAfterTransferFeeDeducted = fromAccountBalance(
          calculateTransferFee(parseFloat($toAmount.val())) +
            parseFloat($toAmount.val)
        )

        transferScreen.sharedLocators.percentageSelectorText(
          Math.round((10 / fromAccountBalance.withoutCurrency) * 100),
          fromAccountBalance.withCurrency
        )
      })
    })
    transferScreen.sharedLocators.transferButton().should('be.enabled')
  })
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
        .fromAmmountField()
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
      .fromAmmountField()
      .clear()
      .type(randomFromAmount)
    console.log(
      sessionStorage.getItem(
        `c_conversionRate${fromAccount.code}To${toAccount.code}`
      )
    )
    cy.then(() => {
      transferScreen.sharedLocators.toAmmountField().then(($toAmount) => {
        expect(parseFloat($toAmount.val())).to.be.closeTo(
          randomFromAmount *
            parseFloat(
              sessionStorage.getItem(`c_conversionRateUSDTo${toAccount.code}`)
            ),
          0.0001
        )
        transferScreen.sharedLocators.percentageSelectorText(
          Math.round(
            (randomFromAmount / fromAccountBalance.withoutCurrency) * 100
          ),
          fromAccountBalance.withCurrency
        )
      })
    })
    transferScreen.sharedLocators.toAmmountField().clear().type(randomToAmount)
    cy.then(() => {
      transferScreen.sharedLocators.fromAmmountField().then(($fromAmount) => {
        expect(parseFloat($fromAmount.val())).to.be.closeTo(
          randomToAmount /
            parseFloat(
              sessionStorage.getItem(`c_conversionRateUSDTo${toAccount.code}`)
            ).toFixed(8),
          0.1
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
    transferScreen.sharedLocators.fromAmmountField().clear()
    transferScreen.sharedLocators
      .fromAmmountField()
      .parent()
      .next()
      .within(() => {
        transferScreen.sharedLocators.fieldRequiredError().should('be.visible')
      })
    transferScreen.sharedLocators.fromAmmountField().type('test Validation')
    transferScreen.sharedLocators
      .fromAmmountField()
      .parent()
      .next()
      .within(() => {
        transferScreen.sharedLocators.validNumberError().should('be.visible')
      })
    transferScreen.sharedLocators.fromAmmountField().clear().type('5001')
    transferScreen.sharedLocators
      .fromAmmountField()
      .parent()
      .next()
      .within(() => {
        transferScreen.sharedLocators.rangeError().should('be.visible')
      })
    transferScreen.sharedLocators.toAmmountField().type('test Validation')
    transferScreen.sharedLocators
      .toAmmountField()
      .parent()
      .next()
      .within(() => {
        transferScreen.sharedLocators.validNumberError().should('be.visible')
      })
    transferScreen.sharedLocators.toAmmountField().clear().type('999999999')
    transferScreen.sharedLocators
      .fromAmmountField()
      .parent()
      .next()
      .within(() => {
        transferScreen.sharedLocators.rangeError().should('be.visible')
      })
  }
)
