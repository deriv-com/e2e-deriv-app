import '@testing-library/cypress/add-commands'
import { generateEpoch } from '../../../support/helper/utility'

describe('TRAH-3089: Verify ES Language Sign-up Flow', () => {
    const signUpEmail = `sanity${generateEpoch()}es@deriv.com`
    let country = Cypress.env('countries').ES
    let nationalIDNum = Cypress.env('nationalIDNum').ES
    let taxIDNum = Cypress.env('taxIDNum').ES
    let currency = Cypress.env('accountCurrency').GBP

    beforeEach(() => {
        cy.c_setEndpoint(signUpEmail)
    })

    it('Verify I can sign-up using ES language', () => {
        cy.c_demoAccountSignup(country, signUpEmail)
    })
})