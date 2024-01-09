const { getLoginToken } = require("./common")
const { getOAuthUrl } = require("./common")

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

  if (app == "doughflow") {
    localStorage.setItem("config.server_url", Cypress.env("doughflowConfigServer"))
    localStorage.setItem("config.app_id", Cypress.env("doughflowConfigAppId"))
  }

  if (app == "onramp") {
    localStorage.setItem("config.app_id", Cypress.env("onrampConfigAppId"))
  }

  if (app == "wallets" || app == "doughflow"  || app == "demoonlywallet" || app == "onramp") {
    cy.contains("next_wallet").then(($element) => {
      //Check if the element exists
      if ($element.length) {
        // If the element exists, click on it
        cy.wrap($element).click()
      }
    })
  }

  if (Cypress.env("oAuthUrl") == "") {
      getOAuthUrl(
        (oAuthUrl) => {
          cy.log("getOAuthUrl - value: " + oAuthUrl)
          Cypress.env("oAuthUrl", oAuthUrl)
          cy.c_doOAuthLogin(app)
        })
  } else
  {
    cy.c_doOAuthLogin(app)
  } 

})

Cypress.Commands.add('c_doOAuthLogin', (app) => {
  cy.c_visitResponsive(Cypress.env("oAuthUrl"),"large")
  //To let the dtrader page load completely
  cy.get('.cq-symbol-select-btn', { timeout: 10000}).should('exist')

  //If Deriv charts popup exists, click continue
  cy.get('#modal_root, .modal-root', { timeout: 10000 })
    .then(($element) => {
      if ($element.children().length > 0) {
        cy.contains("Continue").then(($element) => {
          if ($element.length) {
            cy.wrap($element).should("be.visible")
          }
          //To redirect to wallet page
          if (app == "wallets" || app == "doughflow"  || app == "demoonlywallet" || app == "onramp") {
           cy.findByRole('banner').should("be.visible")
          } else { //To redirect to trader's hub page
            cy.findByText("Trader's Hub").should("be.visible")
          }
        })
      } else { //when deriv charts popup is not available and if we need to redirect to wallet page 
        if (app == "wallets" || app == "doughflow"  || app == "demoonlywallet" || app == "onramp") {
          cy.findByRole('banner').should("be.visible")
          } else { //when deriv charts popup is not available and if we need to redirect to trader's hub page 
            cy.findByText("Trader's Hub").should("be.visible")
          }
      }
    })
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

//To be added on hotspots as an edge case only when constantly hitting rate limits
Cypress.Commands.add("c_rateLimit", () => {
  cy.get("#modal_root, .modal-root", { timeout: 10000 }).then(($element) => {
    if ($element.children().length > 0) {
      cy.contains("Refresh").then(($element) => {
        if (
          $element.length &&
          cy.contains("You have reached your rate limit")
        ) {
          cy.wrap($element).click()
          //Timeout if rate limited and should wait until content is re-rendered
          cy.wait(30000)
        }
        return
      })
    } else {
      return
    }
  })
})

Cypress.Commands.add("c_transferLimit", (transferMessage) => {
  cy.get(".wallets-cashier-content", { timeout: 10000 })
    // IF ADDED ONLY IF CONDITION WORKS, IF REMOVED ONLY ELSE CONDITION WORKS
    // .contains(
    //   `You can only perform up to 10 transfers a day. Please try again tomorrow.` ||
    //     "You have exceeded 200.00 USD in cumulative transactions. To continue, you will need to verify your identity.",
    //     {timeout: 5000}
    // )
    .then(($element) => {
      if (
        $element
          .text()
          .includes(
            `You can only perform up to 10 transfers a day. Please try again tomorrow.` ||
              "You have exceeded 200.00 USD in cumulative transactions. To continue, you will need to verify your identity."
          )
      ) {
        cy.contains("Reset error").then(($resetElement) => {
          if ($resetElement.length) {
            cy.wrap($resetElement).click()
          }
          cy.contains("Wallet", { timeout: 10000 }).should("exist")
        })
      } else {
        cy.findByText("Your transfer is successful!", {
          exact: true,
        }).should("be.visible")
        cy.contains(transferMessage)
        cy.contains("% transfer fees")
        cy.findByRole("button", { name: "Make a new transfer" }).click()
      }
    })
})

Cypress.on('uncaught:exception', (err, runnable, promise) => {
    console.log(err)
    return false
  })




  




  
