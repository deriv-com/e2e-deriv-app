describe('API Request with CSRF Token', () => {
  it('performs a form submission with CSRF token', async () => {
    try {
      // Step 1: Make a GET request to the page to obtain the CSRF token
      const getUrl = `https://${Cypress.env('configServer')}/oauth2/authorize?app_id=${Cypress.env('configAppId')}&l=en&brand=deriv&date_first_contact=`;
      const getResponse = await fetch(getUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://oauth.deriv.com'
        }
      })

      const getText = await getResponse.text();
      //cy.log(getText);

      // Step 2: Extract CSRF token from the response
      const csrfToken = extractCsrfToken(getText);
      console.log('csrfToken>>', csrfToken);

      // Step 3: Make a POST request with the CSRF token
      const postUrl = `https://${Cypress.env('configServer')}/oauth2/authorize?app_id=${Cypress.env('configAppId')}&l=en&brand=deriv&date_first_contact=`;
      const postResponse = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://oauth.deriv.com'
        },
        body: new URLSearchParams({
          email: Cypress.env('loginDielEmail'),
          password: Cypress.env('loginDielPassword'),
          login: 'Log in',
          csrf_token: csrfToken
        })
      });

      const getText2 = await postResponse.text();

      cy.log(postResponse.status);

      // Check if the login was successful
      expect(postResponse.status).toBe(302);
      // Additional assertions can be made here based on the response
    } catch (error) {
      console.error('Error during the request:', error);
    }
  });
});

  function extractCsrfToken(response) {
    // Implement the logic to extract the CSRF token from the response
    // This is just a placeholder function
    const regex = /name="csrf_token" value="([^"]*)"/;
    const found = response.body.match(regex);

    return found[1];
  }