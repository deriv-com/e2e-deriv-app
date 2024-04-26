require('dotenv').config()

const authorizeCall = async (api, authToken) => {
  try {
    await api.account(authToken) // API authentication
  } catch (e) {
    console.error('Operation failed', e)
    throw e
  }
}

const checkBalance = async (api, authToken) => {
  try {
    const authorizeAccount = await api.account(authToken)
    console.log('This is Authorization Stream: ', authorizeAccount)

    // Account also provides a balance stream
    const balance_stream = await api.basic.balance()
    console.log('This is Balance Stream: ', balance_stream)
  } catch (e) {
    console.error('Operation failed', e)
    throw e
  }
}

module.exports = { authorizeCall, checkBalance }
