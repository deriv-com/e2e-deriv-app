const { getLoginToken } = require("./common")

Cypress.Commands.add("c_visitResponsive", (path, size) => {
  //Custom command that allows us to use baseUrl + path and detect with this is a responsive run or not.
  cy.log(path)
  if (size === undefined)
    size = Cypress.env("viewPortSize")

  if (size == "small")
    cy.viewport("iphone-xr")
  else if (size == "medium")
    cy.viewport("ipad-2")
  else
    cy.viewport("macbook-16")

  cy.visit(path)

  if (path.includes("region")) {
    //Wait for relevent elements to appear (based on page)
    cy.log("Home page Selected")
    cy.findByRole("button", { name: "whatsapp icon" }).should("be.visible", {
      timeout: 30000,
    }) //For the home page, this seems to be the best indicator that a page has fully loaded. It may change in the future.
  }

  if (path.includes("help-centre")) {
    //Wait for relevent elements to appear (based on page)
    cy.log("Help Centre Selected")
    cy.findByRole("heading", {
      name: "Didn’t find your answer? We can help.",
    }).should("be.visible", { timeout: 30000 })
  }

  if (path.includes("traders-hub")) {
    //Wait for relevent elements to appear (based on page)
    cy.log("Trader Hub Selected")
  }
})

Cypress.Commands.add("c_login", (app) => {
  cy.c_visitResponsive("/endpoint", "large")

  localStorage.setItem("config.server_url", Cypress.env("configServer"))
  localStorage.setItem("config.app_id", Cypress.env("configAppId"))

  if (app == "wallets" || "doughflow") {
    cy.contains("next_wallet").then(($element) => {
      //Check if the element exists
      if ($element.length) {
        // If the element exists, click on it
        cy.wrap($element).click()
      }
    })
  }

  if (app == "doughflow") {
    localStorage.setItem(
      "config.server_url",
      Cypress.env("doughflowConfigServer")
    )
    localStorage.setItem("config.app_id", Cypress.env("doughflowConfigAppId"))
}

if (Cypress.env("oAuthToken") && Cypress.env("doughflowOAuthToken") == "") {
      getLoginToken(
        (token) => {
          cy.log("getLoginToken - token value: " + token)
          Cypress.env("oAuthToken", token)
          cy.c_visitResponsive(
            Cypress.env("oAuthUrl").replace(
              "<token>",
              Cypress.env("oAuthToken")
            ),
            "large"
          )
          cy.findByText("Trader's Hub").should("be.visible")
          //cy.get('[data-layer="Content"]').should('be.visible')
        }
      )
  } else {
    //Other credential use cases could be added here to access different oAuth tokens
    if (app == "doughflow") {
        cy.log("DoughflowToken:" + Cypress.env("doughflowOAuthToken"))
        cy.c_visitResponsive(
        Cypress.env("doughflowOAuthUrl").replace("<token>", Cypress.env("doughflowOAuthToken")),
        "large"
    )
    } else {
    cy.log("E2EToken:" + Cypress.env("oAuthToken"))
    cy.c_visitResponsive(
      Cypress.env("oAuthUrl").replace("<token>", Cypress.env("oAuthToken")),
      "large"
    )
    }
    cy.findByText("Trader's Hub").should("be.visible")
  }
})

Cypress.Commands.add('c_mt5login', () => {

    cy.c_visitResponsive(Cypress.env('mt5BaseUrl') + '/terminal', 'large')
    cy.findByRole('button', { name: 'Accept' }).click()
    cy.findByPlaceholderText('Enter Login').click()
    cy.findByPlaceholderText('Enter Login').type(Cypress.env('mt5Login'))
    cy.findByPlaceholderText('Enter Password').click()
    cy.findByPlaceholderText('Enter Password').type(Cypress.env('mt5Password'))
    cy.findByRole('button', { name: 'Connect to account' }).click()
})

Cypress.Commands.add('c_qaboxlogin', () => {
    cy.c_visitResponsive(Cypress.env('qaBoxBaseUrl'), 'large')
    cy.contains("Email").type(Cypress.env('qaBoxLoginEmail'))
    cy.contains("Password").type(Cypress.env('qaBoxLoginPassword')+'{enter}')
})

Cypress.on('uncaught:exception', (err, runnable, promise) => {
    console.log(err)
    return false
  })




  




  