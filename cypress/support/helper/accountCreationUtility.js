require('dotenv').config()
const data = require('../../fixtures/common/common.json')
const {
  emailGenerator,
  numbersGenerator,
  nameGenerator,
} = require('./commonJsUtility')

const {
  new_account_real,
  non_pep_declaration,
  account_opening_reason,
  country_code: defaultCountryCode,
  currency: defaultCurrency,
  first_name: defaultFirstName,
  date_of_birth: defaultDateOfBirth,
  address_line_1: defaultAddressLine1,
  address_city: defaultAddressCity,
  tax_residence: defaultTaxResidence,
} = data.defaultCRDetails

const {
  new_account_virtual,
  type,
  country_code: DefaultVRCountryCode,
} = data.defaultVRDetails

const verifyEmail = async (api) => {
  const randomEmail = emailGenerator()
  await api.basic.verifyEmail({
    verify_email: randomEmail,
    type: 'account_opening',
  })
  return randomEmail
}

const createAccountVirtual = async (api, clientData = {}) => {
  const {
    country_code = DefaultVRCountryCode,
    client_password = process.env.E2E_DERIV_PASSWORD,
  } = clientData
  try {
    if (!client_password) throw new Error(`Password not on file`)
    const response = await api.basic.newAccountVirtual({
      new_account_virtual,
      type,
      client_password,
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

const createAccountReal = async (api, clientData = {}) => {
  const {
    country_code = defaultCountryCode,
    currency = defaultCurrency,
    first_name = defaultFirstName,
    last_name = nameGenerator(),
    date_of_birth = defaultDateOfBirth,
    phone = `+${numbersGenerator()}`,
    address_line_1 = defaultAddressLine1,
    address_city = defaultAddressCity,
    tax_residence = defaultTaxResidence,
    tax_identification_number = `${numbersGenerator()}`,
  } = clientData
  try {
    const resp = await createAccountVirtual(api, { country_code })
    const { oauthToken } = resp
    await api.account(oauthToken) // API authentication

    const clientDetailsPayload = {
      new_account_real,
      non_pep_declaration,
      account_opening_reason,
      currency,
      place_of_birth: country_code,
      residence: country_code,
      first_name,
      last_name,
      date_of_birth,
      phone,
      address_line_1,
      address_city,
      tax_residence,
      tax_identification_number,
    }

    const response = await api.basic.newAccountReal(clientDetailsPayload)
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
