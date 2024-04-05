export const cashierPageLocators = {
  depositScreen: {
    mobileLocators: {},
    desktopLocators: {},
    sharedLocators: {},
  },
  withdrawalScreen: {
    mobileLocators: {},
    desktopLocators: {},
    sharedLocators: {},
  },
  transferScreen: {
    mobileLocators: {},
    desktopLocators: {},
    sharedLocators: {
      transferForm: () => cy.get('form[class="account-transfer-form"]'),
      transferFromField: () =>
        cy.contains('span[class="dc-dropdown__label"]', 'From').next(),
      transferFromDropdown: () =>
        cy
          .findByTestId('dt_account_transfer_form_drop_down_wrapper')
          .findByTestId('dt_themed_scrollbars'),
      transferToField: () =>
        cy.contains('span[class="dc-dropdown__label"]', 'To').next(),
      transferToDropdown: () =>
        cy
          .findByTestId('dt_account_transfer_form_drop_down_wrapper')
          .findByTestId('dt_themed_scrollbars'),
      transferButton: () => cy.findByRole('button', { name: 'Transfer' }),
      depositButton: () => cy.findByRole('button', { name: 'Deposit' }),
      percentageSelectorSection: () =>
        cy.get('.account-transfer-form__crypto--percentage-selector'),
      percentageSelector: (value) => {
        if (value == '25') {
          return cy.findByTestId('dt_percentage_selector_block_id_1')
        } else if (value == '50') {
          return cy.findByTestId('dt_percentage_selector_block_id_2')
        } else if (value == '75') {
          return cy.findByTestId('dt_percentage_selector_block_id_3')
        } else if (value == 'All' || value == '100') {
          return cy.findByTestId('dt_percentage_selector_block_id_4')
        } else {
          return cy.findByTestId('dt_percentage_selector_id')
        }
      },
      percentageSelectorText: (percentage, balance) =>
        cy.findByText(`${percentage}% of available balance (${balance})`),
      fromAmmountField: () => cy.findByTestId('dt_converter_from_amount_input'),
      toAmmountField: () => cy.findByTestId('dt_converter_to_amount_input'),
      remainingTransferText: (value) => {
        if (!value) {
          return cy.findByText(/^You have \d+ transfers remaining for today\.$/)
        } else {
          return cy.findByText(
            `You have ${value} transfers remaining for today.`
          )
        }
      },
      fieldRequiredError: () => cy.findByText('This field is required.'),
      validNumberError: () => cy.findByText('Should be a valid number.'),
      rangeError: () => cy.findByText('Should be between 1.00 and 5,000.00'),
    },
  },
  commonMobileLocators: {
    //commonMobileLocator1 : () => cy.findByTestId('abc'),
    //commonMobileLocator2 : () => cy.findByTestId('xyz'),
  },
  commonDesktopLocators: {
    //commonDesktopLocator1 : () => cy.findByTestId('abc'),
    //commonDesktopLocator2 : () => cy.findByTestId('xyz'),
  },
  commonSharedLocators: {
    //commonLocator1 : () => cy.findByTestId('abc'),
    //commonLocator2 : () => cy.findByTestId('xyz'),
  },
}
