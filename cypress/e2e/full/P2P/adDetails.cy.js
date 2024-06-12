describe('QATEST-2853 - Ad details', () => {
  beforeEach(() => {
    cy.clearAllLocalStorage()
    cy.c_login({ user: 'p2pStandardAccountWithoutAds' })
    cy.c_visitResponsive('/appstore/traders-hub', 'small')
  })

  it('Should be able to either ad or update ad details in the my profile tab.', () => {
    cy.c_navigateToP2P()
    cy.findByText('My profile').click()
    cy.findByText('Available Deriv P2P balance').should('be.visible')
    cy.findByText('Ad details').should('be.visible').click()
    cy.findByText('Ad details').should('be.visible')
    cy.findByText('This information will be visible to everyone.').should(
      'be.visible'
    )
    cy.c_adDetailsFieldText('contact_info')
    cy.c_adDetailsFieldText('default_advert_description')
    cy.findByRole('button', { name: 'Save' }).should('be.enabled').click()
    cy.findByRole('button', { name: 'Save' }).should('be.disabled')
    cy.get('textarea[name=contact_info]')
      .invoke('text')
      .then((contactInfoText) => {
        sessionStorage.setItem('c_contactInfoText', contactInfoText.trim())
      })
    cy.get('textarea[name=default_advert_description')
      .invoke('text')
      .then((instructionsText) => {
        sessionStorage.setItem('c_instructionsText', instructionsText.trim())
      })
    cy.then(() => {
      cy.findByTestId('dt_mobile_full_page_return_icon').should('exist').click()
      cy.findByText('My ads').click()
      cy.c_createNewAd('buy')
      cy.findByTestId('default_advert_description').should(
        'have.value',
        sessionStorage.getItem('c_instructionsText')
      )
      cy.c_verifyTextAreaLength(
        'default_advert_description',
        sessionStorage.getItem('c_instructionsText').length
      )
      cy.findByText('Sell USD').click()
      cy.findByTestId('contact_info').should(
        'have.value',
        sessionStorage.getItem('c_contactInfoText')
      )
      cy.c_verifyTextAreaLength(
        'contact_info',
        sessionStorage.getItem('c_contactInfoText').length
      )
      cy.findByTestId('default_advert_description').should(
        'have.value',
        sessionStorage.getItem('c_instructionsText')
      )
      cy.c_verifyTextAreaLength(
        'default_advert_description',
        sessionStorage.getItem('c_instructionsText').length
      )
    })
  })
})
