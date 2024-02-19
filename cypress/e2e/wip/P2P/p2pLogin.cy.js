import '@testing-library/cypress/add-commands'

describe('QATEST-2414 - Create a Buy type Advert : Floating Rate', () => {
  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('should be able to load my ads page', () => {

    // click on hamburger menu
    cy.get("#dt_mobile_drawer_toggle").should("be.visible")
    cy.get("#dt_mobile_drawer_toggle").click()
    // click on cashier 
    cy.get('.dc-mobile-drawer__body > :nth-child(4)').should("be.visible").click()
    // click on P2P 
    cy.findByText("Deriv P2P").should("be.visible").click()
    // confirm warning message
    cy.get('.dc-checkbox__box').should("be.visible").click() 
    cy.findByRole("button", { name: "Confirm" }).click()
    // click on ads tab
    cy.get('.notification__close-button').should("be.visible").click()
    cy.findByText("My ads").should("be.visible").click()
    cy.findByRole("button", { name: "Create new ad" }).should("be.visible")
    
  
  })
})
