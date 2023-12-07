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


  if (app == "wallets" || app == "doughflow"  || app == "demoonlywallet" || app == "onramp") {
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

  if (app == "onramp") {
    localStorage.setItem("config.app_id", Cypress.env("onrampConfigAppId"))
  }

if (Cypress.env("oAuthToken") == "") {
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
          //If Deriv charts popup exists, click continue
          cy.contains("Continue").then(($element) => {
            //Check if the continue button exists
            if ($element.length) {
              // If the element exists, click on it
              cy.wrap($element).click()
            }
          })
          //cy.findByRole('button', { name: 'Continue' }).click()
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
    } else if (app == "demoonlywallet"){
      cy.log("DemowalletToken:" + Cypress.env("demoOAuthToken"))
      cy.c_visitResponsive(
        Cypress.env("demoOAuthUrl").replace("<token>", Cypress.env("demoOAuthToken")),
        "large"
      )
      }
    else {
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

Cypress.Commands.add('c_emailVerification', (verification_code, base_url) => {
  cy.visit(
    `https://${Cypress.env("qaBoxLoginEmail")}:${Cypress.env(
      "qaBoxLoginPassword"
    )}@${base_url}`
  )
  cy.origin(
    `https://${Cypress.env("qaBoxLoginEmail")}:${Cypress.env(
      "qaBoxLoginPassword"
    )}@${base_url}`, () => {
      cy.scrollTo("bottom")
      cy.get("a").last().click()
      cy
        .get("a")
        .eq(1)
        .invoke("attr", "href")
        .then((href) => {
          const code = href.match(/code=([A-Za-z0-9]{8})/)
          if (code) {
            verification_code = code[1]
            Cypress.env("walletsWithdrawalCode", verification_code)
            cy.log(verification_code)
          } else {
            cy.log("Unable to find code in the URL")
          }
        })
    }
  )
})

Cypress.on('uncaught:exception', (err, runnable, promise) => {
    console.log(err)
    return false
  })




  




  
