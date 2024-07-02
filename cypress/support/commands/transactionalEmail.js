Cypress.Commands.add(
  'c_emailContentVerification',
  (requestType, accountEmail, transactionalMessageId) => {
    const baseUrl = Cypress.env('configServer') + '/events'
    cy.log(accountEmail)
    cy.log(`Visit ${baseUrl}`)

    cy.visit(
      `https://${Cypress.env('qaBoxLoginEmail')}:${Cypress.env(
        'qaBoxLoginPassword'
      )}@${baseUrl}`,
      { log: false }
    )
    cy.origin(
      `https://${Cypress.env('qaBoxLoginEmail', { log: false })}:${Cypress.env(
        'qaBoxLoginPassword',
        { log: false }
      )}@${baseUrl}`,
      {
        args: [requestType, accountEmail, transactionalMessageId],
      },
      ([requestType, accountEmail, transactionalMessageId]) => {
        cy.document().then((doc) => {
          const allRelatedEmails = Array.from(
            doc.querySelectorAll(`a[href*="${requestType}"]`)
          )

          if (allRelatedEmails.length) {
            const verificationEmail = allRelatedEmails.pop()
            cy.wrap(verificationEmail).click()

            verifyEmailContent(accountEmail, transactionalMessageId)
          } else {
            cy.log('email not found')
          }
        })

        function verifyEmailContent(accountEmail, transactionalMessageId) {
          cy.get('p')
            .filter(`:contains('${accountEmail}')`)
            .last()
            .should('be.visible')
            .siblings()
            .should(
              'contain',
              `transactional_message_id: ${transactionalMessageId}`
            )
        }
      }
    )
  }
)
