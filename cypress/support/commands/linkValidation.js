Cypress.Commands.add('checkLanguage', (language) => {
  const languages = {
    ES: { lang: 'Español', langChangeCheck: 'Cajero' },
    BN: { lang: 'বাংলা', langChangeCheck: 'ক্যাশিয়ার' },
    DE: { lang: 'Deutsch', langChangeCheck: 'Kassierer' },
    KO: { lang: '한국어', langChangeCheck: '캐셔' },
    PT: { lang: 'Português', langChangeCheck: 'Caixa' },
    PL: { lang: 'Polish', langChangeCheck: 'Kasjer' },
    RU: { lang: 'Русский', langChangeCheck: 'Касса' },
    FR: { lang: 'Français', langChangeCheck: 'Caisse' },
    IT: { lang: 'Italiano', langChangeCheck: 'Cassa' },
    TH: { lang: 'ไทย', langChangeCheck: 'แคชเชียร์' },
    TR: { lang: 'Türkçe', langChangeCheck: 'Kasiyer' },
    VI: { lang: 'Tiếng Việt', langChangeCheck: 'Thanh toán' },
    ZHCN: { lang: '简体中文', langChangeCheck: '收银台' },
    ZHTW: { lang: '繁體中文', langChangeCheck: '收銀台' },
  }
  const { lang, langChangeCheck } = languages[language]
  cy.findAllByTestId('dt_icon').eq(0).click()
  cy.findByText(lang).should('be.visible').click()
  cy.c_rateLimit()
  cy.findByText(langChangeCheck).should('be.visible')
  cy.checkHyperLinks(language)
})

const termsAndConditions = {
  'British Virgin Islands': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  'Vanuatu': 'https://deriv.com/tnc/general-terms.pdf',
  'Labuan': 'https://deriv.com/tnc/deriv-(fx)-ltd.pdf',
  'ব্রিটিশ ভার্জিন দ্বীপপুঞ্জ': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  'ভানুয়াতু': 'https://deriv.com/tnc/general-terms.pdf',
  'লাবুয়ান': 'https://deriv.com/tnc/deriv-(fx)-ltd.pdf',
  'Islas Vírgenes Británicas': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  'Britische Jungferninseln': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  '영국령 버진 아일랜드': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  'Ilhas Virgens Britânicas': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  'Британские Виргинские острова': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  'Îles Vierges britanniques': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  'Isole Vergini britanniche': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  'เกาะบริติชเวอร์จิน': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  'İngiliz Virjin Adaları': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  '英属维尔京群岛': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  '英屬維爾京群島': 'https://deriv.com/tnc/deriv-(bvi)-ltd.pdf',
  '바누아투': 'https://deriv.com/tnc/general-terms.pdf',
  'Вануату': 'https://deriv.com/tnc/general-terms.pdf',
  '瓦努阿图': 'https://deriv.com/tnc/general-terms.pdf',
  '萬那杜': 'https://deriv.com/tnc/general-terms.pdf',
  '라부안': 'https://deriv.com/tnc/deriv-(fx)-ltd.pdf',
  'Лабуан': 'https://deriv.com/tnc/deriv-(fx)-ltd.pdf',
  '纳闽': 'https://deriv.com/tnc/deriv-(fx)-ltd.pdf',
  '納閩': 'https://deriv.com/tnc/deriv-(fx)-ltd.pdf',
}

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

