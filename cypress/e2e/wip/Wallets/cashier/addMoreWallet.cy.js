import "@testing-library/cypress/add-commands"
function addmorewallet(){
cy.contains("Add more Wallets")
cy.findByTestId('dt-wallets-add-more').scrollIntoView()





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

