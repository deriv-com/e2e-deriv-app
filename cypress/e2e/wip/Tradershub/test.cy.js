import '@testing-library/cypress/add-commands'

const linkValidationsEnglish = [
  {
    linkName: 'options',
    expectedUrl: '/trade-types/options/digital-options/up-and-down/',
    contentCheck: 'Digital options available on Deriv',
  },
  {
    linkName: 'multipliers',
    expectedUrl: '/trade-types/multiplier/',
    contentCheck: 'Multipliers',
  },
  {
    linkName: 'Learn more',
    expectedUrl: '/trade-types/cfds/',
    contentCheck: 'CFD trading',
  },
]

const linkValidationsSpanish = [
  {
    linkName: 'options',
    expectedUrl: '/es/trade-types/options/digital-options/up-and-down/',
    contentCheck: '¿Qué son las opciones digitales?',
  },
  {
    linkName: 'multipliers',
    expectedUrl: '/es/trade-types/multiplier/',
    contentCheck: 'Multipliers',
  },
  {
    linkName: 'Saber más',
    expectedUrl: '/es/trade-types/cfds/',
    contentCheck: 'rica en funciones',
  },
]

const termsAndConditions = {
  'British Virgin Islands': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  'Vanuatu': 'https://deriv.com/tnc/general-terms.pdf',
  'Labuan': 'https://deriv.com/tnc/deriv-(fx)-ltd.pdf',
  'Islas Vírgenes Británicas': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
}

/*const termsAndConditionsSpanish = {
  'Islas Vírgenes Británicas': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  'Vanuatu': 'https://deriv.com/tnc/general-terms.pdf',
  'Labuan': 'https://deriv.com/tnc/deriv-(fx)-ltd.pdf',
}*/

const validateLink = (linkName, expectedUrl, contentCheck) => {
  cy.findByRole('link', { name: linkName }).invoke('attr', 'target', '_self')
  cy.url().should('contain', expectedUrl)
  cy.findByRole('heading', { name: `${contentCheck}` })
  cy.go('back')
}

function checkHyperLinks(language) {
  if (language === 'EN') {
    linkValidationsEnglish.forEach(
      ({ linkName, expectedUrl, contentCheck }) => {
        validateLink(linkName, expectedUrl, contentCheck)
      }
    )

    /*


  

  const buttonText = language === 'EN' ? 'Compare accounts' : 'Comparar cuentas';
  const urlPart = language === 'EN' ? 'appstore/cfd-compare-acccounts' : 'appstore/cfd-compare-acccounts?lang=ES';

  cy.findByText(buttonText).click();
  cy.url().should('contain', urlPart);
  cy.go('back')



    */

    cy.findByText('Compare accounts').click()
    cy.url().should('contain', 'appstore/cfd-compare-acccounts')
    cy.findByText('Compare CFDs accounts').should('be.visible')
    cy.go('back')
    cy.findAllByRole('button', { name: 'Get' }).first().click()
    cy.findByText('British Virgin Islands').click()
    cy.findAllByRole('link', { name: 'Terms and Conditions' })
      .invoke('attr', 'target', '_self')
      .click()
      .then(() => {
        cy.url().should('eq', termsAndConditions['British Virgin Islands'])
      })
    cy.findByText('Vanuatu').click()
    cy.findAllByRole('link', { name: 'Terms and Conditions' })
      .invoke('attr', 'target', '_self')
      .click()
      .then(() => {
        cy.url().should('eq', termsAndConditions['Vanuatu'])
      })
    cy.findByTestId('dt_modal_close_icon').click()
    cy.findAllByRole('button', { name: 'Get' }).eq(1).click()
    cy.findByText('British Virgin Islands').click()
    cy.findAllByRole('link', { name: 'Terms and Conditions' })
      .invoke('attr', 'target', '_self')
      .click()
      .then(() => {
        cy.url().should('eq', termsAndConditions['British Virgin Islands'])
      })
    cy.findByText('Vanuatu').click()
    cy.findAllByRole('link', { name: 'Terms and Conditions' })
      .invoke('attr', 'target', '_self')
      .click()
      .then(() => {
        cy.url().should('eq', termsAndConditions['Vanuatu'])
      })
    cy.findByText('Labuan').click()
    cy.findAllByRole('link', { name: 'Terms and Conditions' })
      .invoke('attr', 'target', '_self')
      .click()
      .then(() => {
        cy.url().should('eq', termsAndConditions['Labuan'])
      })
    cy.findByTestId('dt_modal_close_icon').click()
  } else if (language === 'ES') {
    linkValidationsSpanish.forEach(
      ({ linkName, expectedUrl, contentCheck }) => {
        validateLink(linkName, expectedUrl, contentCheck)
      }
    )
    cy.findByText('Comparar cuentas').click()
    cy.url().should('contain', 'appstore/cfd-compare-acccounts?lang=ES')
    cy.findByText('Compare las cuentas de CFD').should('be.visible')
    cy.go('back')
    cy.findAllByRole('button', { name: 'Obtener' }).first().click()
    cy.findByText('Islas Vírgenes Británicas').click()
    cy.findAllByRole('link', { name: 'los Términos y Condiciones' })
      .invoke('attr', 'target', '_self')
      .click()
      .then(() => {
        cy.url().should('eq', termsAndConditions['Islas Vírgenes Británicas'])
      })
    cy.findByText('Vanuatu').click()
    cy.findAllByRole('link', { name: 'los Términos y Condiciones' })
      .invoke('attr', 'target', '_self')
      .click()
      .then(() => {
        cy.url().should('eq', termsAndConditions['Vanuatu'])
      })
    cy.findByTestId('dt_modal_close_icon').click()
    cy.findAllByRole('button', { name: 'Obtener' }).eq(1).click()
    cy.findByText('Islas Vírgenes Británicas').click()
    cy.findAllByRole('link', { name: 'los Términos y Condiciones' })
      .invoke('attr', 'target', '_self')
      .click()
      .then(() => {
        cy.url().should('eq', termsAndConditions['Islas Vírgenes Británicas'])
      })
    cy.findByText('Vanuatu').click()
    cy.findAllByRole('link', { name: 'los Términos y Condiciones' })
      .invoke('attr', 'target', '_self')
      .click()
      .then(() => {
        cy.url().should('eq', termsAndConditions['Vanuatu'])
      })
    cy.findByText('Labuan').click()
    cy.findAllByRole('link', { name: 'los Términos y Condiciones' })
      .invoke('attr', 'target', '_self')
      .click()
      .then(() => {
        cy.url().should('eq', termsAndConditions['Labuan'])
      })
    cy.findByTestId('dt_modal_close_icon').click()
  }
}

describe('production bug', () => {
  beforeEach(() => {
    cy.c_login()
  })

  it('Should navigate to all links in traders hub home page and validate its redirection in english', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    checkHyperLinks('EN')
    cy.findAllByTestId('dt_icon').eq(0).click()
    cy.wait(2000)
    cy.findAllByTestId('dt_settings_language_button').eq(0).click()
    cy.wait(2000)
    checkHyperLinks('ES')
  })
})
