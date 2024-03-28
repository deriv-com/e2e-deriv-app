import '@testing-library/cypress/add-commands'

const languageContent = {
  ES: {
    optionsurl: '/es/trade-types/options/digital-options/up-and-down/',
    options: '¿Qué son las opciones digitales?',
    multipliersurl: '/trade-types/multiplier/',
    compare_accounts: 'Compare las cuentas de CFD',
    learnmore: 'rica en funciones',
    learnmoreurl: '/es/trade-types/cfds/',
    learn_more_link: 'Saber más',
  },
  DE: {
    optionsurl: '/de/trade-types/options/digital-options/up-and-down/',
    options: 'Was sind digitale Options?',
    multipliersurl: '/trade-types/multiplier/',
    compare_accounts: 'CFDs vergleichen  Konten',
    learnmore: 'CFD-Handel',
    learnmoreurl: '/de/trade-types/cfds/',
    learn_more_link: 'Erfahren Sie mehr',
  },
  KO: {
    optionsurl: '/ko/trade-types/options/digital-options/up-and-down/',
    options: '디지털 옵션이란 무엇인가요?',
    multipliersurl: '/trade-types/multiplier/',
    compare_accounts: 'CFD  계정 비교',
    learnmore: 'CFD 트레이딩',
    learnmoreurl: '/ko/trade-types/cfds/',
    learn_more_link: '자세히 알아보기',
  },
  PT: {
    optionsurl: '/pt/trade-types/options/digital-options/up-and-down/',
    options: 'O que são Opções Digital?',
    multipliersurl: '/trade-types/multiplier/',
    compare_accounts: 'Compare contas de CFDs',
    learnmore: 'Negociação de CFDs',
    learnmoreurl: '/pt/trade-types/cfds/',
    learn_more_link: 'Saiba mais',
  },
  PL: {
    optionsurl: '/pl/trade-types/options/digital-options/up-and-down/',
    options: 'Czym są opcje cyfrowe?',
    multipliersurl: '/trade-types/multiplier/',
    compare_accounts: 'Porównaj konta CFD',
    learnmore: 'Handlowanie kontraktami na różnice kursowe',
    learnmoreurl: '/pl/trade-types/cfds/',
    learn_more_link: 'uzyskać lepszy zwrot z udanych transakcji',
  },
  RU: {
    optionsurl: '/ru/trade-types/options/digital-options/up-and-down/',
    options: 'Что такое цифровые опционы?',
    multipliersurl: '/trade-types/multiplier/',
    compare_accounts: 'Сравнение счетов CFD',
    learnmore: 'Торговля CFD',
    learnmoreurl: '/ru/trade-types/cfds/',
    learn_more_link: 'Подробнее',
  },
  FR: {
    optionsurl: '/fr/trade-types/options/digital-options/up-and-down/',
    options: "Qu'est-ce que les options numériques ?",
    multipliersurl: '/trade-types/multiplier/',
    compare_accounts: 'Comparez les CFD des comptes',
    learn_more: 'Trading de CFD',
    learnmoreurl: '/fr/trade-types/cfds/',
    learn_more_link: 'En savoir plus',
  },
  IT: {
    optionsurl: '/it/trade-types/options/digital-options/up-and-down/',
    options: 'Cosa sono le opzioni digitali?',
    multipliersurl: '/trade-types/multiplier/',
    compare_accounts: 'Confronta i conti  CFD',
    learnmore: 'Trading su CFD',
    learnmoreurl: '/it/trade-types/cfds/',
    learn_more_link: 'Scopri di più',
  },
  TH: {
    optionsurl: '/th/trade-types/options/digital-options/up-and-down/',
    options: 'ตราสารสิทธิดิจิทัลคืออะไร?',
    multipliersurl: '/trade-types/multiplier/',
    compare_accounts: 'เปรียบเทียบบัญชี CFD',
    learnmore: 'การซื้อขาย CFD',
    learnmoreurl: '/th/trade-types/cfds/',
    learn_more_link: 'เรียนรู้เพิ่มเติม',
  },
  TR: {
    optionsurl: '/tr/trade-types/options/digital-options/up-and-down/',
    options: 'Dijital opsiyonlar nelerdir?',
    multipliersurl: '/trade-types/multiplier/',
    compare_accounts: "CFD'leri karşılaştırın  hesapları",
    learnmore: 'CFD ticareti',
    learnmoreurl: '/tr/trade-types/cfds/',
    learn_more_link: 'Daha fazla bilgi edin',
  },
  VI: {
    optionsurl: '/vi/trade-types/options/digital-options/up-and-down/',
    options: 'Quyền chọn Digital là gì?',
    multipliersurl: '/trade-types/multiplier/',
    compare_accounts: 'So sánh các tài khoản CFD',
    learnmore: 'Giao dịch CFD',
    learnmoreurl: '/vi/trade-types/cfds/',
    learn_more_link: 'Tìm hiểu thêm',
  },
  ZH_CN: {
    optionsurl: '/zh-cn/trade-types/options/digital-options/up-and-down/',
    options: '什么是 digital 期权?',
    multipliersurl: '/trade-types/multiplier/',
    compare_accounts: '比较差价合约  账户',
    learnmore: '差价合约交易',
    learnmoreurl: '/zh-cn/trade-types/cfds/',
    learn_more_link: '了解更多',
  },
  ZH_TW: {
    optionsurl: '/zh-tw/trade-types/options/digital-options/up-and-down/',
    options: '甚麼是 digital 期權?',
    multipliersurl: '/trade-types/multiplier/',
    compare_accounts: '比較差價合約  帳戶',
    learnmore: '差價合約交易',
    learnmoreurl: '/zh-tw/ko/trade-types/cfds/',
    learn_more_link: '了解更多',
  },
}

