require('dotenv').config()

const authorizeCall = async (api, authToken) => {
  try {
    await api.account(authToken) // API authentication
  } catch (e) {
    console.error('Operation failed', e)
    throw e
  }
}

const checkBalance = async (api) => {
  try {
    const balance = await api.basic.balance()
    cy.log('The Balance is ------> : ', balance)
  } catch (e) {
    console.error('Operation failed', e)
    throw e
  }
}

module.exports = { authorizeCall, checkBalance }
