require('dotenv').config()

/**
 * Method to Create Price Proposal
 * @param {*} api
 * @returns Price Proposal ID
 */
const createPriceProposalID = async (api) => {
  try {
    const priceProposal = await api.basic.proposal({
      proposal: 1,
      amount: 100,
      barrier: '+0.1',
      basis: 'payout',
      contract_type: 'CALL',
      currency: 'USD',
      duration: 60,
      duration_unit: 's',
      symbol: 'R_100',
    })
    console.log('The Price Proposal Id is : ', priceProposal.proposal.id)

    return priceProposal.proposal.id
  } catch (e) {
    console.error('Operation failed', e)
    throw e
  }
}
module.exports = { createPriceProposalID }
