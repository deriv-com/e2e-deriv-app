require('dotenv').config()

/**
 * Method to Create Price Proposal
 * @param {*} api
 * @returns Price Proposal ID
 */
const createPriceProposalID = async (
  api,
  priceProposalAmount,
  priceProposalBarrier,
  priceProposalBasis,
  priceProposalContractType,
  priceProposalCurrency,
  priceProposalDuration,
  priceProposalDurationUnit,
  priceProposalSymbol
) => {
  try {
    const priceProposal = await api.basic.proposal({
      proposal: 1,
      amount: priceProposalAmount,
      barrier: priceProposalBarrier,
      basis: priceProposalBasis,
      contract_type: priceProposalContractType,
      currency: priceProposalCurrency,
      duration: priceProposalDuration,
      duration_unit: priceProposalDurationUnit,
      symbol: priceProposalSymbol,
    })
    console.log('The Price Proposal Id is : ', priceProposal.proposal.id)

    return priceProposal.proposal.id
  } catch (e) {
    console.error('Operation failed', e)
    throw e
  }
}
module.exports = { createPriceProposalID }
