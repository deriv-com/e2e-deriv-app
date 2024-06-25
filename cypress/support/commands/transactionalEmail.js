Cypress.Commands.add('c_emailContentVerification',
    (requestType, accountEmail, options = {}) => {                   
const {
baseUrl = Cypress.env('configServer') + '/events',
} = options
cy.log(accountEmail)
cy.log(`Visit ${baseUrl}`)
cy.visit(
  `https://${Cypress.env('qaBoxLoginEmail')}:${Cypress.env(
    'qaBoxLoginPassword'
  )}@${baseUrl}`
  ,{ log: false }
)
cy.origin(
  `https://${Cypress.env('qaBoxLoginEmail', { log: false })}:${Cypress.env(
    'qaBoxLoginPassword',
    { log: false }
  )}@${baseUrl}`,
  {
    args: [requestType, accountEmail],
  },
  ([requestType, accountEmail]) => {
    cy.document().then((doc) => {
      const allRelatedEmails = Array.from(
        doc.querySelectorAll(`a[href*="${requestType}"]`)
      )
      if (allRelatedEmails.length) {
        const verificationEmail = allRelatedEmails.pop()
        cy.wrap(verificationEmail).click()
        ;(() =>

        cy.get('p').filter(`:contains('${accountEmail}')`).should('be.visible').last())()

        cy.get('p[style="margin:0;"]').should('contain', 'transactional_message_id: account_closure')

      } else {
        cy.log('email not found')
      }
    })
  }
)
    })