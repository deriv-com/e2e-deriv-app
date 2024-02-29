export const tradersHubPageLocators = {
    optionsAndMutipliersSection: () => cy.contains('div[id="traders-hub"] span', 'Options & Multipliers'),
    cfdsSection: () => cy.contains('div[id="traders-hub"] span', 'CFDs'),
    responsive: {
        optionsAndMultipliersButton: ()=> cy.findByRole('button', { name: 'Options & Multipliers' }),
        cfdsButton: ()=> cy.findByRole('button', { name: 'CFDs' }),
        optionsAndMutipliersSectionContent: () => cy.contains('div[data-testid="dt_traders_hub"] span', 'Earn a range of payouts by correctly predicting market movements with options, or get the upside of CFDs without risking more than your initial stake with multipliers.'),
        cfdsSectionContent: () => cy.contains('div[data-testid="dt_traders_hub"] span', 'Trade with leverage and tight spreads for better returns on successful trades. Learn more'),
    }
}