require('dotenv').config()
const crypto = require('crypto')
const { chromium } = require('playwright')
const DerivAPI = require('@deriv/deriv-api/dist/DerivAPI')
const WebSocket = require('ws')

const appId = process.env.E2E_STD_CONFIG_APPID
const websocketURL = `wss://${process.env.E2E_STD_CONFIG_SERVER}/websockets/v3`
const basicAuthUrl = `https://${process.env.E2E_STD_CONFIG_SERVER}`

const connection = new WebSocket(
  `${websocketURL}?l=EN&app_id=${appId}&brand=deriv`
)
const api = new DerivAPI({ connection })

const numbersGenerator = () => {
  let array = new Uint8Array(10)
  crypto.randomFillSync(array) // Synchronously fill the array with random bytes
  return Array.from(array, (byte) => byte % 10).join('')
}

const emailGenerator = () => {
  const vowels = 'aeiou'
  // Generate a random index for vowels
  const vowelIndex = crypto.randomInt(0, vowels.length) // 0 to 4
  // Generate a random number between 0 and 999
  const randomNumber = crypto.randomInt(0, 1000)

  return `qa+test${vowels[vowelIndex]}${randomNumber}@deriv.com`
}

const nameGenerator = () => {
  const vowels = 'aeiou'
  const consonants = 'bcdfghjklmnpqrstvwxyz'
  let name = ''

  for (let i = 0; i < 8; i++) {
    if (i < 2) {
      // First two characters are vowels
      const index = crypto.randomInt(0, vowels.length)
      name += vowels[index]
    } else {
      // Next six characters are consonants
      const index = crypto.randomInt(0, consonants.length)
      name += consonants[index]
    }
  }
  return name
}

const randomEmail = emailGenerator()

const verifyEmail = async () => {
  await api.basic.verifyEmail({
    verify_email: randomEmail,
    type: 'account_opening',
  })
}

const getVerificationCode = async () => {
  try {
    await verifyEmail()

    // Launch browser
    const browser = await chromium.launch()
    const context = await browser.newContext({
      httpCredentials: {
        username: process.env.E2E_AUTH_EMAIL_USER,
        password: process.env.E2E_AUTH_EMAIL_PASSWORD,
      },
    })
    const page = await context.newPage()

    // Navigate to /events to extract the email verification code
    await page.goto(`${basicAuthUrl}/events`)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
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
    console.log(e)
  }
}

const createAccountVirtual = async (
  password = process.env.E2E_DERIV_PASSWORD,
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
    const results = [randomEmail, residence, oauth_token]
    return results
  } catch (e) {
    console.log(e)
  }
}

const createAccountReal = async (clientResidence = 'id', currency = 'USD') => {
  try {
    const resp = await createAccountVirtual()
    const [, , oauth_token] = resp
    await api.account(oauth_token) // API authentication

    const clientDetails = {
      new_account_real: 1,
      non_pep_declaration: 1,
      account_opening_reason: 'Speculative',
      currency: currency,
      first_name: 'Auto Gen',
      last_name: nameGenerator(),
      date_of_birth: '2000-09-20',
      place_of_birth: clientResidence,
      residence: clientResidence,
      phone: `+${numbersGenerator()}`,
      address_line_1: '20 Broadway Av',
      address_city: 'Cyber',
      tax_residence: 'aq',
      tax_identification_number: `${numbersGenerator()}`,
    }

    const response = await api.basic.newAccountReal(clientDetails)
    const {
      new_account_real: { client_id },
      echo_req: { residence },
    } = response
    const results = [randomEmail, client_id, residence]
    return results
  } catch (e) {
    console.log(e)
  } finally {
    connection.close()
  }
}

module.exports = { createAccountReal, createAccountVirtual }
