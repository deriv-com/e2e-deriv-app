export const cashierPageLocators = {
    depositMenuButton: ()=> cy.findByRole('link', { name: 'Deposit' }),
    withdrawalMenuButton: ()=> cy.findByRole('link', { name: 'Withdrawal' }),
    paymentAgentsMenuButton: ()=> cy.findByRole('link', { name: 'Payment Agents' }),
    transferMenuButton: ()=> cy.findByRole('link', { name: 'Transfer' }),
    derivP2pMenuButton: ()=> cy.findByRole('link', { name: 'Deriv P2P' }),
    deposit:{

    },
    withdrawal:{
        verifyWithdrawalRequestTitle : ()=> cy.findByTestId('dt_empty_state_title'),
        verifyWithdrawalRequestDescription : ()=> cy.findByTestId('dt_empty_state_description'),
        sendEmailButton: ()=> cy.findByRole('button', { name: 'Send email' }),
        didntRecieveEmailButton: ()=> cy.findByRole('button', { name: "Didn't receive the email?" }),

    },
    responsive:{
        
    }
}