Cypress.Commands.add('checkHyperLinks', (language) => {
  const BVI = {
    EN: 'British Virgin Islands',
    ES: 'Islas Vírgenes Británicas',
    BN: 'ব্রিটিশ ভার্জিন দ্বীপপুঞ্জ',
    DE: 'Britische Jungferninseln',
    KO: '영국령 버진 아일랜드',
    PT: 'Ilhas Virgens Britânicas',
    PL: 'British Virgin Islands',
    RU: 'Британские Виргинские острова',
    FR: 'Îles Vierges britanniques',
    IT: 'Isole Vergini britanniche',
    TH: 'เกาะบริติชเวอร์จิน',
    TR: 'İngiliz Virjin Adaları',
    VI: 'British Virgin Islands',
    ZHCN: '英属维尔京群岛',
    ZHTW: '英屬維爾京群島',
  }
  const Vanuatu = {
    EN: 'Vanuatu',
    ES: 'Vanuatu',
    BN: 'ভানুয়াতু',
    DE: 'Vanuatu',
    KO: '바누아투',
    PT: 'Vanuatu',
    PL: 'Vanuatu',
    RU: 'Вануату',
    FR: 'Vanuatu',
    IT: 'Vanuatu',
    TH: 'Vanuatu',
    TR: 'Vanuatu',
    VI: 'Vanuatu',
    ZHCN: '瓦努阿图',
    ZHTW: '萬那杜',
  }

  const Labuan = {
    EN: 'Labuan',
    ES: 'Labuan',
    BN: 'লাবুয়ান',
    DE: 'Labuan',
    KO: '라부안',
    PT: 'Labuan',
    PL: 'Labuan',
    RU: 'Лабуан',
    FR: 'Labuan',
    IT: 'Labuan',
    TH: 'Labuan',
    TR: 'Labuan',
    VI: 'Labuan',
    ZHCN: '纳闽',
    ZHTW: '納閩',
  }

  const bviCFD = BVI[language]
  const vanuatuCFD = Vanuatu[language]
  const labuanCFD = Labuan[language]

  const linkValidations = {
    EN: [
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
    ],
    ES: [
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
    ],
    BN: [
      {
        linkName: 'options',
        expectedUrl: '/bn/trade-types/options/digital-options/up-and-down/',
        contentCheck: 'ডিজিটাল বিকল্প কি?',
      },
      {
        linkName: 'multipliers',
        expectedUrl: '/bn/trade-types/multiplier/',
        contentCheck: 'Multipliers',
      },
      {
        linkName: 'করুন',
        expectedUrl: '/bn/trade-types/cfds/',
        contentCheck: 'CFD ট্রেডিং',
      },
    ],
    DE: [
      {
        linkName: 'options',
        expectedUrl: '/de/trade-types/options/digital-options/up-and-down/',
        contentCheck: 'Was sind digitale Options?',
      },
      {
        linkName: 'multipliers',
        expectedUrl: '/de/trade-types/multiplier/',
        contentCheck: 'Multipliers',
      },
      {
        linkName: 'Erfahren Sie mehr',
        expectedUrl: '/de/trade-types/cfds/',
        contentCheck: 'CFD-Handel',
      },
    ],
    KO: [
      {
        linkName: 'options',
        expectedUrl: '/ko/trade-types/options/digital-options/up-and-down/',
        contentCheck: '디지털 옵션이란 무엇인가요?',
      },
      {
        linkName: 'multipliers',
        expectedUrl: '/ko/trade-types/multiplier/',
        contentCheck: 'Multipliers',
      },
      {
        linkName: '자세히 알아보기',
        expectedUrl: '/ko/trade-types/cfds/',
        contentCheck: 'CFD 트레이딩',
      },
    ],
    PT: [
      {
        linkName: 'options',
        expectedUrl: '/pt/trade-types/options/digital-options/up-and-down/',
        contentCheck: 'O que são Opções Digital?',
      },
      {
        linkName: 'multipliers',
        expectedUrl: '/pt/trade-types/multiplier/',
        contentCheck: 'Multipliers',
      },
      {
        linkName: 'Saiba mais',
        expectedUrl: '/pt/trade-types/cfds/',
        contentCheck: 'Negociação de CFDs',
      },
    ],
    PL: [
      {
        linkName: 'options',
        expectedUrl: '/pl/trade-types/options/digital-options/up-and-down/',
        contentCheck: 'Czym są opcje cyfrowe?',
      },
      {
        linkName: 'multipliers',
        expectedUrl: '/pl/trade-types/multiplier/',
        contentCheck: 'Multipliers',
      },
      {
        linkName: 'uzyskać lepszy zwrot z udanych transakcji',
        expectedUrl: '/pl/trade-types/cfds/',
        contentCheck: 'Handlowanie kontraktami na różnice kursowe',
      },
    ],
    RU: [
      {
        linkName: 'options',
        expectedUrl: '/ru/trade-types/options/digital-options/up-and-down/',
        contentCheck: 'Что такое цифровые опционы?',
      },
      {
        linkName: 'multipliers',
        expectedUrl: '/ru/trade-types/multiplier/',
        contentCheck: 'Multipliers',
      },
      {
        linkName: 'Подробнее',
        expectedUrl: '/ru/trade-types/cfds/',
        contentCheck: 'Торговля CFD',
      },
    ],
    FR: [
      {
        linkName: 'options',
        expectedUrl: '/fr/trade-types/options/digital-options/up-and-down/',
        contentCheck: "Qu'est-ce que les options numériques ?",
      },
      {
        linkName: 'multipliers',
        expectedUrl: '/fr/trade-types/multiplier/',
        contentCheck: 'Multipliers',
      },
      {
        linkName: 'En savoir plus',
        expectedUrl: '/fr/trade-types/cfds/',
        contentCheck: 'Trading de CFD',
      },
    ],
    IT: [
      {
        linkName: 'options',
        expectedUrl: '/it/trade-types/options/digital-options/up-and-down/',
        contentCheck: 'Cosa sono le opzioni digitali?',
      },
      {
        linkName: 'multipliers',
        expectedUrl: '/it/trade-types/multiplier/',
        contentCheck: 'Multipliers',
      },
      {
        linkName: 'Scopri di più',
        expectedUrl: '/it/trade-types/cfds/',
        contentCheck: 'Trading su CFD',
      },
    ],
    TH: [
      {
        linkName: 'options',
        expectedUrl: '/th/trade-types/options/digital-options/up-and-down/',
        contentCheck: 'ตราสารสิทธิดิจิทัลคืออะไร?',
      },
      {
        linkName: 'multipliers',
        expectedUrl: '/th/trade-types/multiplier/',
        contentCheck: 'Multipliers',
      },
      {
        linkName: 'เรียนรู้เพิ่มเติม',
        expectedUrl: '/th/trade-types/cfds/',
        contentCheck: 'การซื้อขาย CFD',
      },
    ],
    TR: [
      {
        linkName: 'options',
        expectedUrl: '/tr/trade-types/options/digital-options/up-and-down/',
        contentCheck: 'Dijital opsiyonlar nelerdir?',
      },
      {
        linkName: 'multipliers',
        expectedUrl: '/tr/trade-types/multiplier/',
        contentCheck: 'Multipliers',
      },
      {
        linkName: 'Daha fazla bilgi edin',
        expectedUrl: '/tr/trade-types/cfds/',
        contentCheck: 'CFD ticareti',
      },
    ],
    VI: [
      {
        linkName: 'options',
        expectedUrl: '/tr/trade-types/options/digital-options/up-and-down/',
        contentCheck: 'Quyền chọn Digital là gì?',
      },
      {
        linkName: 'multipliers',
        expectedUrl: '/tr/trade-types/multiplier/',
        contentCheck: 'Multipliers',
      },
      {
        linkName: 'Tìm hiểu thêm',
        expectedUrl: '/tr/trade-types/cfds/',
        contentCheck: 'Giao dịch CFD',
      },
    ],
    ZHCN: [
      {
        linkName: 'options',
        expectedUrl: '/zh-cn/trade-types/options/digital-options/up-and-down/',
        contentCheck: '什么是 digital 期权?',
      },
      {
        linkName: 'multipliers',
        expectedUrl: '/zh-cn/trade-types/multiplier/',
        contentCheck: 'Multipliers',
      },
      {
        linkName: '了解更多',
        expectedUrl: '/zh-cn/trade-types/cfds/',
        contentCheck: '差价合约交易',
      },
    ],
    ZHTW: [
      {
        linkName: 'options',
        expectedUrl: '/zh-tw/trade-types/options/digital-options/up-and-down/',
        contentCheck: '甚麼是 digital 期權?',
      },
      {
        linkName: 'multipliers',
        expectedUrl: '/zh-tw/trade-types/multiplier/',
        contentCheck: 'Multipliers',
      },
      {
        linkName: '了解更多',
        expectedUrl: '/zh-tw/trade-types/cfds/',
        contentCheck: '差價合約交易',
      },
    ],
  }

  const validations =
    language === 'EN' ? linkValidations.EN : linkValidations.ES

  validations.forEach(({ linkName, expectedUrl, contentCheck }) => {
    cy.c_rateLimit()
    validateLink(linkName, expectedUrl, contentCheck)
  })
  cy.c_rateLimit()
  clickCompareAccounts(language)
  cy.c_rateLimit()
  clickAndGetTerms(language, bviCFD, vanuatuCFD, labuanCFD)
})

