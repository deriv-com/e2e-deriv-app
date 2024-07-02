require('dotenv').config()
const data = require('../../fixtures/common/common.json')
const {
  emailGenerator,
  numbersGenerator,
  nameGenerator,
} = require('./commonJsUtility')

const {
  non_pep_declaration,
  account_opening_reason,
  currency: defaultCurrency,
  first_name: defaultFirstName,
  date_of_birth: defaultDateOfBirth,
  address_line_1: defaultAddressLine1,
  address_city: defaultAddressCity,
  tax_residence: defaultTaxResidence,
} = data.commonDefaults

const {
  new_account_virtual,
  type: defaultAccountType,
  country_code: defaultVRCountryCode,
} = data.defaultVRDetails

const { new_account_real, country_code: defaultCRCountryCode } =
  data.defaultCRDetails

const {
  new_account_maltainvest,
  accept_risk,
  country_code: defaultMFCountryCode,
  salutation,
  education_level,
  account_turnover,
  source_of_wealth,
  occupation,
  employment_status,
  employment_industry,
  income_source,
  net_income,
  estimated_worth,
  risk_tolerance,
  source_of_experience,
  trading_experience_financial_instruments,
  trading_frequency_financial_instruments,
  cfd_experience,
  cfd_frequency,
  cfd_trading_definition,
  leverage_impact_trading,
  leverage_trading_high_risk_stop_loss,
  required_initial_margin,
} = data.defaultMFDetails

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
    country_code = defaultVRCountryCode,
    client_password = process.env.E2E_DERIV_PASSWORD,
    type = defaultAccountType,
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

const createAccountCR = async (api, clientData = {}) => {
  const {
    country_code = defaultCRCountryCode,
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
      citizen: country_code,
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

const createAccountMF = async (api, clientData = {}) => {
  const {
    country_code = defaultMFCountryCode,
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
      new_account_maltainvest,
      non_pep_declaration,
      account_opening_reason,
      currency,
      place_of_birth: country_code,
      residence: country_code,
      citizen: country_code,
      first_name,
      last_name,
      date_of_birth,
      phone,
      address_line_1,
      address_city,
      tax_residence,
      tax_identification_number,
      accept_risk,
      salutation,
      education_level,
      account_turnover,
      source_of_wealth,
      occupation,
      employment_status,
      employment_industry,
      income_source,
      net_income,
      estimated_worth,
      risk_tolerance,
      source_of_experience,
      trading_experience_financial_instruments,
      trading_frequency_financial_instruments,
      cfd_experience,
      cfd_frequency,
      cfd_trading_definition,
      leverage_impact_trading,
      leverage_trading_high_risk_stop_loss,
      required_initial_margin,
    }

    const response = await api.basic.newAccountMaltainvest(clientDetailsPayload)
    const {
      new_account_maltainvest: { client_id },
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

module.exports = {
  createAccountMF,
  createAccountCR,
  createAccountVirtual,
  verifyEmail,
}
