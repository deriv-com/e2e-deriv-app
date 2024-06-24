require('dotenv').config()

/**
 * Method to call authorize api. Need to pass api and authToken from login as parameter
 * @param {Method } api
 * @param {*} authToken
 * @returns
 */
const authorizeCall = async (api, authToken) => {
  try {
    const emailToVerify = await api.account(authToken) // API authentication

    return emailToVerify.email
  } catch (e) {
    console.error('Operation failed', e)
    throw e
  }
}

/**
 * Method to check Balance using Balance api call. This Balance call has to be combined along with Authorize else it will fail
 * @param {*} api
 * @returns
 */
const checkBalance = async (api) => {
  try {
    const availableBal = await api.basic.balance()

    return availableBal.balance.balance
  } catch (e) {
    console.error('Operation failed', e)
    throw e
  }
}

module.exports = { authorizeCall, checkBalance }
