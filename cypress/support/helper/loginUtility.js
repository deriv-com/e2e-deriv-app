/**
 * @description Used to get the login Token
 * @param {CallableFunction} callback function @values ()=>{}
 * @example getLoginToken((param)=>{
 * ...something here
 * })
 */
export function getLoginToken(callback) {
  cy.request({
    method: 'POST',
    url: 'https://' + Cypress.env('configServer') + '/oauth2/api/v1/verify',
    headers: {
      'Origin': 'https://oauth.deriv.com',
      'Content-Type': 'application/json',
    },
    body: {
      app_id: Cypress.env('configAppId'),
    },
  }).then((response) => {
    const challenge = response.body.challenge
    const expire = response.body.expire
    var crypto = require('crypto')
    const solution = crypto
      .createHmac('sha256', Cypress.env('HMACKey'))
      .update(challenge)
      .digest('hex')

    cy.log('<solution>' + solution)

    cy.request({
      method: 'POST',
      url:
        'https://' + Cypress.env('configServer') + '/oauth2/api/v1/authorize',
      headers: {
        'Origin': 'https://oauth.deriv.com',
        'Content-Type': 'application/json',
      },
      body: {
        app_id: Cypress.env('configAppId'),
        expire: expire,
        solution: solution,
      },
    }).then((response) => {
      const bearerToken = response.body.token
      cy.log('<bearer token>' + bearerToken)
      expect(response.status).to.eq(200)

      cy.request({
        method: 'POST',
        url: 'https://' + Cypress.env('configServer') + '/oauth2/api/v1/login',
        headers: {
          'Authorization': 'Bearer ' + bearerToken,
          'Content-Type': 'application/json',
        },
        body: {
          app_id: Cypress.env('configAppId'),
          type: 'system',
          email: Cypress.env('loginEmail'),
          password: Cypress.env('loginPassword'),
        },
      }).then((response) => {
        const token = response.body.tokens[0].token
        cy.log('<login token>' + token)

        callback(token)

        expect(response.status).to.eq(200)
      })
    })
  })
}

/**
 * @description Used to get the OAuth Url for logging in to the application
 * @param {CallableFunction} callback function @values ()=>{}
 * @example getOAuthUrl((params)=>{
 * ...something here
 * })
 */
export function getOAuthUrl(callback, loginEmail, loginPassword) {
  const URL =
    'https://' +
    Cypress.env('configServer') +
    '/oauth2/authorize?app_id=' +
    Cypress.env('configAppId') +
    '&l=en&brand=deriv&date_first_contact='
  // Step 1: Perform a GET on the OAuth Url in order to generate a CSRF token.
  cy.request({
    method: 'GET',
    url: URL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'https://oauth.deriv.com',
    },
  }).then((response) => {
    // Step 2: Extract CSRF token and set-cookie value from the response
    // This will depend on how the token is presented in the response.
    // For example, it might be in a cookie, a header, or in the HTML body.
    const csrfToken = extractCsrfToken(response)
    cy.log('csrfToken>>' + csrfToken)
    const cookie = response.headers['set-cookie']
    cy.log('Cookie Test:' + response.headers['set-cookie'])
    const loginRequestPayload = {
      method: 'POST',
      url: URL,
      form: false,
      followRedirect: false,
      body: {
        email: loginEmail,
        password: loginPassword,
        login: 'Log in',
        csrf_token: csrfToken,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://oauth.deriv.com',
        'Cookie': cookie,
        'csrf_token': csrfToken,
      },
    }

    // Step 3: Make a POST request with the CSRF token and cookie.
    cy.request(loginRequestPayload).then((response) => {
      // If the status is 200, Authorize app first
      if (
        response.status === 200 &&
        response.body.includes('Authorise this app')
      ) {
        const newCookie = response.headers['set-cookie']
        const csrfToken2 = extractCsrfToken(response)

        const options = {
          method: 'POST',
          url: URL,
          form: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': newCookie,
            'csrf_token': csrfToken2,
          },
          body: {
            csrf_token: csrfToken2,
            confirm_scopes: 'read,admin,trade,payments',
          },
          followRedirect: true,
        }
        cy.request(options).then(() => {
          // Then Log in
          cy.log('Authorized')
          cy.request(loginRequestPayload).then((response) => {
            const oAuthUrl = response.headers['location']
            cy.log('oAuthUrl: ' + oAuthUrl)
            callback(oAuthUrl)
          })
        })
      }
      const oAuthUrl = response.headers['location']
      cy.log('oAuthUrl: ' + oAuthUrl)
      callback(oAuthUrl)
    })
  })
  // Note: Ensure that `extractCsrfToken` and `extractOauthToken` are defined and compatible with Cypress's execution.
  // If they perform synchronous operations, you might need to wrap their logic in Cypress commands or use `.then()`.
}

/**
 * @description Used to extract the CSRF token from the response of GET Oauth url api
 * @param {string} response
 * @returns {csrfToken}
 * @example extractCsrfToken(response)
 */
function extractCsrfToken(response) {
  const regex = /name="csrf_token" value="([^"]*)"/
  const found = response.body.match(regex)

  return found[1]
}