function clickCompareAccounts(language) {
  const translations = {
    EN: {
      compareAccount: 'Compare accounts',
      urlPart: 'appstore/cfd-compare-acccounts',
      compareAccountContent: 'Compare CFDs accounts',
    },
    ES: {
      compareAccount: 'Comparar cuentas',
      urlPart: 'appstore/cfd-compare-acccounts?lang=ES',
      compareAccountContent: 'Compare las cuentas de CFD',
    },
    BN: {
      compareAccount: 'অ্যাকাউন্টের তুলনা',
      urlPart: 'appstore/cfd-compare-acccounts?lang=BN',
      compareAccountContent: 'তুলনা করুন CFD অ্যাকাউন্ট',
    },
    DE: {
      compareAccount: 'Konten vergleichen',
      urlPart: 'appstore/cfd-compare-acccounts?lang=DE',
      compareAccountContent: 'CFDs vergleichen Konten',
    },
    KO: {
      compareAccount: '계좌 비교',
      urlPart: 'appstore/cfd-compare-acccounts?lang=KO',
      compareAccountContent: 'CFD 계정 비교',
    },
    PT: {
      compareAccount: 'Comparar contas',
      urlPart: 'appstore/cfd-compare-acccounts?lang=PT',
      compareAccountContent: 'Compare contas de CFDs',
    },
    PL: {
      compareAccount: 'Porównaj konta',
      urlPart: 'appstore/cfd-compare-acccounts?lang=PL',
      compareAccountContent: 'Porównaj konta CFD',
    },
    RU: {
      compareAccount: 'Сравнить счета',
      urlPart: 'appstore/cfd-compare-acccounts?lang=RU',
      compareAccountContent: 'Сравнение счетов CFD',
    },
    FR: {
      compareAccount: 'Comparez les comptes',
      urlPart: 'appstore/cfd-compare-acccounts?lang=FR',
      compareAccountContent: 'Comparez les CFD des comptes',
    },
    IT: {
      compareAccount: 'Confronta conti',
      urlPart: 'appstore/cfd-compare-acccounts?lang=IT',
      compareAccountContent: 'Confronta i conti CFD',
    },
    TH: {
      compareAccount: 'เปรียบเทียบบัญชี',
      urlPart: 'appstore/cfd-compare-acccounts?lang=TH',
      compareAccountContent: 'เปรียบเทียบบัญชี CFD',
    },
    TR: {
      compareAccount: 'Hesapları karşılaştır',
      urlPart: 'appstore/cfd-compare-acccounts?lang=TR',
      compareAccountContent: "CFD'leri karşılaştırın hesapları",
    },
    VI: {
      compareAccount: 'So sánh tài khoản',
      urlPart: 'appstore/cfd-compare-acccounts?lang=VI',
      compareAccountContent: 'So sánh các tài khoản CFD',
    },
    ZHCN: {
      compareAccount: '账户比较',
      urlPart: 'appstore/cfd-compare-acccounts?lang=ZH_CN',
      compareAccountContent: '比较差价合约 账户',
    },
    ZHTW: {
      compareAccount: '帳戶比較',
      urlPart: 'appstore/cfd-compare-acccounts?lang=ZH_TW',
      compareAccountContent: '比較差價合約 帳戶',
    },
  }

  const { compareAccount, urlPart, compareAccountContent } =
    translations[language]

  cy.findByText(compareAccount).click()
  cy.url().should('contain', urlPart)
  cy.findByText(compareAccountContent).should('be.visible')
  cy.go('back')
}

