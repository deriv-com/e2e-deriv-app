class mt5{
    elements = {
        mt5SwapFreeTxt: () => cy.findByText('Swap-Free', { exact: true }),
        //mt5GetBtn: () => cy.get('.dc-btn--primary__light').eq(2),
        mt5GetBtn: () => cy.get('.dc-text.title:contains("Swap-Free")').closest('.trading-app-card__container').find('.trading-app-card__actions .dc-btn--primary__light'),
        svgJurModal: () => cy.findByTestId('dt-jurisdiction-modal-content').contains('St. Vincent & Grenadines'),
        swapFootNote: () => cy.findByTestId('dt-jurisdiction-footnote').contains('MT5 Swap-Free'),
        nextBtn: () => cy.findByRole('button', {name: 'Next'}),
        mt5PassInput: () => cy.findByTestId('dt_mt5_password'),
        mt5CreateBtn: () => cy.findByRole('button', { name: 'Create Deriv MT5 password' }),
        mt5SuccessMsg: () => cy.findByRole('heading', { name: 'Success!' }),
        maybeLaterBtn: () => cy.findByRole('button', { name: 'Maybe later' }),
        mt5SwapFreeTitle: () => cy.findByTestId('dt_traders_hub').contains('Swap-FreeSVG'),

        mt5DerivedTxt : () => cy.findByText('Derived', { exact: true }),
        mt5DerivedGetBtn: () => cy.get('.dc-text.title:contains("Derived")').closest('.trading-app-card__container').find('.trading-app-card__actions .dc-btn--primary__light'),
        mt5DerivedOpenBtn: () => cy.contains('.trading-app-card__container', 'Derived').parent().find('.trading-app-card__actions').contains('button', 'Open'),
        mt5ResetPassword: () => cy.findByRole('button', { name: 'Forgot password?' }),
        mt5ChangePassword: () => cy.findByRole('button', { name: 'Change password' }),
        mt5ConfirmChangePassword: () => cy.findByRole('button', { name: 'Confirm' })
    }
}
module.exports = new mt5();