Cypress.Commands.add('c_emailContentVerification',
    (requestType, accountEmail, options = {}) => {                   
const {
retryCount = 0,
maxRetries = 3,
baseUrl = Cypress.env('configServer') + '/events',
} = options
cy.log(accountEmail)
cy.log(`Visit ${baseUrl}`)
const userID = Cypress.env('qaBoxLoginEmail')
const userPSWD = Cypress.env('qaBoxLoginPassword')
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
// cy.on('fail', (err) => {
//       rotateCreds()
//       throw err
//     })
//     cy.then(() => {
//       //Rotating credentials
//       rotateCreds()
//       //Retry finding email after 1 second interval
//       if (retryCount < maxRetries) {
//         cy.log(`Retrying... Attempt number: ${retryCount + 1}`)
//         cy.wait(1000)
//         cy.c_emailContentVerification(requestType, accountEmail, {
//           ...options,
//           retryCount: retryCount + 1,
//         })
//       }
//       if (retryCount > maxRetries) {
//         throw new Error(
//           `Content extraction failed after ${maxRetries} attempts.`
//         )
//       }
//     })
//     const rotateCreds = () => {
//       Cypress.env('qaBoxLoginEmail', userID)
//       Cypress.env('qaBoxLoginPassword', userPSWD)
//     }
//   }

