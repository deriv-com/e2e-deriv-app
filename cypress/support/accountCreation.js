const { chromium } = require('playwright')
require('dotenv').config()
const WebSocket = require('ws')
const DerivAPI = require('@deriv/deriv-api/dist/DerivAPI')
const appId = Cypress.env('stdConfigAppId')
const websocketURL = Cypress.env('websocketUrl')
const basicUrl = Cypress.env('qaBoxBaseUrl')
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

const getVerificationCode = async () => {
  // verifyEmail API call
  await api.basic.verifyEmail({
    verify_email: `${randomEmail}`,
    type: 'account_opening',
  })

  // Launch a Chromium browser instance
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    // Add HTTP credentials for basic authentication
    httpCredentials: {
      username: Cypress.env('emailUser'),
      password: Cypress.env('emailPassword'),
    },
  })
  const page = await context.newPage()

  // Navigate to the /events page
  await page.goto(`${basicUrl}/events`)

  // Scroll to the bottom of the page
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

  // Click on the last link on the page
  await page.evaluate(() => {
    const links = document.querySelectorAll('a')
    links[links.length - 1].click()
  })

  // Wait for navigation to complete
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
}

const createAccountVirtual = async () => {
  try {
    const response = await api.basic.newAccountVirtual({
      new_account_virtual: 1,
      type: 'trading',
      client_password: 'Abcd1234',
      residence: 'id',
      verification_code: `${await getVerificationCode()}`,
    })
    const {
      new_account_virtual: { oauth_token },
    } = response
    return oauth_token
  } catch (e) {
    console.log(e)
  }
}

const createAccountReal = async () => {
  try {
    await api.account(`${await createAccountVirtual()}`)
    const response = await api.basic.newAccountReal({
      new_account_real: 1,
      address_line_1: '20 Broadway Av',
      date_of_birth: '1980-01-31',
      first_name: 'AutoGen',
      last_name: generateRandomName(),
      currency: 'USD',
      residence: 'id',
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

module.exports = { createAccountReal }
