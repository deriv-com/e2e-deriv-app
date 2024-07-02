require('dotenv').config()

const buyData = require('../../fixtures/api/apiFixture.json')

const { price } = buyData.buyContract

/**
 * Method to Create a Buy Contract
 * @param {*} api
 * @param {*} priceProposalId
 * @returns Balance After The Contract Is Bought
 */
const createBuyContract = async (api, priceProposalID) => {
  console.log('The Price Proposal Id is : ', priceProposalID)
  console.log('The Buy price is : ', price)
  try {
    const buyPayLoad = {
      buy: priceProposalID,
      price,
    }
    console.log('The Buy payload is : ', buyPayLoad)
    const buyContract = await api.basic.buy({
      buy: priceProposalID,
      price,
    })
    console.log(
      'The balance after buy contract is  : ',
      buyContract.buy.balance_after
    )
    return buyContract.buy.balance_after
  } catch (e) {
    console.error('Operation failed', e)
    throw e
  }
}
module.exports = { createBuyContract }
