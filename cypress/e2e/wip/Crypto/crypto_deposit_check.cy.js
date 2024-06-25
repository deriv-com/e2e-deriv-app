describe('QATEST-715 - Load crypto deposit page', () => {
  beforeEach(() => {
    cy.c_login({ user: 'allcrypto' })
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })

  it('should be able to create crypto account from Traders Hub.', () => {
    const cryptocurrencies = [
      'Bitcoin',
      'Ethereum',
      'Litecoin',
      'Tether ERC20',
      'USD Coin',
      'Tether TRC20',
    ]
    cryptocurrencies.forEach((crypto) => {
      cy.findByText('Options & Multipliers').should('be.visible')
      cy.c_closeNotificationHeader()
      cy.findByTestId('dt_currency-switcher__arrow')
        .should('be.visible')
        .click()
      cy.findByText(crypto).click()
      cy.findByTestId('dt_currency-switcher__arrow').should('be.visible')
      cy.c_closeNotificationHeader()
      cy.findByRole('button', { name: 'Deposit' }).click()

      // To check for QR code and compare with the code generated
      cy.get("canvas[class*='qrcode']").should('be.visible') // assert that the QR code element exists
      cy.get("canvas[class*='qrcode']").then(($canvas) => {
        // Get the image data from the canvas
        const imageData = $canvas[0]
          .getContext('2d')
          .getImageData(0, 0, $canvas[0].width, $canvas[0].height)
        // Decode the QR code using jsQR
        const code = Cypress.jsQR(
          imageData.data,
          imageData.width,
          imageData.height
        )
        // Assert that the QR code was successfully decoded and get its value
        expect(code).to.not.be.null
        const qrCodeValue = code.data
        // Log the value of the QR code
        cy.log('QR Code Value:', qrCodeValue)
        // Get the value from the element with the specified class
        cy.get('.deposit-crypto-wallet-address__hash-container')
          .invoke('text')
          .then((actionContainerValue) => {
            // Ensure that both values are trimmed to remove any leading/trailing whitespace
            const trimmedQRCodeValue = qrCodeValue.trim()
            const trimmedActionContainerValue = actionContainerValue.trim()
            // Compare the QR code value with the value from the specified class
            expect(trimmedQRCodeValue).to.equal(trimmedActionContainerValue)
          })
      })
      cy.get('.deposit-crypto-wallet-address__hash-container').should('exist') // Assert that the container exists
      cy.get('.deposit-crypto-wallet-address__action-container').click()
      cy.get('.deposit-crypto-wallet-address__hash-container')
        .invoke('text')
        .then((expectedValue) => {
          cy.get('.deposit-crypto-wallet-address__action-container')
            .click()
            .then(() => {
              // After clicking, retrieve the value from the clipboard
              cy.window().then((win) => {
                cy.wrap(win.navigator.clipboard.readText()).then(
                  (copiedValue) => {
                    // Assert that the copied value matches the expected value
                    expect(copiedValue.trim()).to.equal(expectedValue.trim())
                  }
                )
              })
            })
        })
      cy.findByText('Transaction status').should('be.visible')
      cy.get('.transactions-crypto-transaction-status-side-note').should(
        'exist'
      )
      cy.get('.side-note').should('exist')
      cy.findByTestId('dt_traders_hub_home_button').click()
    })
  })
})
