function verifyMobileHomePage() {
  cy.findByText("Trader's Hub").should('be.visible')
  cy.findByText('CFDs', { exact: true }).should('be.visible')
  cy.get('.wallets-card__details-bottom')
    .should('be.visible')
    .find('span')
    .first()
    .invoke('text')
    .should('include', 'USD  Wallet')
  cy.findByLabelText('deposit').should('be.visible')
  cy.findByLabelText('withdrawal').should('be.visible')
  cy.findByLabelText('account-transfer').should('be.visible')
  cy.findByRole('button', { name: 'Options' }).should('be.visible')
}
function clickProgressBarItem(i) {
  cy.get('.wallets-progress-bar-inactive')
    .eq(i)
    .scrollIntoView()
    .click({ force: true })
    .then(() => {
      cy.get('.wallets-card__details-bottom')
        .eq(i + 1)
        .find('span')
        .first()
        .invoke('text')
        .as('textContent')
    })
}
function getTotalNumberOfWallets(element1, element2) {
  return cy.get(element1).find(element2).its('length')
}

function fiatWalletcheck() {
  cy.findByTestId('dt_themed_scrollbars')
    .find('label span')
    .should('be.visible')
  cy.findAllByTestId('dt_wallets_textfield_box')
    .should('be.visible')
    .find('input')
    .should('have.value', 'USD Wallet')
  cy.findByText('CFDs', { exact: true }).should('be.visible')
  cy.findByLabelText('deposit').should('be.visible')
  cy.findByLabelText('withdrawal').should('be.visible')
  cy.findByLabelText('account-transfer').should('be.visible')
  cy.findAllByText('Options').eq(1).should('be.visible')
  // .then(() =>
  //   cy
  //     .findByTestId('dt_desktop_accounts_list')
  //     .findByText('SVG')
  //     .should('be.visible')
  // )
  cy.findByText('Add more Wallets').scrollIntoView().should('be.visible')
  cy.findAllByText('USD Wallet')
    .should('be.visible')
    .then(() => {
      cy.get('[class*="wallets-add-more__content"]')
        .contains('USD')
        .parent()
        .parent()
        .find('button', { timeout: 15000 })
        .then((button) => {
          expect(button).to.contain('Added')
        })
    })
}
function demoWalletCheck() {
  cy.log('it is demo wallet')
  cy.findByText('Standard', { timeout: 3000 }).should('exist')
  cy.findByLabelText('reset-balance').should('be.visible')
  cy.findByLabelText('account-transfer').should('be.visible')
  cy.findByRole('button', { name: 'Options' })
    .click({ force: true })
    .then(() => {
      cy.findByTestId('dt_tab_panels')
        .findAllByText('Options', { exact: true })
        .should('be.visible')
    })
}
function switchBetweenDemoandReal() {
  cy.findByTestId('dt_themed_scrollbars')
    .find('label span')
    .should('be.visible')
    .click()
}

describe('QATEST-157196 Demo and Real Wallet Switcher', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletloginEmail' })
  })
  it('Check demo and Real wallet swticher', () => {
    cy.c_visitResponsive('/', 'large')
    fiatWalletcheck() //User should always login to Real fiat wallet dashboard.
    //Clik on all availbale wallets in wallet swticher
    cy.findAllByTestId('dt_wallets_textfield_icon_right').click()
    getTotalNumberOfWallets('[role=listbox]', '[role=option]').then(
      (listItems) => {
        for (let i = 1; i < listItems; i++) {
          cy.get('.wallets-list-card-dropdown__item-content')
            .eq(i)
            .find('span')
            .first()
            .invoke('text')
            .then((text) => {
              let walletsTextValue = text.trim()
              cy.get('.wallets-list-card-dropdown__item-content', {
                timeout: 10000,
              })
                .should('be.visible')
                .eq(i)
                .click({ force: true })
                .then(() => {
                  return new Promise((resolve) => {
                    setTimeout(resolve, 1000)
                  })
                })
                .then(() => {
                  cy.get(
                    '.wallets-textfield__field.wallets-textfield__field--listcard'
                  ).should('have.value', walletsTextValue)
                  cy.log('the wallet text value is' + walletsTextValue)
                  cy.get('.wallets-balance__container', { timeout: 20000 })
                    .should('be.visible')
                    .find('span')
                    .invoke('text')
                    .should('contain', walletsTextValue.split(' ')[0])
                  cy.findByTestId('dt_desktop_accounts_list')
                    .findByRole('button', { name: 'Transfer' })
                    .should('be.visible')
                  cy.get('.wallets-dropdown').click({ force: true })
                })
            })
        }
      }
    )
    //Switch to Demo wallet
    switchBetweenDemoandReal()
    cy.findByText('USD Demo Wallet').should('be.visible')
    cy.findByLabelText('reset-balance').should('be.visible')
    cy.findAllByText('Options')
      .eq(1)
      .should('be.visible')
      .then(() =>
        cy
          .findByTestId('dt_desktop_accounts_list')
          .findByText('Demo')
          .should('be.visible')
      )
    cy.findByText('CFDs', { exact: true }).should('be.visible')
    cy.findByRole('button', { name: /Derived [\d.,]+ USD/ }).should(
      'be.visible'
    )
    //Navigate back to real  wallet to make sure user land on fiat wallet dashboard
    switchBetweenDemoandReal()
    fiatWalletcheck()
  })
  it('Responsive - Check demo and Real wallet switcher', () => {
    cy.c_visitResponsive('/', 'small')
    cy.c_WaitUntilPageIsLoaded()
    cy.c_skipPasskeysV2()
    //User should always login to Real fiat wallet dashboard.
    verifyMobileHomePage()
    getTotalNumberOfWallets(
      '.wallets-progress-bar',
      '.wallets-progress-bar-inactive'
    ).then((listbar) => {
      cy.log('the length of progress bar is ' + listbar)
      for (let i = 0; i < listbar; i++) {
        clickProgressBarItem(i)
        cy.get('@textContent').then((textContent) => {
          expect(textContent).to.include('Wallet')
          cy.findByRole('button', { name: 'CFDs' })
            .should('be.visible', { timeout: 15000 })
            .click()
          if (textContent == 'USD Demo Wallet') {
            demoWalletCheck()
          } else {
            cy.log('no demo wallet')
            cy.get('.wallets-cfd-list__cfd-empty-state').within(() => {
              cy.get('button').contains('Transfer').should('be.visible')
            })
          }
        })
      }
    })
  })
})
