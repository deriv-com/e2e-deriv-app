import "@testing-library/cypress/add-commands"
function walletdefaultsorting(){
cy.contains("Add more Wallets")
cy.findByTestId('dt-wallets-add-more').scrollIntoView()

//To verify if all crypto wallets are sorted in the wallet carousel
cy.get('.wallets-add-more__card')
  .each($element => {
    // Filter wallets that contain only blockchain 
    const walletList = $element.filter((index, element) => {
    const allwalletText = Cypress.$(element).text()
    const cryptoText  = allwalletText.includes('blockchain') // crypto wallet list 
    const wallettoadd = allwalletText.includes('Add') // crypto wallet having Add 
    if (cryptoText) {
      if (wallettoadd) {
        return allwalletText // It will return the text having crypto and Add  // list the text of all crypto wallet having add button 
      } else {
        return allwalletText // It will return the text having crypto and not Add // list the text of all crypto wallet having added button 
      }
    }
      else if (wallettoadd) {
        return allwalletText // It will return the text having Fiat and Add button
      }
       else {
        return allwalletText // It will return the text having Fiat and not Add
       }
    })
     //Return only the crypto wallets in the wallet carousel
    // Extract text content of filtered wallets in an Array
    const CarouselList = walletList.toArray().map(element => Cypress.$(element).text());
    cy.log({CarouselList: CarouselList})
    //Check if the filtered wallets are sorted alphabetically
    const expectedSortedList = [...CarouselList].sort()
    expect(CarouselList).to.deep.equal(expectedSortedList)
    cy.log({expectedlist: expectedSortedList})
  })
}
  
// // //To verify if all Fiat wallets are sorted in the wallet carousel
//   cy.get('.wallets-add-more__card')
//     .each($element => {
//     // Filter wallets that does contain text "blockchain"
//     const fiatwalletList = $element.filter((index, element) => {
//     const walletList = Cypress.$(element).text()
//     const includesFiat = !walletList.includes('blockchain.');
//     const wallettoadd = allwalletText.includes('Add')
//     if (includesFiat && wallettoadd)
//     {
//       return allwalletText
//     }
    
//     return includesFiat  //Return only the Fiat wallets in the wallet carousel
//     })

//   // Extract text content of filtered wallets in an Array
//     const fiatCarouselList = fiatwalletList.toArray().map(element => Cypress.$(element).text())
//     cy.log({fiatCarouselList: fiatCarouselList})
//     // Check if the filtered wallets are sorted alphabetically
//     const expectedSortedFiatList = [...fiatCarouselList].sort()
//     expect(fiatCarouselList).to.deep.equal(expectedSortedFiatList)
//     cy.log({expectedlist: expectedSortedFiatList})
//   })

function addmorewallets(){
  // let currentIndex = 0
  cy.get('.wallets-add-more__card')
    .each(($element, index) => {
      cy.log({element: $element})
      cy.log({eachindex: index})
      cy.get($element)
        .findByRole('button')
        .then(($button) => {
          cy.log({button: $button})
          if ($button.is(':disabled')) {
            cy.log('Button is disabled')
          } else {
            cy.log(`Button at index ${index} is enabled`);
            cy.wait(1000)
            //index = 0
            cy.findByTestId('dt-wallets-add-more').scrollIntoView()
            cy.log({currentIndex: index})
            // cy.get($element)
              cy.wrap($button)
                .should('exist')
                .click({force: true})
            // currentIndex == 0
            cy.log({dcurrentIndex: index})

            let walletname
            cy.get('.wallets-card__details__bottom')
              .find('span')
              .eq(1)
              .invoke('text')
              .then((text) => {
                walletname = text.trim()
                cy.log({wallet: walletname})
                cy.findByRole('button', { name: 'Maybe later' }).click()
                cy.get('[class*="wallets-accordion wallets-accordion"]')
                  .contains(walletname) //tusdt = tusdt
                  .should('not.have.class', 'class="wallets-accordion__dropdown"')
          })
          cy.log({ nowindex: index });
          }
        })
      })
    }
         
    // //const Addbutton = cy.get($element).findByRole('button', { name: 'Add' })
    //      // if ($buttons.attr('name') == 'Add')  {
    //         cy.wrap($buttons).eq(index).click()
    //         let walletname
    //         cy.get('.wallets-card__details__bottom')
    //           .find('span')
    //           .eq(1)
    //           .invoke('text')
    //           .then((text) => {
    //         walletname = text.trim()
    //         cy.log({wallet: walletname})
    //           // walletname.split(' ')
    //           // walletname = walletname[0] //tusdt
    //           // cy.log({split: walletname})
    //         cy.findByRole('button', { name: 'Maybe later' }).click()
    //           //Once Maybelater is clicked we goes to the newly added wallet widget opened.
    //         cy.get('[class*="wallets-accordion wallets-accordion"]')
    //           .contains(walletname) //tusdt = tusdt
    //           .should('not.have.class', 'class="wallets-accordion__dropdown"')
    //       })
          // } else {
          //   cy.log("wallets are already added")
          // }
    //once the wallet is added check the sorting
    //walletdefaultsorting()
// })
//   })


describe("WALL-3094 - Add wallets from wallets carousels", () => {
    beforeEach(() => {
      cy.c_login("demoonlywallet")
      cy.c_visitResponsive("/wallets", "large")
      cy.contains("Add more Wallets")
      cy.findByTestId('dt-wallets-add-more').scrollIntoView()
    })

it("should be able to see the tour for Demo Only Wallets", () => {
    cy.wait(1000)
    //walletdefaultsorting()
    addmorewallets()
  })
})

