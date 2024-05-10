require('dotenv').config()
const crypto = require('crypto')

const scopeParams = [
  'read',
  'trade',
  'payments',
  'trading_information',
  'admin',
]

/**
 * Method to register a new application id / appid. This call requires authorize call to be called first
 * @param {Method } api
 * @param {*} appRegisterID
 * @param {*} appRegisterHomePage
 * @param {*} appRegisterReDirectUri
 * @param {*} appRegisterVerificationUri
 * @returns appid
 */
const registerNewApplicationId = async (
  api,
  appRegisterID,
  appRegisterHomePage,
  appRegisterReDirectUri,
  appRegisterVerificationUri
) => {
  try {
    const registerAppResponse = await api.basic.appRegister({
      app_register: appRegisterID,
      homepage: appRegisterHomePage,
      name: registerName(),
      redirect_uri: appRegisterReDirectUri,
      scopes: scopeParams,
      verification_uri: appRegisterVerificationUri,
    })
    console.log(
      'The New Application is Registered. The Id is : ',
      registerAppResponse.app_register.app_id
    )
    return registerAppResponse.app_register.app_id
  } catch (e) {
    console.error('Operation failed', e)
    throw e
  }
}

/**
 * Method to generate 4-digit random number to be used for providing AppName to appid
 * @returns 4-digit random runber
 */
const registerName = () => {
  const randomNumber = crypto.randomInt(0, 10000)
  return `AppName${randomNumber}`
}

module.exports = { registerNewApplicationId }
