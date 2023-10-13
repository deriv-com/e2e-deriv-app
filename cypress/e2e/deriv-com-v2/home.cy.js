import '@testing-library/cypress/add-commands'

describe('Home Page Tests', () => {

  it('Full size', () => {
    cy.c_visitResponsive('/', 'large')

    cy.findByRole('heading', { name: 'Forex spreads from 0.3 pips' }).should('be.visible')
    cy.findByPlaceholderText('This component is not styled yet').should('be.visible')
    cy.findByRole('button', { name: 'Create a demo account' }).should('be.visible')
    cy.findByText('or sign up with').should('be.visible')
    cy.findByRole('button', { name: 'Google' }).should('be.visible')
    cy.findByRole('button', { name: 'Facebook' }).should('be.visible')
    cy.findByRole('button', { name: 'Apple' }).should('be.visible')
    cy.findByRole('img', { name: 'hero 2' }).should('be.visible')
    cy.findByRole('heading', { name: '20+ years', exact: true }).should('be.visible')
    cy.findByText('of experience').should('be.visible')
    cy.findByRole('heading', { name: '20B+' }).should('be.visible')
    cy.findByText('daily trades', { exact: true }).click()
    cy.findByRole('heading', { name: 'Fast, reliable forex trading platform' }).should('be.visible')
    cy.findByText('Average trade execution: Below 50ms').should('be.visible')
    cy.findByRole('img', { name: 'home hero' }).should('be.visible')
    cy.findByRole('heading', { name: 'Why trade forex with us' }).should('be.visible')
    cy.findByRole('heading', { name: 'Trade diverse forex assets' }).should('be.visible')
    cy.findByText('Trade over 50 forex pairs including major, minor, and exotic pairs').should('be.visible')

    //==Cypress/Playwright Anomoly 1==
    //Works OK in Playwright, need to find out why it doesn't in Cypress.
    //cy.findByRole('link', { name: 'More on forex trading' }).first().click()

    //When there are mulitple elements, you need to use the 'All' version of a function.
    cy.findAllByRole('link', { name: 'More on forex trading' }).first().click()

    cy.findByRole('heading', { name: 'Card Slider Title' }).should('be.visible')
    //cy.locator('div').filter({ hasText: /^Card 1Description here\. Description here\. Description here\. Description here\.$/ }).nth(2).should('be.visible')
    cy.findByRole('heading', { name: 'Card 1' }).should('be.visible')
    //cy.locator('.swiper-slide > div > div > .flex > .font-sans').first().should('be.visible')

    //==Cypress/Playwright Anomoly 2==
    //Works OK in Playwright, need to find out why it doesn't in Cypress.
    //cy.findByText('$48M+Monthly withdrawals').should('be.visible')

    //To get it working in Cypress, I have to do this.
    cy.findByRole('heading', { name: '$48M+' }).should('be.visible')
    cy.findByRole('heading', { name: 'Monthly withdrawals' }).should('be.visible')

    cy.findByRole('heading', { name: '$650B+' }).should('be.visible')
    cy.findByRole('heading', { name: 'Monthly volume' }).should('be.visible')
  })


})