function selectLanguage(index) {
  cy.findAllByTestId('dt_settings_language_button').eq(index).click()
}

function validateContent(languageCode) {
  const content = languageContent[languageCode]
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="dt_traders_hub_home_button"]').length === 0) {
      cy.reload()
      cy.findByTestId('dt_traders_hub_home_button', { timeout: 10000 }).should(
        'be.visible'
      )
    }
  })
  cy.findByRole('link', { name: 'options' })
    .should('be.visible')
    .invoke('attr', 'target', '_self')
    .click()
  cy.url().should('contain', content.optionsurl)
  cy.findByRole('heading', { name: content.options }).should('be.visible')
  cy.go('back')
  cy.wait(1000)
  cy.findByRole('link', { name: 'multipliers' })
    .should('be.visible')
    .invoke('attr', 'target', '_self')
    .click()
  cy.url().should('contain', '/trade-types/multiplier/')
  cy.findByRole('heading', { name: 'Multipliers' }).should('be.visible')
  cy.go('back')
  cy.wait(1000)
  cy.findByRole('link', { name: content.learn_more_link })
    .should('be.visible')
    .invoke('attr', 'target', '_self')
    .click()
  cy.url().should('contain', content.learnmoreurl)
  cy.findByRole('heading', { name: content.learnmore }).should('be.visible')
  cy.go('back')
}

describe("TRAH-2997 - Validate the hyperlinks on Trader's hub in all the languages", () => {
  beforeEach(() => {
    cy.c_login()
  })
  it('Should navigate to all links in traders hub home page and validate its redirection in desktop for all the languages', () => {
    cy.c_visitResponsive('/appstore/traders-hub', 'large')
    cy.findAllByTestId('dt_icon').eq(0).click()
    cy.findAllByTestId('dt_settings_language_button').then(($languages) => {
      const totalLanguages = $languages.length
      for (let i = 1; i < totalLanguages; i++) {
        selectLanguage(i)
        validateContent(Object.keys(languageContent)[i])
        cy.findAllByTestId('dt_icon').eq(0).click()
      }
    })
  })
})

/* function selectLanguage(index) {
    cy.findAllByTestId('dt_settings_language_button').eq(index).click()
}

function navigateToLinkAndValidate(linkName, content) {
    cy.findByRole('link', { name: linkName }).should('be.visible').invoke('attr', 'target', '_self').then(($link) => {
        cy.wrap($link).click();
        cy.url().should('contain', content[`${linkName}url`]);
        cy.findByRole('heading', { name: content[linkName] }).should('be.visible');
        cy.go('back');
        cy.wait(1000);
    });
}


function validateContent(languageCode) {
    const content = languageContent[languageCode];

    cy.get('body').then(($body) => {
        if ($body.find('[data-testid="dt_traders_hub_home_button"]').length === 0) {
            cy.reload();
            cy.findByTestId('dt_traders_hub_home_button', { timeout: 10000 }).should('be.visible');
        }
    });

    navigateToLinkAndValidate('options', content);
    navigateToLinkAndValidate('multipliers', content);
    //navigateToLinkAndValidate(content.learn_more_link, content);
}

describe("TRAH-2997 - Validate the hyperlinks on Trader's hub in all the languages", () => {
    beforeEach(() => {
        cy.c_login();
    });

    it('Should navigate to all links in traders hub home page and validate its redirection in desktop for all the languages', () => {
        cy.c_visitResponsive('/appstore/traders-hub', 'large');
        cy.findAllByTestId('dt_icon').eq(0).click();
        cy.findAllByTestId('dt_settings_language_button').then($languages => {
            const totalLanguages = $languages.length;
            for (let i = 0; i < totalLanguages; i++) {
                selectLanguage(i);
                validateContent(Object.keys(languageContent)[i]);
                cy.findAllByTestId('dt_icon').eq(0).click();
            }
        });
    });
});*/
