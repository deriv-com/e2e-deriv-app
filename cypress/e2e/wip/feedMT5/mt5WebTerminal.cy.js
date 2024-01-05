/// <reference types ="cypress" />


it('open mt5 web terminal', () => {

    //cy.visit('https://mt5-demo-web.deriv.com/terminal');
    //cy.visit('https://mt5-real01-web.deriv.com/');
    cy.visit('https://mt5-real01-web.regentmarkets.com/');
    cy.get('.accept-button').click();
    cy.get('[title="Enter Login"] > .svelte-1hckigs').type('');
    cy.get('.password > .input > .svelte-1hckigs').type('');
    cy.wait(2000);
    cy.get('.footer > .button').click();
    cy.viewport(1024, 768);
    cy.get('.active > :nth-child(1) > .name > .text').should('be.visible');

    //Check price streaming on "Synthetic market"
    //Check feed streaming for "Volatility 50 Index" symbol
    cy.get('[title="Volatility 50 Index"] > :nth-child(1) > .name > .text').invoke('text').then((text) => {
        cy.log(`checking Feed streaming for the Symbol: ' ${text}`)

        // Get bid prices at time t1,t2 and check if feed is streaming properly
        cy.get('.active > :nth-child(2) > .value').invoke('text').then((text) => {
            const bid_t1 = text;
            cy.log('1st bid value is: ' + bid_t1);
 
            cy.wait(8000)
 
            cy.get('.active > :nth-child(2) > .value').invoke('text').then((text) => {
                const bid_t2 = text;
                cy.log('2nd bid value is: ' + bid_t2);
 
                cy.log('*******************************')
                cy.log('Price Streaming(bid) on Synthetic market symbol is', bid_t1 === bid_t2 ? 'Not Working' : 'Working fine' )
                cy.log('*******************************')
            })
        });
 
        // Get ask prices at time t1,t2 and check if feed is streaming properly
        cy.get('.active > :nth-child(3) > .value').invoke('text').then((text) => {
            const ask_t1 = text;
            cy.log('1st ask value is: ' + ask_t1);
  
            cy.wait(8000)
  
            cy.get('.active > :nth-child(2) > .value').invoke('text').then((text) => {
                const ask_t2 = text;
                cy.log('2nd ask value is: ' + ask_t2);
  
                cy.log('*******************************')
                cy.log('Price Streaming(ask) on Synthetic market is:', ask_t1 === ask_t2 ? 'Not Working' : 'Working fine' )
                cy.log('*******************************')
            })
        });
    }) 

    //*******************************************************************************************************
    //Check price streaming on "Forex market" and other markets
    //*******************************************************************************************************

    cy.get('[slot="target"] > .icon-button').click()
    cy.wait(1000)
    cy.get(':nth-child(2) > .item').click()
    cy.wait(2000)
    cy.get('[title="Connect to account"]').click()
    cy.get('[title="Enter Login"] > .svelte-1hckigs').clear().type('')
    cy.get('.password > .input > .svelte-1hckigs').clear().type('')
    cy.wait(1000)
    cy.get('.footer > .button').click();
    cy.get('.active > :nth-child(1) > .name > .text').should('be.visible')
    
    //******************************************************************************
    //Check price streaming on "GBPNOK" - forex minor (Bloomberg provider symbol)
    //******************************************************************************
    cy.get('input.svelte-1nc9ygh').type('GBPNOK')
    cy.get('.symbol').should('be.visible')

    if (cy.get('.item > .checked').should('have.class','checked')){
        cy.log('symbol is already added to the watchlist')
        cy.get('.close').click()
    }
    else  {
        cy.get('.icon.svelte-6nbdup > .icon > svg').click()
        cy.get('.close').click()
    }  

    cy.get('[title="GBPNOK"] > :nth-child(1) > .name > .text').invoke('text').then((text) => {
        cy.log(`checking Feed streaming for the Symbol: ' ${text}`)

        // Get bid prices at time t1,t2 and check if feed is streaming properly
        cy.get('[title="GBPNOK"] > :nth-child(2) > .value').invoke('text').then((text) => {
            const bid_t1 = text;
            cy.log('1st GBPNOK-bid value is: ' + bid_t1);
 
            cy.wait(8000)
 
            cy.get('[title="GBPNOK"] > :nth-child(2) > .value').invoke('text').then((text) => {
                const bid_t2 = text;
                cy.log('2nd GBPNOK-bid value is: ' + bid_t2);
 
                cy.log('*******************************')
                cy.log('Price Streaming(bid) on Financial market symbol(forex minor) is', bid_t1 === bid_t2 ? 'Not Working' : 'Working fine' )
                cy.log('*******************************')
            })
        });

        // Get ask prices at time t1,t2 and check if feed is streaming properly
        cy.get('[title="GBPNOK"] > :nth-child(3) > .value').invoke('text').then((text) => {
            const ask_t1 = text;
            cy.log('1st GBPNOK-ask value is: ' + ask_t1);
  
            cy.wait(8000)
  
            cy.get('[title="GBPNOK"] > :nth-child(3) > .value').invoke('text').then((text) => {
                const ask_t2 = text;
                cy.log('2nd GBPNOK-ask value is: ' + ask_t2);
  
                cy.log('*******************************')
                cy.log('Price Streaming(ask) on Financial market symbol(forex minor) is', ask_t1 === ask_t2 ? 'Not Working' : 'Working fine' )
                cy.log('*******************************')
            })
        });

    })

    //***********************************************************************************
    //Check price streaming on "AUDUSD" - forex major
    //***********************************************************************************
    cy.get('input.svelte-1nc9ygh').type('AUDUSD')
    cy.get('.symbol').should('be.visible')

    if (cy.get('.item > .checked').should('have.class','checked')){
        cy.log('symbol is already added to the watchlist')
        cy.get('.close').click()
    }
    else  {
        cy.get('.icon.svelte-6nbdup > .icon > svg').click()
        cy.get('.close').click()
    }  
       
    cy.get('[title="AUDUSD"] > :nth-child(1) > .name > .text').invoke('text').then((text) => {
        cy.log(`checking Feed streaming for the Symbol: ' ${text}`)

        // Get bid prices at time t1,t2 and check if feed is streaming properly
        cy.get('[title="AUDUSD"] > :nth-child(2) > .value').invoke('text').then((text) => {
            const bid_t1 = text;
            cy.log('1st AUDUSD-bid value is: ' + bid_t1);
 
            cy.wait(8000)
 
            cy.get('[title="AUDUSD"] > :nth-child(2) > .value').invoke('text').then((text) => {
                const bid_t2 = text;
                cy.log('2nd AUDUSD-bid value is: ' + bid_t2);
 
                cy.log('*******************************')
                cy.log('Price Streaming(bid) on Financial market symbol(forex major) is', bid_t1 === bid_t2 ? 'Not Working' : 'Working fine' )
                cy.log('*******************************')
            })
        });

        // Get ask prices at time t1,t2 and check if feed is streaming properly
        cy.get('[title="AUDUSD"] > :nth-child(3) > .value').invoke('text').then((text) => {
            const ask_t1 = text;
            cy.log('1st AUDUSD-ask value is: ' + ask_t1);
  
            cy.wait(8000)
  
            cy.get('[title="AUDUSD"] > :nth-child(3) > .value').invoke('text').then((text) => {
                const ask_t2 = text;
                cy.log('2nd AUDUSD-ask value is: ' + ask_t2);
  
                cy.log('*******************************')
                cy.log('Price Streaming(ask) on Financial market symbol(forex major) is', ask_t1 === ask_t2 ? 'Not Working' : 'Working fine' )
                cy.log('*******************************')
            })
        });
    })

    //***********************************************************************************
    //Check price streaming on Commodities market symbol "XPTUSD" -  idata provider
    //***********************************************************************************
    cy.get('input.svelte-1nc9ygh').type('XPTUSD')
    cy.get('.symbol').should('be.visible')

    if (cy.get('.item > .checked').should('have.class','checked')){
        cy.log('symbol is already added to the watchlist')
        cy.get('.close').click()
    }
    else  {
        cy.get('.icon.svelte-6nbdup > .icon > svg').click()
        cy.get('.close').click()
    }  
       
    cy.get('[title="XPTUSD"] > :nth-child(1) > .name > .text').invoke('text').then((text) => {
        cy.log(`checking Feed streaming for the Symbol: ' ${text}`)

        // Get bid prices at time t1,t2 and check if feed is streaming properly
        cy.get('[title="XPTUSD"] > :nth-child(2) > .value').invoke('text').then((text) => {
            const bid_t1 = text;
            cy.log('1st XPTUSD-bid value is: ' + bid_t1);
 
            cy.wait(10000)
 
            cy.get('[title="XPTUSD"] > :nth-child(2) > .value').invoke('text').then((text) => {
                const bid_t2 = text;
                cy.log('2nd XPTUSD-bid value is: ' + bid_t2);
 
                cy.log('*******************************')
                cy.log('Price Streaming(bid) on commodities market symbol(idata) is', bid_t1 === bid_t2 ? 'Not Working' : 'Working fine' )
                cy.log('*******************************')
            })
        });

        // Get ask prices at time t1,t2 and check if feed is streaming properly
        cy.get('[title="XPTUSD"] > :nth-child(3) > .value').invoke('text').then((text) => {
            const ask_t1 = text;
            cy.log('1st XPTUSD-ask value is: ' + ask_t1);
  
            cy.wait(10000)
  
            cy.get('[title="XPTUSD"] > :nth-child(3) > .value').invoke('text').then((text) => {
                const ask_t2 = text;
                cy.log('2nd XPTUSD-ask value is: ' + ask_t2);
  
                cy.log('*******************************')
                cy.log('Price Streaming(ask) on commodities market symbol(idata) is', ask_t1 === ask_t2 ? 'Not Working' : 'Working fine' )
                cy.log('*******************************')
            })
        });
    })

    //***********************************************************************************
    //Check price streaming on Commodities market symbol "XAGUSD" -  Bloomberg provider
    //***********************************************************************************
    cy.get('input.svelte-1nc9ygh').type('XAGUSD')
    cy.get('.symbol').should('be.visible')

    if (cy.get('.item > .checked').should('have.class','checked')){
        cy.log('symbol is already added to the watchlist')
        cy.get('.close').click()
    }
    else  {
        cy.get('.icon.svelte-6nbdup > .icon > svg').click()
        cy.get('.close').click()
    } 
       
    cy.get('[title="XAGUSD"] > :nth-child(1) > .name > .text').invoke('text').then((text) => {
        cy.log(`checking Feed streaming for the Symbol: ' ${text}`)

        // Get bid prices at time t1,t2 and check if feed is streaming properly
        cy.get('[title="XAGUSD"] > :nth-child(2) > .value').invoke('text').then((text) => {
            const bid_t1 = text;
            cy.log('1st XAGUSD-bid value is: ' + bid_t1);
 
            cy.wait(10000)
 
            cy.get('[title="XAGUSD"] > :nth-child(2) > .value').invoke('text').then((text) => {
                const bid_t2 = text;
                cy.log('2nd XAGUSD-bid value is: ' + bid_t2);
 
                cy.log('*******************************')
                cy.log('Price Streaming(bid) on commodities market symbol(Bloomberg) is', bid_t1 === bid_t2 ? 'Not Working' : 'Working fine' )
                cy.log('*******************************')
            })
        });

        // Get ask prices at time t1,t2 and check if feed is streaming properly
        cy.get('[title="XAGUSD"] > :nth-child(3) > .value').invoke('text').then((text) => {
            const ask_t1 = text;
            cy.log('1st XAGUSD-ask value is: ' + ask_t1);
  
            cy.wait(10000)
  
            cy.get('[title="XAGUSD"] > :nth-child(3) > .value').invoke('text').then((text) => {
                const ask_t2 = text;
                cy.log('2nd XAGUSD-ask value is: ' + ask_t2);
  
                cy.log('*******************************')
                cy.log('Price Streaming(ask) on commodities market symbol(Bloomberg) is', ask_t1 === ask_t2 ? 'Not Working' : 'Working fine' )
                cy.log('*******************************')
            })
        });
    })

    //***********************************************************************************
    //- Check price streaming on Stock indices market symbol "AUS_200" -  oz provider
    //***********************************************************************************
    cy.get('input.svelte-1nc9ygh').type('AUS_200')
    cy.get('.symbol').should('be.visible')
    
    if (cy.get('.item > .checked').should('have.class','checked')){
        cy.log('symbol is already added to the watchlist')
        cy.get('.close').click()
    }
    else  {
        cy.get('.icon.svelte-6nbdup > .icon > svg').click()
        cy.get('.close').click()
    }  
       
    cy.get('[title="AUS_200"] > :nth-child(1) > .name > .text').invoke('text').then((text) => {
        cy.log(`checking Feed streaming for the Symbol: ' ${text}`)

        // Get bid prices at time t1,t2 and check if feed is streaming properly
        cy.get('[title="AUS_200"] > :nth-child(2) > .value').invoke('text').then((text) => {
            const bid_t1 = text;
            cy.log('1st AUS_200-bid value is: ' + bid_t1);
 
            cy.wait(8000)
 
            cy.get('[title="AUS_200"] > :nth-child(2) > .value').invoke('text').then((text) => {
                const bid_t2 = text;
                cy.log('2nd AUS_200-bid value is: ' + bid_t2);
 
                cy.log('*******************************')
                cy.log('Price Streaming(bid) on Stock indices market symbol(oz) is', bid_t1 === bid_t2 ? 'Not Working' : 'Working fine' )
                cy.log('*******************************')
            })
        });

        // Get ask prices at time t1,t2 and check if feed is streaming properly
        cy.get('[title="AUS_200"] > :nth-child(3) > .value').invoke('text').then((text) => {
            const ask_t1 = text;
            cy.log('1st AUS_200-ask value is: ' + ask_t1);
  
            cy.wait(8000)
  
            cy.get('[title="AUS_200"] > :nth-child(3) > .value').invoke('text').then((text) => {
                const ask_t2 = text;
                cy.log('2nd AUS_200-ask value is: ' + ask_t2);
  
                cy.log('*******************************')
                cy.log('Price Streaming(ask) on Stock indices market symbol(oz) is', ask_t1 === ask_t2 ? 'Not Working' : 'Working fine' )
                cy.log('*******************************')
            })
        });
    })

})