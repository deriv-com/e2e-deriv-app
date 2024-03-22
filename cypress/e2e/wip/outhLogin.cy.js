describe('API Request with CSRF Token', () => {
  it('performs a form submission with CSRF token', () => {
    // Step 1: Make a GET request to the page to obtain the CSRF token
    cy.request({
      method: 'GET',
      url:
        'https://' +
        Cypress.env('configServer') +
        '/oauth2/authorize?app_id=' +
        Cypress.env('configAppId') +
        '&l=en&brand=deriv&date_first_contact=',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://oauth.deriv.com',
      },
    }).then((response) => {
      // Step 2: Extract CSRF token from the response
      // This will depend on how the token is presented in the response.
      // For example, it might be in a cookie, a header, or in the HTML body.
      const csrfToken = extractCsrfToken(response)
      cy.log('csrfToken>>' + csrfToken)
      const cookie = response.headers['set-cookie']
      cy.log('Cookie Test:' + response.headers['set-cookie'])

      // Step 3: Make a POST request with the CSRF token
      cy.request({
        method: 'POST',
        url:
          'https://' +
          Cypress.env('configServer') +
          '/oauth2/authorize?app_id=' +
          Cypress.env('configAppId') +
          '&l=en&brand=deriv&date_first_contact=', // replace with the actual login URL
        form: false, // indicates the body should be form-urlencoded
        followRedirect: false,
        body: {
          email: Cypress.env('loginEmail'),
          password: Cypress.env('loginPassword'),
          login: 'Log in',
          csrf_token: csrfToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://oauth.deriv.com',
          'Cookie': cookie,
          'csrf_token': csrfToken,
        },
      }).then((response) => {
        cy.log(response.headers['location'])
        //cy.log(response.status);
        // Check if the login was successful
        expect(response.status).to.eq(302)
        // Additional assertions can be made here based on the response
      })
    })
  })
})

function extractCsrfToken(response) {
  // Implement the logic to extract the CSRF token from the response
  // This is just a placeholder function
  const regex = /name="csrf_token" value="([^"]*)"/
  const found = response.body.match(regex)

  return found[1]
}
