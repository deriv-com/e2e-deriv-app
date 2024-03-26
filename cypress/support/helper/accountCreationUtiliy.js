// import DerivAPI from '@deriv/deriv-api/dist/DerivAPI';
const { chromium } = require('playwright')
require('dotenv').config()
const DerivAPI = require('@deriv/deriv-api/dist/DerivAPI')
const WebSocket = require('ws')
const appId = process.env.E2E_STD_CONFIG_APPID // Cypress.env('stdConfigAppId')
const websocketURL = process.env.WEBSOCKET_URL // Cypress.env('websocketUrl')
const connection = new WebSocket(
  `${websocketURL}?l=EN&app_id=${appId}&brand=deriv`
)
const api = new DerivAPI({ connection })

const emailGenerator = () => {
  const vowels = 'aeiou'
  return `qa+test${vowels[Math.floor(Math.random() * 5)]}${Math.floor(Math.random() * 1000)}@deriv.com`
}

const generateRandomName = () => {
  const vowels = 'aeiou'
  const consonants = 'bcdfghjklmnpqrstvwxyz'
  let name = ''

  for (let i = 0; i < 8; i++) {
    name +=
      i < 2
        ? vowels[Math.floor(Math.random() * 5)]
        : consonants[Math.floor(Math.random() * 21)]
  }

  return [...name].sort(() => Math.random() - 0.5).join('')
}

const randomEmail = emailGenerator()

const verifyEmail = async () => {
  await api.basic.verifyEmail({
    verify_email: `${randomEmail}`,
    type: 'account_opening',
  })
}

const getVerificationCode = async () => {
  try {
    // verifyEmail API call
    await verifyEmail()

    // Launch browser
    const browser = await chromium.launch()
    const context = await browser.newContext({
      httpCredentials: {
        // Playwright uses 'httpCredentials' instead of 'authenticate'
        username: process.env.E2E_AUTH_EMAIL_USER,
        password: process.env.E2E_AUTH_EMAIL_PASSWORD,
      },
    })
    const page = await context.newPage()

    // Navigate to /events to extract the email verification code
    await page.goto(`${process.env.BASIC_AUTH_URL}/events`)

    // Scroll to the bottom of the page
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // Click on the last link on the page
    await page.evaluate(() => {
      const links = document.querySelectorAll('a')
      links[links.length - 1].click()
    })

    await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

    // Extract the href attribute of the last link and process it
    const href = await page.evaluate(() => {
      const links = document.querySelectorAll('a')
      const targetLink = links[links.length - 1].getAttribute('href')
      return targetLink
    })

    const codeMatch = href.match(/code=([A-Za-z0-9]{8})/)
    if (codeMatch) {
      const verification_code = codeMatch[1]
      await browser.close()
      return verification_code
    } else {
      console.log('Unable to find code in the URL')
      await browser.close()
    }
  } catch (e) {
    // Handle the error
    console.log(e)
  }
}

const createAccountVirtual = async (
  password = process.env.E2E_DERIV_PASSWORD, // Cypress.env('loginPassword'),
  residence = 'id'
) => {
  try {
    const response = await api.basic.newAccountVirtual({
      new_account_virtual: 1,
      type: 'trading',
      client_password: password,
      residence: residence,
      verification_code: `${await getVerificationCode()}`,
    })
    const {
      new_account_virtual: { oauth_token },
    } = response
    console.log('Virtual Account Email: ', randomEmail, oauth_token)
    return oauth_token
  } catch (e) {
    console.log(e)
  }
}

const createAccountReal = async (clientResidence = 'id', currency = 'USD') => {
  try {
    await api.account(`${await createAccountVirtual()}`)
    const response = await api.basic.newAccountReal({
      new_account_real: 1,
      address_line_1: '20 Broadway Av',
      date_of_birth: '2000-09-20',
      first_name: 'Auto Gen',
      last_name: generateRandomName(),
      currency: currency,
      residence: clientResidence,
    })
    const {
      new_account_real: { client_id },
      echo_req: { residence },
    } = response
    const results = [randomEmail, client_id, residence]
    console.log(results)
    return results
  } catch (e) {
    console.log(e)
  } finally {
    connection.close()
  }
}

module.exports = createAccountReal
