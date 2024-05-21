import '@testing-library/cypress/add-commands'


describe('QATEST - 148419 - Register a New Application / App ID (sanity) ', { tags: '@sanityTag' } , () => {
  it('Creation of New App ID should be successful. ', () => {
   cy.c_createApplicationId()

  })
})
