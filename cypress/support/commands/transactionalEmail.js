Cypress.Commands.add(
  'c_emailContentVerification',
  (requestType, accountEmail, transactionalMessageId, isVerificationUrl) => {
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
        args: [
          requestType,
          accountEmail,
          transactionalMessageId,
          isVerificationUrl,
        ],
      },
      ([
        requestType,
        accountEmail,
        transactionalMessageId,
        isVerificationUrl,
      ]) => {
        cy.document().then((doc) => {
          const allRelatedEmails = Array.from(
            doc.querySelectorAll(`a[href*="${requestType}"]`)
          )

          if (allRelatedEmails.length) {
            const verificationEmail = allRelatedEmails.pop()
            cy.wrap(verificationEmail).click()

            verifyEmailContent(
              accountEmail,
              transactionalMessageId,
              isVerificationUrl
            )
          } else {
            cy.log('email not found')
          }
        })

        function verifyEmailContent(
          accountEmail,
          transactionalMessageId,
          isVerificationUrl
        ) {
          cy.get('p')
            .filter(`:contains('${accountEmail}')`)
            .last()
            .should('be.visible')
            .siblings()
            .should(
              'contain',
              `transactional_message_id: ${transactionalMessageId}`
            )

          isVerificationUrl
            ? cy
                .get('a')
                .contains(Cypress.config('baseUrl'))
                .invoke('attr', 'href')
                .should('exist')
            : cy.log('Verification URL is not required')
        }
      }
    )
  }
)
