require('dotenv').config()

/**
 * Method to Create a Buy Contract
 * @param {*} api
 * @param {*} priceProposalId
 * @returns Balance After The Contract Is Brought
 */
const createBuyContract = async (api, priceProposalId, priceProposalAmount) => {
  try {
    const buyContract = await api.basic.buy({
      buy: priceProposalId,
      price: priceProposalAmount,
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
