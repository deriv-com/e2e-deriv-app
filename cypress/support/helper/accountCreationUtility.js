require('dotenv').config()
const data = require('../../fixtures/common/common.json')
const { new_account_real, non_pep_declaration, account_opening_reason } =
  data.defaultCRDetails

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
      ...data.defaultVRDetails,
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

const createAccountReal = async (api, clientData = {}) => {
  const {
    country_code,
    currency,
    first_name = data.defaultCRDetails.first_name,
    last_name = nameGenerator(),
    date_of_birth = data.defaultCRDetails.date_of_birth,
    phone = `+${numbersGenerator()}`,
    address_line_1 = data.defaultCRDetails.address_line_1,
    tax_residence = data.defaultCRDetails.tax_residence,
    tax_identification_number = `${numbersGenerator()}`,
  } = clientData
  try {
    const resp = await createAccountVirtual(api, country_code)
    const { oauthToken } = resp
    await api.account(oauthToken) // API authentication

    const clientDetails = {
      new_account_real: data.defaultCRDetails.new_account_real,
      non_pep_declaration: data.defaultCRDetails.non_pep_declaration,
      account_opening_reason: data.defaultCRDetails.account_opening_reason,
      currency: currency,
      place_of_birth: country_code,
      residence: country_code,
      first_name: first_name,
      last_name: last_name,
      date_of_birth: date_of_birth,
      phone: phone,
      address_line_1: address_line_1,
      address_city: data.defaultCRDetails.address_city,
      tax_residence: tax_residence,
      tax_identification_number: tax_identification_number,
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
