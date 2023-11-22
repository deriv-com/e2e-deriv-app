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

  module.exports = { getLoginToken };