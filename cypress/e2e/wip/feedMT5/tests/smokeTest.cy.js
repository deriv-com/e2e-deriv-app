import { LoginPage } from "../pages/login_page"
import { USERNAME1, PASSWORD1, USERNAME2, PASSWORD2, SYMBOL1 } from "../testdata"

//const loginpage = new LoginPage()

describe('Smoke test for MT5 Web Terminal', () => {

    const loginPage = new LoginPage();

    it('Login to Synthetic account', function() {
        //Login to Synthetic account
        cy.visit('https://mt5-real01-web.regentmarkets.com/')
        cy.get('.accept-button').click();
        cy.get('[title="Enter Login"] > .svelte-1hckigs').should('be.visible')
        loginPage.setUsername(USERNAME1);
        loginPage.setPassword(PASSWORD1);
        loginPage.clickLoginButton();
        cy.viewport(1024, 768);
        cy.get('.active > :nth-child(1) > .name > .text').should('be.visible');


    })


    it('Check price streaming on synthetic market', function(){
            //Check price streaming on "Synthetic market": Check feed streaming for "Volatility 50 Index" symbol
            checkSymbolInWatchlist(SYMBOL1)

    })


    it('Login to Financial account', function(){
        //

    })


    it('Check price streaming on Financial market', function(){
        //

    })

})