
import '@testing-library/cypress/add-commands'
import { derivApp } from '../../../support/locators/index'


describe(`QATEST-00000 - Verify Traders Hub page in screensize: small`,()=>{
    beforeEach(()=>{
        cy.c_setServerUrlAndAppId(Cypress.env('configServer'),Cypress.env('configAppId'))
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'small')
        cy.c_waitForLoader()
    })
    it('should verify the traders hub page',()=>{
        derivApp.tradersHubPage.responsive.optionsAndMutipliersSectionContent().should('exist').and('be.visible')
        derivApp.tradersHubPage.responsive.cfdsButton().click()
        derivApp.tradersHubPage.responsive.cfdsSectionContent().should('exist').and('be.visible')
    })
})

describe(`QATEST-00000 - Verify Traders Hub page in screensize: large`,()=>{
    beforeEach(()=>{
        cy.c_setServerUrlAndAppId(Cypress.env('configServer'),Cypress.env('configAppId'))
        cy.c_login()
        cy.c_visitResponsive('/appstore/traders-hub', 'large')
        cy.c_waitForLoader()
    })
    it('should verify the traders hub page',()=>{
        derivApp.tradersHubPage.optionsAndMutipliersSection().should('exist').and('be.visible')
        derivApp.tradersHubPage.cfdsSection().should('exist').and('be.visible')
    })
})