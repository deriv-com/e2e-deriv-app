import '@testing-library/cypress/add-commands'

describe('QATEST-123240: Verify Terms and Conditions for non-english languages', () => {
  let derivComProdURL = Cypress.env('derivComProdURL')
  const tncVar = {
    English: {
      name: 'English',
      code: 'EN',
      linkName: 'Terms and Conditions',
      buttonName: 'Get',
    },
    Spanish: {
      name: 'Español',
      code: 'ES',
      linkName: 'los Términos y Condiciones',
      buttonName: 'Obtener',
    },
    German: {
      name: 'Deutsch',
      code: 'DE',
      linkName: 'Allgemeinen Geschäftsbedingungen',
      buttonName: 'Holen',
    },
    Korean: {
      name: '한국어',
      code: 'KO',
      linkName: '이용약관',
      buttonName: '받기',
    },
    Portuguese: {
      name: 'Português',
      code: 'PT',
      linkName: 'Termos e Condições',
      buttonName: 'Criar',
    },
    Polish: {
      name: 'Polish',
      code: 'PL',
      linkName: 'Regulamin',
      buttonName: 'Dostać',
    },
    Russian: {
      name: 'Русский',
      code: 'RU',
      linkName: 'правила и условия',
      buttonName: 'Открыть',
    },
    French: {
      name: 'Français',
      code: 'FR',
      linkName: 'conditions générales',
      buttonName: 'Obtenir',
    },
    Italian: {
      name: 'Italiano',
      code: 'IT',
      linkName: 'termini e condizioni',
      buttonName: 'Vai',
    },
    Thai: {
      name: 'ไทย',
      code: 'TH',
      linkName: 'ข้อกำหนดและเงื่อนไข',
      buttonName: 'รับ',
    },
    Turkish: {
      name: 'Türkçe',
      code: 'TR',
      linkName: 'Şartlar ve Koşullarını',
      buttonName: 'Edin',
    },
    Vietnamese: {
      name: 'Tiếng Việt',
      code: 'VI',
      linkName: 'Điều khoản và Điều kiện',
      buttonName: 'Tạo',
    },
    ChineseSimplified: {
      name: '简体中文',
      code: 'ZH_CN',
      linkName: '条款和条件',
      buttonName: '获取',
    },
    ChineseTraditional: {
      name: '繁體中文',
      code: 'ZH_TW',
      linkName: '條款和條件',
      buttonName: '獲取',
    },
  }
  const tncPdf = {
    BVI: `${derivComProdURL}tnc/deriv-(bvi)-ltd.pdf`,
    Vanuatu: `${derivComProdURL}tnc/general-terms.pdf`,
    Labuan: `${derivComProdURL}tnc/deriv-(fx)-ltd.pdf`,
  }

  const changeLanguage = (lang) => {
    cy.log(`Switching language to ${lang}`)
    cy.findByTestId('dt_toggle_language_settings').click()
    cy.findByText(lang).click()
  }

  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
  })
  it('Should be able to open correct pdf', () => {
    Object.keys(tncVar).forEach((key) => {
      cy.findAllByText(`Trader's Hub`).last().should('be.visible')
      if (tncVar[key].name != 'English') changeLanguage(`${tncVar[key].name}`)

      for (let i = 0; i < 4; i++) {
        cy.findAllByRole('button', {
          name: `${tncVar[key].buttonName}`,
          timeout: 30000,
        })
          .should('be.visible')
          .eq(1)
          .click()
        cy.contains('Deriv MT5 Financial').should('be.visible')
        cy.findAllByTestId('dt_jurisdiction_card').eq(i).click()
        switch (i) {
          case 0:
            cy.findByText(`${tncVar[key].linkName}`).should('not.exist')
            cy.findByTestId('dt_modal_close_icon').click()
            break
          case 1:
            cy.findByRole('link', { name: `${tncVar[key].linkName}` })
              .invoke('removeAttr', 'target')
              .click()
            cy.url().should('eq', `${tncPdf['BVI']}`)
            cy.go('back')
            break
          case 2:
            cy.findByRole('link', { name: `${tncVar[key].linkName}` })
              .invoke('removeAttr', 'target')
              .click()
            cy.url().should('eq', `${tncPdf['Vanuatu']}`)
            cy.go('back')
            break
          case 3:
            cy.findByRole('link', { name: `${tncVar[key].linkName}` })
              .invoke('removeAttr', 'target')
              .click()
            cy.url().should('eq', `${tncPdf['Labuan']}`)
            cy.go('back')
        }
      }
    })
  })
})
