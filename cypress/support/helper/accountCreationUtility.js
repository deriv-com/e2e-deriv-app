require('dotenv').config()
const { chromium } = require('playwright')
const DerivAPI = require('@deriv/deriv-api/dist/DerivAPI')
const WebSocket = require('ws')
const {
  emailGenerator,
  numbersGenerator,
  nameGenerator,
} = require('./commonJsUtility')

const appId = process.env.E2E_STD_CONFIG_APPID
const websocketURL = `wss://${process.env.E2E_STD_CONFIG_SERVER}/websockets/v3`
const basicAuthUrl = `https://${process.env.E2E_STD_CONFIG_SERVER}`

const connection = new WebSocket(
  `${websocketURL}?l=EN&app_id=${appId}&brand=deriv`
)
const api = new DerivAPI({ connection })

const randomEmail = emailGenerator()

const verifyEmail = async () => {
  await api.basic.verifyEmail({
    verify_email: randomEmail,
    type: 'account_opening',
  })
  return randomEmail
}

// const getVerificationCode = async () => {
//   // Launch browser
//   const browser = await chromium.launch()
//   try {
//     await verifyEmail()

//     const context = await browser.newContext({
//       httpCredentials: {
//         username: process.env.E2E_QABOX_LOGIN,
//         password: process.env.E2E_QABOX_PASSWORD,
//       },
//     })
//     const page = await context.newPage()

//     // Navigate to /events to extract the email verification code
//     await page.goto(`${basicAuthUrl}/events`)

//     let verificationCode
//     for (let retryCount = 0; retryCount < 3; retryCount++) {
//       await page.evaluate(() => {
//         const allRelatedEmails = Array.from(
//           document.querySelectorAll(`a[href*="account_opening_new.html"]`)
//         )
//         if (allRelatedEmails.length) {
//           const verificationEmail = allRelatedEmails.pop()
//           verificationEmail.click()
//         }
//       })

//       await page.waitForNavigation({ waitUntil: 'domcontentloaded' })

//       // Extract the href attribute of the last link and process it
//       const href = await page.evaluate(() => {
//         const links = document.querySelectorAll('a')
//         const targetLink = links[links.length - 1].getAttribute('href')
//         return targetLink
//       })

//       const codeMatch = href.match(/code=([A-Za-z0-9]{8})/)
//       if (codeMatch) {
//         verificationCode = codeMatch[1]
//       } else {
//         console.log('Unable to find code in the URL')
//       }

//       if (verificationCode) {
//         break
//       }

//       console.log(
//         `Email not found. Retrying... Attempt number: ${retryCount + 1}`
//       )
//       await page.waitForTimeout(1000)
//     }

//     if (!verificationCode) {
//       throw new Error(`Signup URL extraction failed after 3 attempts.`)
//     }
//     return verificationCode
//   } catch (e) {
//     console.log(e)
//   } finally {
//     await browser.close()
//   }
// }

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
      verification_code: process.env.E2E_EMAIL_VERIFICATION_CODE,
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
    console.log(connection.readyState)
    if (connection.readyState === WebSocket.OPEN) {
      connection.close()
    }
  }
}

module.exports = { createAccountReal, createAccountVirtual, verifyEmail }
