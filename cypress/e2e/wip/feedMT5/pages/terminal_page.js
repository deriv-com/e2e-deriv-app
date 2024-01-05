export class TerminalPage{

   
    checkSymbolInWatchlist(){
        cy.get('input.svelte-1nc9ygh').type('GBPNOK')
        cy.wait(1000)
    
        if (cy.get('.item > .checked').should('have.class','checked')){
            cy.log('symbol is already added to the watchlist')
            cy.get('.close').click()
        }
        else  {
            cy.get('.icon.svelte-6nbdup > .icon > svg').click()
            cy.get('.close').click()
        } 
     }


     
   
   
    
}