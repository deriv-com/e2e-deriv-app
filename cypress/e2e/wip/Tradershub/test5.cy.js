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

const validateLink = (linkName, expectedUrl, contentCheck) => {
  cy.findByRole('link', { name: linkName }).then(($link) => {
    const url = $link.prop('href')
    cy.visit(url, {
      onBeforeLoad: (win) => {
        cy.stub(win, 'open').as('windowOpen')
      },
    })
    cy.url().should('contain', expectedUrl)
    cy.findByRole('heading', { name: `${contentCheck}` })
  })
  cy.go('back')
}

const termsAndConditions = {
  'British Virgin Islands': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  'Vanuatu': 'https://deriv.com/tnc/general-terms.pdf',
  'Labuan': 'https://deriv.com/tnc/deriv-(fx)-ltd.pdf',
  'Islas Vírgenes Británicas': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
}

function checkHyperLinks(language) {
  const linkValidations =
    language === 'EN' ? linkValidationsEnglish : linkValidationsSpanish
  const langTerms =
    language === 'EN' ? 'British Virgin Islands' : 'Islas Vírgenes Británicas'

  linkValidations.forEach(({ linkName, expectedUrl, contentCheck }) => {
    validateLink(linkName, expectedUrl, contentCheck)
  })

  clickCompareAccounts(language)
  clickAndGetTerms(language, langTerms)
}

function clickCompareAccounts(language) {
  const buttonText = language === 'EN' ? 'Compare accounts' : 'Comparar cuentas'
  const urlPart =
    language === 'EN'
      ? 'appstore/cfd-compare-acccounts'
      : 'appstore/cfd-compare-acccounts?lang=ES'

  cy.findByText(buttonText).click()
  cy.url().should('contain', urlPart)
  cy.findByText(
    language === 'EN' ? 'Compare CFDs accounts' : 'Compare las cuentas de CFD'
  ).should('be.visible')
  cy.go('back')
}

/*function clickAndGetTerms(language, langTerms) {
    const linkText = language === 'EN' ? 'Terms and Conditions' : 'los Términos y Condiciones';
  
    [langTerms, 'Vanuatu', 'Labuan'].forEach(term => {
      cy.findByText(term).click();
      cy.findAllByRole('link', { name: linkText }).invoke('attr', 'target', '_self').click().then(() => {
        cy.url().should('eq', termsAndConditions[term]);
      });
      cy.findByTestId('dt_modal_close_icon').click();
    });
  }*/

function clickAndGetTerms(language, langTerms) {
  const linkText =
    language === 'EN' ? 'Terms and Conditions' : 'los Términos y Condiciones'

  //cy.findAllByRole('button', { name: language === 'EN' ? 'Get' : 'Obtener' }).first().click();

  ;[langTerms, 'Vanuatu'].forEach((term) => {
    cy.findAllByRole('button', { name: language === 'EN' ? 'Get' : 'Obtener' })
      .first()
      .click()
    cy.findByText(term).click()
    cy.findAllByRole('link', { name: linkText })
      .invoke('attr', 'target', '_self')
      .click()
      .then(() => {
        cy.url().should('eq', termsAndConditions[term])
        cy.go('back')
      })
    //cy.findByTestId('dt_modal_close_icon').click();
  })
  cy.wait(3000)
  cy.findAllByRole('button', { name: language === 'EN' ? 'Get' : 'Obtener' })
    .eq(1)
    .click()

  ;[langTerms, 'Vanuatu', 'Labuan'].forEach((term) => {
    cy.findByText(term).click()
    cy.findAllByRole('link', { name: linkText })
      .invoke('attr', 'target', '_self')
      .click()
      .then(() => {
        cy.url().should('eq', termsAndConditions[term])
      })
    //cy.findByTestId('dt_modal_close_icon').click();
  })
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
