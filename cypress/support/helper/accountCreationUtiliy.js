require('dotenv').config()
const DerivAPI = require('@deriv/deriv-api/dist/DerivAPI')
const appId = Cypress.env('stdConfigAppId')
const websocketURL = Cypress.env('websocketUrl')
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

export const getVerificationCode = async () => {
  await verifyEmail()

  const eventsUrl = `https://${Cypress.env('emailUser')}:${Cypress.env('emailPassword')}@${Cypress.env('event_email_url')}`
  cy.visit(`${eventsUrl}/events`)

  // After the page has loaded, start interacting with it
  cy.scrollTo('bottom') // Scroll to the bottom of the page
  cy.get('a').last().click() // Click the last link

  // Find the second link, get its href attribute, and extract the code
  cy.get('a')
    .eq(1)
    .invoke('attr', 'href')
    .then((href) => {
      const code = href.match(/code=([A-Za-z0-9]{8})/) // Use regex to find the code
      if (code) {
        const verification_code = code[1]
        cy.log('token', verification_code)
        return verification_code // Extract the verification code
      } else {
        cy.log('Unable to find code in the URL') // Log if the code is not found
      }
    })
}

export const createAccountVirtual = async (
  password = cy.log(Cypress.env('loginPassword')),
  residence = 'id'
) => {
  try {
    cy.log(Cypress.env('emailVerificationCode'))
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
    // cy.log('Virtual Account Email: ', randomEmail, oauth_token)
    return oauth_token
  } catch (e) {
    console.log(2)
  }
}

export const createAccountReal = async (
  clientResidence = 'id',
  currency = 'USD'
) => {
  try {
    await api.account(`${await createAccountVirtual(clientResidence)}`)
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
