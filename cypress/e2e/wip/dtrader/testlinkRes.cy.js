describe('Mobile Viewport', () => {
  it('visits the settings page in mobile viewport', () => {
    // Set the viewport size to a specific mobile resolution
    cy.viewport('iphone-x') // or any other mobile device preset

    // Visit the URL
    //   cy.visit('https://derivfe.github.io/qa-test/settings/')
    cy.visit('https://deriv.com', { failOnStatusCode: false })
    console.error('This is an error from the test')
    //   cy.log('heloooo')

    // Add your assertions or interactions here
    // ...
  })
})
