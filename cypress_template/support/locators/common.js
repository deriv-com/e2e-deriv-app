
export const commonPageLocators ={
        header: {
            platformSwitcherBtn: () => cy.findByTestId('dt_platform_switcher'),
            tradersHubBtn: () => cy.findByText('Trader\'s Hub'),
            cashierBtn: () => cy.findByRole('link', { name: 'Cashier' }),
            loginBtn: () => cy.findByRole('button', { name: 'Log in' }),
            signupBtn: () => cy.findByRole("button", { name: "Sign up" }),
            onboardingBtn: () => cy.findByTestId('dt_traders_hub_onboarding_icon'),
            notificationBtn: () => cy.findByTestId('dt_traders_hub_show_notifications'),
            accountSettingsBtn: () => cy.get('a[href="/account/personal-details"]'),
            accountInfoDropdownBtn: () => cy.findByTestId('dt_acc_info'),
            depositBtn: () => cy.findByRole('button', { name: 'Deposit' }),
            recentPositionsToggleBtn: () => cy.findByTestId('dt_positions_toggle'),
            responsive:{
                hamburgerMenuButton : () => cy.get('[id="dt_mobile_drawer_toggle"]'),
                menuSection : () => cy.get('[id="dt_mobile_drawer"]'),
            }
        },
        footer: {
            serverEndpointStatus: (serverEndpoint) => cy.findByText(`The server endpoint is: ${serverEndpoint.toLowerCase()}`),
            networkStatusIndicator: () => cy.findByTestId('dt_network_status'),
            whatsappBtn: () => cy.findByLabel('WhatsApp'),
            derivComRedirectBtn: () => cy.get('a[href="https://deriv.com/"]'),
            responsibleTradingRedirectBtn: () => cy.get('a[href="https://deriv.com/responsible"]'),
            helpCenterBtn: () => cy.findByLabel('Help centre'),
            //dTraderSettingsBtn: () => cy.findByTestId('dt_toggle_settings'), //should go in the tradershub footer.
            languageSettingsBtn: () => cy.findByTestId('dt_toggle_language_settings'),
            fullScreenBtn: () => cy.findByTestId('dt_fullscreen_toggle'),
            themeBtn: () => cy.locator('.footer__links--dark-mode'),
            responsive:{

            },
        },
        loader: ()=> cy.get('div[data-testid="dt_initial_loader"]'),
        responsive:{
            header:{
                // We can also use this instead of line 15 to line 18
            },
            footer:{
                // We can also use this instead of line31 to line 33
            }
        }
}