function clickAndGetTerms(language, bviCFD, vanuatuCFD, labuanCFD) {
  const clickText = {
    EN: {
      getButton: 'Get',
      termsConditionLink: 'Terms and Conditions',
    },
    ES: {
      getButton: 'Obtener',
      termsConditionLink: 'los Términos y Condiciones',
    },
    BN: {
      getButton: 'পান',
      termsConditionLink: 'শর্তাবলী',
    },
    DE: {
      getButton: 'Holen',
      termsConditionLink: 'Allgemeinen Geschäftsbedingungen',
    },
    KO: {
      getButton: '받기',
      termsConditionLink: '이용약관',
    },
    PT: {
      getButton: 'Criar',
      termsConditionLink: 'Termos e Condições',
    },
    PL: {
      getButton: 'Dostać',
      termsConditionLink: 'Regulamin',
    },
    RU: {
      getButton: 'Открыть',
      termsConditionLink: 'правила и условия',
    },
    FR: {
      getButton: 'Obtenir',
      termsConditionLink: 'conditions générales',
    },
    IT: {
      getButton: 'Vai',
      termsConditionLink: 'termini e condizioni',
    },
    TH: {
      getButton: 'รับ',
      termsConditionLink: 'ข้อกำหนดและเงื่อนไข',
    },
    TR: {
      getButton: 'Edin',
      termsConditionLink: 'Şartlar ve Koşullarını',
    },
    VI: {
      getButton: 'Tạo',
      termsConditionLink: 'Điều khoản và Điều kiện',
    },
    ZHCN: {
      getButton: '获取',
      termsConditionLink: '条款和条件',
    },
    ZHTW: {
      getButton: '獲取',
      termsConditionLink: '條款和條件',
    },
  }

  const { getButton, termsConditionLink } = clickText[language]
  if (bviCFD) {
    ;[bviCFD, vanuatuCFD].forEach((term) => {
      cy.c_rateLimit()
      cy.findAllByRole('button', { name: getButton }).first().click()
      cy.findByText(term).click()
      cy.c_rateLimit()
      cy.findAllByRole('link', { name: termsConditionLink })
        .invoke('attr', 'target', '_self')
        .click()
        .then(() => {
          cy.url().should('eq', termsAndConditions[term])
          cy.go('back')
        })
    })
  }

  cy.c_rateLimit()
  if (bviCFD) {
    ;[bviCFD, vanuatuCFD, labuanCFD].forEach((term) => {
      cy.c_rateLimit()
      cy.findAllByRole('button', { name: getButton }).eq(1).click()
      cy.findByText(term).click()
      cy.c_rateLimit()
      cy.findAllByRole('link', { name: termsConditionLink })
        .invoke('attr', 'target', '_self')
        .click()
        .then(() => {
          cy.url().should('eq', termsAndConditions[term])
          cy.go('back')
        })
    })
  }
}
