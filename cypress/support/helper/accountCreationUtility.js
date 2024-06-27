require('dotenv').config()

const {
  emailGenerator,
  numbersGenerator,
  nameGenerator,
} = require('./commonJsUtility')

const verifyEmail = async (api) => {
  const randomEmail = emailGenerator()
  await api.basic.verifyEmail({
    verify_email: randomEmail,
    type: 'account_opening',
  })
  return randomEmail
}

const createAccountVirtual = async (
  api,
  country_code,
  password = process.env.E2E_DERIV_PASSWORD
) => {
  try {
    if (!password) throw new Error(`Password not on file`)
    const response = await api.basic.newAccountVirtual({
      new_account_virtual: 1,
      type: 'trading',
      client_password: password,
      residence: country_code,
      verification_code: process.env.E2E_EMAIL_VERIFICATION_CODE,
    })
    const {
      new_account_virtual: { oauth_token },
    } = response
    return {
      residence: country_code,
      oauthToken: oauth_token,
    }
  } catch (e) {
    console.error('Operation failed', e)
    throw e
  }
}

const createAccountReal = async (api, country_code, currency) => {
  try {
    const resp = await createAccountVirtual(api, country_code)
    const { oauthToken } = resp
    await api.account(oauthToken) // API authentication

    const clientDetails = {
      new_account_real: 1,
      non_pep_declaration: 1,
      account_opening_reason: 'Speculative',
      currency: currency,
      first_name: 'Auto Gen',
      last_name: nameGenerator(),
      date_of_birth: '2000-09-20',
      place_of_birth: country_code,
      residence: country_code,
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
    return {
      clientID: client_id,
      residence: residence,
    }
  } catch (e) {
    console.error('Operation failed', e)
    throw e
  }
}

module.exports = { createAccountReal, createAccountVirtual, verifyEmail }
