import "@testing-library/cypress/add-commands"

describe("QATEST-5948: Verify platforms navigations on Options and Multipliers", () => {
  it("Should navigate to correct platform on clicking Open button", () => {
    cy.c_login()
    cy.c_visitResponsive("/appstore/traders-hub", "large")
    const derivAppProdUrl = Cypress.env("prodURL")
    const derivAppStagingUrl = Cypress.env("stagingUrl")
    const bBotStagingUrl = Cypress.env("binaryBotUrl").staging
    const bBotProdUrl = Cypress.env("binaryBotUrl").prod
    const smartTraderStagingUrl = Cypress.env("smartTraderUrl").staging
    const smartTraderProdUrl = Cypress.env("smartTraderUrl").prod
    const dBotProdUrl = `${Cypress.env("prodURL")}bot`
    const dBotStagingUrl = `${Cypress.env("stagingUrl")}bot`

    //Open Dtrader
    cy.findAllByRole("button", { name: "Open" }).first().click({ force: true })
    if (Cypress.config().baseUrl.includes("staging"))
      cy.url().should("eql", derivAppStagingUrl)
    else cy.url().should("eql", derivAppProdUrl)

    //Open DBot
    cy.c_visitResponsive("/appstore/traders-hub", "large")
    cy.findAllByRole("button", { name: "Open" }).eq(1).click({ force: true })
    if (Cypress.config().baseUrl.includes("staging"))
      cy.url().should("eql", dBotStagingUrl)
    else cy.url().should("eql", dBotProdUrl)

    //Open SmartTrader
    cy.c_visitResponsive("/appstore/traders-hub", "large")
    cy.findAllByRole("button", { name: "Open" }).eq(2).click({ force: true })
    if (Cypress.config().baseUrl.includes("staging"))
      cy.url().should("eq", smartTraderStagingUrl)
    else cy.url().should("eq", smartTraderProdUrl)

    //Open BinaryBot
    cy.c_visitResponsive("/appstore/traders-hub", "large")
    cy.findAllByRole("button", { name: "Open" }).eq(3).click({ force: true })
    if (Cypress.config().baseUrl.includes("staging"))
      cy.url().should("eq", bBotStagingUrl)
    else cy.url().should("eq", bBotProdUrl)
  })
})
