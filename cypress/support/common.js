function getLoginToken(login, callback) {
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
      const solution = crypto.createHmac('sha256', "tok3n").update(challenge).digest("hex"); 
  
      cy.log('<solution>' + solution)
        // Continue with your Cypress commands
    
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
          // Additional assertions can be made here based on the response
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
            // cy.log('>' + login);
            // cy.log('>' + password);

            expect(response.status).to.eq(200); // Adjust the assertion based on expected response

            callback(token);
            // Additional assertions can be added here
          });
        // Check if the login was successful
  
      });
    });
  }

  module.exports = { getLoginToken };