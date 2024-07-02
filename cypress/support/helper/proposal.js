require('dotenv').config()

const priceData = require('../../fixtures/api/apiFixture.json')

const {
  proposal,
  amount,
  barrier,
  basis,
  contract_type,
  currency,
  duration,
  duration_unit,
  symbol,
} = priceData.priceProposal

/**
 * Method to Create Price Proposal
 * @param {*} api
 * @returns Price Proposal ID
 */
const createPriceProposalID = async (api) => {
  try {
    const priceProposalPayLoad = {
      proposal,
      amount,
      barrier,
      basis,
      contract_type,
      currency,
      duration,
      duration_unit,
      symbol,
    }

    const priceProposal = await api.basic.proposal(priceProposalPayLoad)
    console.log('The Price Proposal Id is : ', priceProposal.proposal.id)
    return priceProposal.proposal.id
  } catch (e) {
    console.error('Operation failed', e)
    throw e
  }
}
module.exports = { createPriceProposalID }
