function getLoginToken(callback) {
    cy.request({
      method: 'POST',
      url: 'https://' + Cypress.env('configServer') + '/oauth2/api/v1/verify',
      headers: {
        'Origin': 'https://oauth.deriv.com',
        'Content-Type': 'application/json',
      },
      body: {
        "app_id": Cypress.env('configAppId')
      }
  }).then((response) => {
      const challenge = response.body.challenge;
      const expire = response.body.expire;
      var crypto = require('crypto');
      const solution = crypto.createHmac('sha256', Cypress.env('HMACKey')).update(challenge).digest("hex"); 
  
      cy.log('<solution>' + solution)
    
      cy.request({
        method: 'POST',
        url: 'https://' + Cypress.env('configServer') + '/oauth2/api/v1/authorize',
        headers: {
          'Origin': 'https://oauth.deriv.com',
          'Content-Type': 'application/json',
        },
        body: {
          "app_id": Cypress.env('configAppId'),
          "expire": expire,
          "solution": solution
        },
      }).then((response) => {
  
          const bearerToken = response.body.token;
          cy.log('<bearer token>' + bearerToken);
          expect(response.status).to.eq(200);

          cy.request({
            method: 'POST',
            url: 'https://' + Cypress.env('configServer') + '/oauth2/api/v1/login',
            headers: {
              'Authorization': 'Bearer ' + bearerToken,
              'Content-Type': 'application/json'
            },
            body: {
              "app_id": Cypress.env('configAppId'),
              "type": "system",
              "email": Cypress.env('loginEmail'),
              "password": Cypress.env('loginPassword')
            }
          }).then((response) => {
            const token = response.body.tokens[0].token;
            cy.log('<login token>' + token);

            callback(token);

            expect(response.status).to.eq(200); 

          });
  
      });
    });
  }

  function getOAuthUrl(callback) {
    cy.request({
      method: 'GET',
      url: 'https://' + Cypress.env('configServer') + '/oauth2/authorize?app_id=' + Cypress.env('configAppId') + '&l=en&brand=deriv&date_first_contact=',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://oauth.deriv.com'
      }
    }).then((response) => {
      // Step 2: Extract CSRF token from the response
      // This will depend on how the token is presented in the response.
      // For example, it might be in a cookie, a header, or in the HTML body.
      const csrfToken = extractCsrfToken(response);
      cy.log('csrfToken>>' + csrfToken);
      const cookie = response.headers['set-cookie'];
      cy.log('Cookie Test:' + response.headers['set-cookie'])

      // Step 3: Make a POST request with the CSRF token
      cy.request({
        method: 'POST',
        url: 'https://' + Cypress.env('configServer') + '/oauth2/authorize?app_id=' + Cypress.env('configAppId') + '&l=en&brand=deriv&date_first_contact=', // replace with the actual login URL
        form: false, // indicates the body should be form-urlencoded
        followRedirect: false,
        body: {
          email: Cypress.env('loginEmail'),
          password: Cypress.env('loginPassword'),
          login: 'Log in',
          csrf_token: csrfToken
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://oauth.deriv.com',
          'Cookie': cookie,
          'csrf_token': csrfToken
        }
      }).then((response) => {
          const oAuthUrl = response.headers['location'];
          cy.log('oAuthUrl: ' + oAuthUrl);

          callback(oAuthUrl);

          expect(response.status).to.eq(302);
      });
    });
  }

  function extractCsrfToken(response) {
    // Implement the logic to extract the CSRF token from the response
    // This is just a placeholder function
    const regex = /name="csrf_token" value="([^"]*)"/;
    const found = response.body.match(regex);

    return found[1];
  }

  module.exports = { getLoginToken };
  module.exports = { getOAuthUrl };