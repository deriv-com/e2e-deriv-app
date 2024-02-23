import "@testing-library/cypress/add-commands"
describe('QATEST-5797, QATEST-5820', () => {
    beforeEach(() => {
      cy.c_login()
      cy.c_visitResponsive('/appstore/traders-hub', 'large')
    })
function addAccount(index) {
  cy.log('check() function called with index:', index)
  cy.findByTestId('dt_currency-switcher__arrow').click()
  cy.findByRole('button', { name: 'Add or manage account' }).click()
  cy.findByRole('button', { name: 'Add account' }).should('be.disabled')
  cy.get('.currency-list__radio-button').eq(index).click()
  cy.findByRole('button', { name: 'Add account' }).click()
  cy.findByRole('heading', { name: 'Success!' }).should('be.visible')
  cy.findByRole('button', { name: 'Deposit now' }).should('be.visibke')
  cy.findByRole('button', { name: 'Maybe later' }).click()

}
function getCurrencyList() {
  return cy.get('div.currency-list__items').find('label').then(($labels) => { // Use .then() to handle the result
      const labelCount = $labels.length; // Get the length of the labels
      return labelCount // Return the label count
    })
    
}

function createSiblingacct(i){
  cy.findByTestId('dt_currency-switcher__arrow').click()
  cy.findByRole('button', { name: 'Add or manage account' }).click()
  cy.get('.currency-list__item').eq(i).click()
  cy.findByRole('button', { name: 'Add account' }).click()
  cy.findByRole('heading', { name: 'Success!' }).should('be.visible')
  cy.findByRole('button', { name: 'Deposit now' }).should('be.enabled')
  cy.findByRole('button', { name: 'Maybe later' }).click()

}
it('Create siblings account', () => { 
  cy.findByTestId('dt_currency-switcher__arrow').click()
  cy.findByRole('button', { name: 'Add or manage account' }).click()
  //getCurrencyList()
  // getCurrencyList()
  // cy.then((labelCount) => {
  //   cy.log('Number of elements found: ' + labelCount)
  //   for (let i = 0; i < labelCount; i++) {
  //     createSiblingacct(i)
  //   }})
  getCurrencyList().then((labelCount) => {
    cy.get('.dc-modal-header__close').click()
   // cy.log('Number of elements found: ' + labelCount);
    for (let i = 0; i < labelCount; i++) {
      // Call your function here as needed
     createSiblingacct(i)
    }
  })
})
})