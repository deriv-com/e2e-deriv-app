import '@testing-library/cypress/add-commands'

describe('QATEST-1279 - Navigation Responsive - Menu items - EU and ROW (Including Trade Types)', () => {

    //Click through menu-items and ensure links are vaild and load the next page. 
    it('ROW menu items', () => {

      //NB. The region switch doesn't work on the EU site at the moment.
      if (Cypress.env('skipROWTests') == false)
        {
        cy.c_visitResponsive(Cypress.env('RegionROW'), 'small') //See custom command for details

        //Trade Types
        cy.findByRole('img', { name: 'hamburger menu' }).click()
        cy.findByRole('button', { name: 'Trade chevron' }).click({force: true})
        cy.findByRole('link', { name: 'Options trade type Options Earn a range of payouts without risking more than your initial stake.' }).click()
        cy.findByRole('heading', { name: 'What are digital options?' }).should('be.visible')

        //Trade Platforms

        cy.findByRole('img', { name: 'hamburger menu' }).click()
        cy.findByRole('button', { name: 'Trade chevron' }).click({force: true})
        cy.findByRole('link', { name: 'Deriv X trading paltform Deriv X A highly customisable and easy-to-use CFD trading platform.' }).click()
        cy.findByRole('img', { name: 'Deriv X', exact: true }).should('be.visible')

        cy.findByRole('img', { name: 'hamburger menu' }).click()
        cy.findByRole('button', { name: 'Trade chevron' }).click({force: true})
        cy.findByRole('link', { name: 'Deriv EZ trading paltform Deriv EZ Trade on global markets from anywhere with our mobile-first CFD trading platform.' }).click()
        cy.findByRole('img', { name: 'Deriv EZ', exact: true }).should('be.visible')

        cy.findByRole('img', { name: 'hamburger menu' }).click()
        cy.findByRole('button', { name: 'Trade chevron' }).click({force: true})
        cy.findByRole('link', { name: 'SmartTrader trading platform SmartTrader Trade the world’s markets with our popular user-friendly platform.' }).should('exist') //NB. Not always open, so don't click for now.
        cy.findByRole('img', { name: 'close menu' }).click()
        cy.c_visitResponsive(Cypress.env('RegionROW'), 'small') //NB. Elements often disappear at this stage, so do a page refresh as a workaorund. The new HK site should overcome this, so it's not worth putting much effort in here now.

        cy.findByRole('img', { name: 'hamburger menu' }).click()
        cy.findByRole('button', { name: 'Trade chevron' }).click({force: true})
        cy.findByRole('link', { name: 'Deriv cTrader trading platform Deriv cTrader Advance trading, charting and technical analysis tools available for users.' }).click()
        cy.findByRole('img', { name: '_t_Deriv ctrader logo_t_' }).should('be.visible')

        cy.findByRole('img', { name: 'hamburger menu' }).click()
        cy.findByRole('button', { name: 'Trade chevron' }).click({force: true})
        cy.findByRole('link', { name: 'Deriv GO mobile trading app Deriv GO Trade multipliers on forex, cryptocurrencies, and synthetic indices with our mobile app.' }).click()
        cy.findByRole('img', { name: 'Deriv Go', exact: true }).should('be.visible')

        cy.findByRole('img', { name: 'hamburger menu' }).click()
        cy.findByRole('button', { name: 'Trade chevron' }).click({force: true})
        cy.findByRole('link', { name: 'Deriv Bot Automated trading Deriv Bot Automated trading at your fingertips. No coding needed.' }).click()
        cy.findByRole('img', { name: 'Deriv Bot' }).should('be.visible')

        cy.findByRole('img', { name: 'hamburger menu' }).click()
        cy.findByRole('button', { name: 'Trade chevron' }).click({force: true})
        cy.findByRole('link', { name: 'Binary bot for creating trading bot Binary Bot Our classic "drag-and-drop" tool for creating trading bots, featuring pop-up trading charts, for advanced users.' }).should('exist') //NB. Not always open, so don't click for now.
        cy.findByRole('img', { name: 'close menu' }).click()

        //Markets
        cy.c_visitResponsive(Cypress.env('RegionROW'), 'small') //See custom command for details
        cy.findByRole('img', { name: 'hamburger menu' }).click()
        cy.findByRole('button', { name: 'Markets chevron' }).click({force: true})
        cy.findByRole('link', { name: 'Exchange-traded funds (ETFs) Exchange-traded funds (ETFs) Diversify your portfolio and enjoy low-cost intraday trading with ETFs.' }).click()
        cy.findByRole('heading', { name: 'Exchange-traded funds' }).should('be.visible')

        //Partners
        cy.findByRole('img', { name: 'hamburger menu' }).click()
        cy.findByRole('button', { name: 'Partners chevron' }).click()
        cy.findByRole('link', { name: 'Deriv Prime' }).should('be.visible')
        cy.findByRole('img', { name: 'close menu' }).click()
  
        cy.findByRole('img', { name: 'hamburger menu' }).click()
        cy.findByRole('button', { name: 'Partners chevron' }).click()
        cy.findByRole('link', { name: 'Affiliates and IBs' }).should('be.visible')
        cy.findByRole('img', { name: 'close menu' }).click()

        cy.findByRole('img', { name: 'hamburger menu' }).click()
        cy.findByRole('button', { name: 'Partners chevron' }).click()
        cy.findByRole('link', { name: 'Payment agents' }).should('be.visible')
        cy.findByRole('img', { name: 'close menu' }).click()
  
        cy.findByRole('img', { name: 'hamburger menu' }).click()
        cy.findByRole('button', { name: 'Partners chevron' }).click()
        cy.findByRole('link', { name: 'API', exact: true }).should('be.visible')
        cy.findByRole('img', { name: 'close menu' }).click()

        }

    })
})

