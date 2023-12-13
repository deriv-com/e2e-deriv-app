import "@testing-library/cypress/add-commands"
function addmorewallet(){
cy.contains("Add more Wallets")
cy.findByTestId('dt-wallets-add-more').scrollIntoView()
cy.get('.wallets-add-more__carousel-wrapper')
  .should('exist')
  .then($elements => {
    // Filter wallets that contain only blockchain 
    const cryptowalletText = $elements.filter((index, element) => {
      const allwalletText = Cypress.$(element).text()
      return allwalletText.includes('blockchain.')
    })

    // Extract text content of filtered elements - here crypto wallets
    const cryptoCarouselList = cryptowalletText.toArray().map(element => Cypress.$(element).text());

    // Check if the filtered elements are sorted alphabetically
    const expectedSortedList = [...cryptoCarouselList].sort();
    expect(cryptoCarouselList).to.deep.equal(expectedSortedList);

    // // Perform any actions specific to the filtered elements
    // elementsWithText.each((index, element) => {
    //   cy.wrap(element).should('have.class', 'your-specific-class');
    // });
  });


}

describe("WALL-3094 - Add wallets from wallets carousels", () => {
    beforeEach(() => {
      cy.c_login("demoonlywallet")
      cy.c_visitResponsive("/wallets", "large")
    })

it("should be able to see the tour for Demo Only Wallets", () => {
    addmorewallet()
  })
})

