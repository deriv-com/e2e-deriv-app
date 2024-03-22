import '@testing-library/cypress/add-commands'

describe('QATEST-123240: Verify Mt5 Terms and Conditions for English and non-english languages', () => {
  let appLang
  let derivComProdURL = Cypress.env('derivComProdURL')
  const tncObjectEnglish = {
    English: {
      name: 'English',
      code: 'EN',
      linkName: 'Terms and Conditions',
      buttonName: 'Get',
      cardTitle: 'financial',
    },
  }
  const tncObjectNonEnglish = {
    Spanish: {
      name: 'Español',
      code: 'ES',
      linkName: 'los Términos y Condiciones',
      buttonName: 'Obtener',
      cardTitle: 'financiera',
    },
    German: {
      name: 'Deutsch',
      code: 'DE',
      linkName: 'Allgemeinen Geschäftsbedingungen',
      buttonName: 'Holen',
      cardTitle: 'finanziell',
    },
    Korean: {
      name: '한국어',
      code: 'KO',
      linkName: '이용약관',
      buttonName: '받기',
      cardTitle: '금융',
    },
    Portuguese: {
      name: 'Português',
      code: 'PT',
      linkName: 'Termos e Condições',
      buttonName: 'Criar',
      cardTitle: 'financeira',
    },
    Polish: {
      name: 'Polish',
      code: 'PL',
      linkName: 'Regulamin',
      buttonName: 'Dostać',
      cardTitle: 'finansowe',
    },
    Russian: {
      name: 'Русский',
      code: 'RU',
      linkName: 'правила и условия',
      buttonName: 'Открыть',
      cardTitle: 'финансовый',
    },
    French: {
      name: 'Français',
      code: 'FR',
      linkName: 'conditions générales',
      buttonName: 'Obtenir',
      cardTitle: 'financier',
    },
    Italian: {
      name: 'Italiano',
      code: 'IT',
      linkName: 'termini e condizioni',
      buttonName: 'Vai',
      cardTitle: 'finanziario',
    },
    Thai: {
      name: 'ไทย',
      code: 'TH',
      linkName: 'ข้อกำหนดและเงื่อนไข',
      buttonName: 'รับ',
      cardTitle: 'บัญชี-financial',
    },
    Turkish: {
      name: 'Türkçe',
      code: 'TR',
      linkName: 'Şartlar ve Koşullarını',
      buttonName: 'Edin',
      cardTitle: 'finansal',
    },
    Vietnamese: {
      name: 'Tiếng Việt',
      code: 'VI',
      linkName: 'Điều khoản và Điều kiện',
      buttonName: 'Tạo',
      cardTitle: 'tài-chính',
    },
    ChineseSimplified: {
      name: '简体中文',
      code: 'ZH_CN',
      linkName: '条款和条件',
      buttonName: '获取',
      cardTitle: '金融',
    },
    ChineseTraditional: {
      name: '繁體中文',
      code: 'ZH_TW',
      linkName: '條款和條件',
      buttonName: '獲取',
      cardTitle: '金融',
    },
  }
  const tncPdf = {
    BVI: `${derivComProdURL}tnc/deriv-(bvi)-ltd.pdf`,
    Vanuatu: `${derivComProdURL}tnc/general-terms.pdf`,
    Labuan: `${derivComProdURL}tnc/deriv-(fx)-ltd.pdf`,
  }

  const checkURLLanguage = () => {
    cy.url().then((url) => {
      appLang = url.match(/lang=([A-Z]{2})/)
      if (appLang) appLang = appLang[1]
    })
  }

  const changeLanguage = (lang) => {
    cy.log(`Switching language to ${lang}`)
    cy.findByTestId('dt_toggle_language_settings').click()
    cy.findByText(lang).click()
  }

  const getRandomKey = (obj) => {
    const keys = Object.keys(obj)
    return keys[Math.floor(Math.random() * keys.length)]
  }

  const verifyTncLinks = (obj, key) => {
    cy.log(`Verifying Tnc in ${obj[key].name} language`)
    cy.findAllByText(`Trader's Hub`).last().should('be.visible')
    if (obj[key].name != 'English') changeLanguage(`${obj[key].name}`)

    for (let i = 0; i < 4; i++) {
      cy.findAllByTestId(`dt_trading-app-card_real_${obj[key].cardTitle}`)
        .findByRole('button', {
          name: `${obj[key].buttonName}`,
          timeout: 30000,
        })
        .should('be.visible')
        .click()
      cy.contains('Deriv MT5 Financial').should('be.visible')
      cy.findAllByTestId('dt_jurisdiction_card').eq(i).click()
      switch (i) {
        case 0:
          cy.findByText(`${obj[key].linkName}`).should('not.exist')
          cy.findByTestId('dt_modal_close_icon').click()
          break
        case 1:
          cy.findByRole('link', {
            name: `${obj[key].linkName}`,
          })
            .invoke('removeAttr', 'target')
            .click()
          cy.url().should('eq', `${tncPdf['BVI']}`)
          cy.go('back')
          break
        case 2:
          cy.findByRole('link', {
            name: `${obj[key].linkName}`,
          })
            .invoke('removeAttr', 'target')
            .click()
          cy.url().should('eq', `${tncPdf['Vanuatu']}`)
          cy.go('back')
          break
        case 3:
          cy.findByRole('link', {
            name: `${obj[key].linkName}`,
          })
            .invoke('removeAttr', 'target')
            .click()
          cy.url().should('eq', `${tncPdf['Labuan']}`)
          cy.go('back')
      }
    }
  }

  beforeEach(() => {
    cy.c_login()
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    checkURLLanguage()
  })

  it('Should be able to open correct pdf', () => {
    let key = getRandomKey(tncObjectNonEnglish)
    if (appLang != undefined) changeLanguage('English')
    cy.log(cy.log('Verifying Tnc in English language'))
    verifyTncLinks(tncObjectEnglish, 'English')
    verifyTncLinks(tncObjectNonEnglish, key)
    changeLanguage('English')
  })
})
