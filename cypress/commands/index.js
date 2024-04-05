// Cypress.on("window:before:load", win => {
//     cy.stub(win.console, "error").callsFake(msg => {
//       // log out to the terminal
//       cy.now("task", "error", msg)
//       // log to Command Log and fail the test
//       throw new Error(msg)
//     })
//   })

Cypress.on('window:before:load', (win) => {
  cy.stub(win.console, 'error', (msg) => {
    cy.now('task', 'error', msg)
  })

  cy.stub(win.console, 'warn', (msg) => {
    cy.now('task', 'warn', msg)
  })
})
