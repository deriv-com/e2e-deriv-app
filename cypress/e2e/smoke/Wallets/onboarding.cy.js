import '@testing-library/cypress/add-commands'

const desktopSteps = [
  {
    backButtonExists: false,
    nextButtonName: 'Next',
    title: 'This is your Wallet',
    description: 'Manage your funds with Wallets.',
  },
  {
    backButtonExists: true,
    nextButtonName: 'Next',
    title: 'Select Demo or Real',
    description: 'Press the tab to switch between Demo or Real Wallets.',
  },
  {
    backButtonExists: true,
    nextButtonName: 'Next',
    title: 'Change your Wallet',
    description: 'Switch to a Wallet from the drop-down menu.',
  },
  {
    backButtonExists: true,
    nextButtonName: 'Next',
    title: 'Add more currencies',
    description: 'Want Wallets in other currencies too? Press Add.',
  },
  {
    backButtonExists: true,
    nextButtonName: 'Done',
    title: "Trader's Hub tour",
    description: 'Press here to repeat this tour.',
  },
]

const mobileSteps = [
  {
    backButtonExists: false,
    nextButtonName: 'Next',
    title: 'This is your Wallet',
    description: 'Manage your funds with Wallets.',
  },
  {
    backButtonExists: true,
    nextButtonName: 'Next',
    title: 'Switch between Wallets',
    description: 'Swipe left or right to switch between Wallets.',
  },
  {
    backButtonExists: true,
    nextButtonName: 'Next',
    title: 'Select your account type',
    description: 'Press the tab to switch between CFDs and Options accounts.',
  },
  {
    backButtonExists: true,
    nextButtonName: 'Next',
    title: 'Add more currencies',
    description: 'Want Wallets in other currencies too? Press Add.',
  },
  {
    backButtonExists: true,
    nextButtonName: 'Done',
    title: "Trader's Hub tour",
    description: 'Press here to repeat this tour.',
  },
]

const setupTest = () => {
  cy.findByTestId('dt_traders_hub_onboarding_icon').click()
  cy.contains('USD Wallet', { timeout: 10000 }).should('exist')
  cy.get('#react-joyride-portal').should('exist')
  cy.get('[data-test-id="spotlight"]').should('exist')
}

const checkStep = (
  backButtonShouldExist,
  nextButtonName,
  title,
  description
) => {
  cy.findByRole('alertdialog').should('exist')
  cy.findByText(title).should('exist')
  cy.findByText(description).should('exist')
  cy.findByRole('button', { name: 'Back' }).should(
    backButtonShouldExist ? 'exist' : 'not.exist'
  )
  cy.findByRole('button', { name: nextButtonName, timeout: 3000 })
    .should('exist')
    .click()
}

const allWalletAdded = () => {
  return cy
    .get('.wallets-add-more__carousel-wrapper')
    .find('button')
    .then((buttons) => {
      const buttonCount = buttons.filter(
        (index, button) => Cypress.$(button).text().trim() === 'Add'
      ).length
      return buttonCount === 0
    })
}

describe('QATEST-98504 - User Onboarding on Desktop for Fiat Wallets and QATEST-98504  Launch onboarding from different pages', () => {
  beforeEach(() => {
    cy.c_login({ user: 'walletloginEmail' })
  })

  it('User onboarding for desktop', () => {
    cy.c_visitResponsive('/', 'large')
    const walletAdded = allWalletAdded()
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    setupTest('large')
    desktopSteps.forEach((step, index) => {
      if (index === 3 && walletAdded) return
      checkStep(
        step.backButtonExists,
        step.nextButtonName,
        step.title,
        step.description
      )
    })
    cy.get('[data-test-id="spotlight"]').should('not.exist')
  })
  it('User onboarding from USD wallet cashier', () => {
    cy.c_visitResponsive('/', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    const walletAdded = allWalletAdded()
    cy.findByText('Deposit').click()
    cy.contains('Oops, something went wrong!').should('be.visible')
    setupTest('large')
    desktopSteps.forEach((step, index) => {
      if (index === 3 && walletAdded) return
      checkStep(
        step.backButtonExists,
        step.nextButtonName,
        step.title,
        step.description
      )
    })
    cy.get('[data-test-id="spotlight"]').should('not.exist')
  })
  it('User onboarding from USD wallet compare account', () => {
    cy.c_visitResponsive('/', 'large')
    const walletAdded = allWalletAdded()
    cy.findByText('Compare accounts').click()
    cy.contains('Compare CFDs accounts').should('be.visible')
    setupTest('large')
    desktopSteps.forEach((step, index) => {
      if (index === 3 && walletAdded) return
      checkStep(
        step.backButtonExists,
        step.nextButtonName,
        step.title,
        step.description
      )
    })
    cy.get('[data-test-id="spotlight"]').should('not.exist')
  })
  it('User onboarding from BTC wallet cashier', () => {
    cy.c_visitResponsive('/', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_switchWalletsAccount('BTC')
    const walletAdded = allWalletAdded()
    cy.findByText('Deposit').click()
    // cy.get('canvas').should('be.visible')
    setupTest('large')
    desktopSteps.forEach((step, index) => {
      if (index === 3 && walletAdded) return
      checkStep(
        step.backButtonExists,
        step.nextButtonName,
        step.title,
        step.description
      )
    })
    cy.get('[data-test-id="spotlight"]').should('not.exist')
  })
  it('User onboarding from BTC wallet traders hub', () => {
    cy.c_visitResponsive('/', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_switchWalletsAccount('BTC')
    const walletAdded = allWalletAdded()
    setupTest('large')
    desktopSteps.forEach((step, index) => {
      if (index === 3 && walletAdded) return
      checkStep(
        step.backButtonExists,
        step.nextButtonName,
        step.title,
        step.description
      )
    })
    cy.get('[data-test-id="spotlight"]').should('not.exist')
  })
  it('User onboarding from BTC wallet compare account', () => {
    cy.c_visitResponsive('/', 'large')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_switchWalletsAccount('BTC')
    cy.findByText('Compare accounts').click()
    cy.contains('Compare CFDs accounts').should('be.visible')
    const walletAdded = allWalletAdded()
    setupTest('large')
    desktopSteps.forEach((step, index) => {
      if (index === 3 && walletAdded) return
      checkStep(
        step.backButtonExists,
        step.nextButtonName,
        step.title,
        step.description
      )
    })
    cy.get('[data-test-id="spotlight"]').should('not.exist')
  })
  it('User onboarding for mobile', () => {
    cy.c_visitResponsive('/', 'small')
    const walletAdded = allWalletAdded()
    setupTest()
    mobileSteps.forEach((step, index) => {
      if (index === 3 && walletAdded) return
      checkStep(
        step.backButtonExists,
        step.nextButtonName,
        step.title,
        step.description
      )
    })
    cy.get('[data-test-id="spotlight"]').should('not.exist')
  })
  it('User onboarding from USD wallet cashier in responsive', () => {
    cy.c_visitResponsive('/', 'small')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    const walletAdded = allWalletAdded()
    cy.findByText('Deposit').parent().should('be.visible').click()
    cy.contains('Oops, something went wrong!').should('be.visible')
    setupTest()
    mobileSteps.forEach((step, index) => {
      if (index === 3 && walletAdded) return
      checkStep(
        step.backButtonExists,
        step.nextButtonName,
        step.title,
        step.description
      )
    })
    cy.get('[data-test-id="spotlight"]').should('not.exist')
  })
  it('User onboarding from BTC wallet tradershub in responsive', () => {
    cy.c_visitResponsive('/', 'small')
    cy.findByText('Compare accounts').click()
    cy.contains('Compare CFDs accounts').should('be.visible')
    cy.findByText('Deposit').parent().should('be.visible').click()
    cy.contains('Oops, something went wrong!').should('be.visible')
    setupTest()
    mobileSteps.forEach((step, index) => {
      if (index === 3 && walletAdded) return
      checkStep(
        step.backButtonExists,
        step.nextButtonName,
        step.title,
        step.description
      )
    })
    cy.get('[data-test-id="spotlight"]').should('not.exist')
  })
  it('User onboarding from BTC wallet cashier in responsive', () => {
    cy.c_visitResponsive('/', 'small')
    cy.contains('Wallet', { timeout: 10000 }).should('exist')
    cy.c_switchWalletsAccountResponsive('BTC')
    const walletAdded = allWalletAdded()
    setupTest()
    mobileSteps.forEach((step, index) => {
      if (index === 3 && walletAdded) return
      checkStep(
        step.backButtonExists,
        step.nextButtonName,
        step.title,
        step.description
      )
    })
    cy.get('[data-test-id="spotlight"]').should('not.exist')
  })

  it('User onboarding from BTC wallet compare account in responsive', () => {
    cy.c_visitResponsive('/', 'small')
    cy.c_switchWalletsAccountResponsive('BTC')
    cy.findByText('Compare accounts').click()
    cy.contains('Compare CFDs accounts').should('be.visible')
    const walletAdded = allWalletAdded()
    setupTest()
    mobileSteps.forEach((step, index) => {
      if (index === 3 && walletAdded) return
      checkStep(
        step.backButtonExists,
        step.nextButtonName,
        step.title,
        step.description
      )
    })
    cy.get('[data-test-id="spotlight"]').should('not.exist')
  })
})
