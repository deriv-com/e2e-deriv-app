///<reference types='cypress'/>
import '@testing-library/cypress/add-commands'

const screenSizes = [
    'small',
    'large',
]

describe('QATEST-20010 Withdrawal Request: Fiat - Different language', () => {

    beforeEach(() => {
        cy.clearAllCookies()
        cy.clearAllLocalStorage()
        cy.clearAllSessionStorage()
        cy.c_login()
        cy.fixture("wallets/cashier_old/languageDetails").as('languageDetails')
    })

    screenSizes.forEach((size) => {
        it(`should verify withdrawal request page with different languages for ${size} screen size`, () => {
            cy.get('@languageDetails').then((languageDetails) => {
                cy.c_visitResponsive(`cashier/withdrawal/?lang=${languageDetails.english.urlCode}`, size)
                cy.c_waitForLoader()
                let prevLanguage = languageDetails.english.urlCode
                Object.entries(languageDetails).forEach((language) => {
                    cy.log(`Verifying for ${language[0]}`)
                    if (size == 'small') {
                        cy.get('#dt_mobile_drawer_toggle').click()
                        cy.findByText(prevLanguage.toUpperCase(), { exact: true }).click()
                        cy.get(`#dt_settings_${language[1].urlCode.toUpperCase().replace('-', '_')}_button`).click()
                    } else if (size == 'large') {
                        cy.findByTestId('dt_toggle_language_settings').click()
                        cy.get(`#dt_settings_${language[1].urlCode.toUpperCase().replace('-', '_')}_button`).click()
                    }
                    cy.c_waitForLoader()
                    // TODO uncomment when https://app.clickup.com/t/20696747/WALL-3521 is fixed.
                    //cy.findByText(language[1].header).should('exist')  
                    cy.findByTestId('dt_empty_state_title').should('contain.text', language[1].beforeContent.summary)
                    cy.findByTestId('dt_empty_state_description').should('contain.text', language[1].beforeContent.description)
                    cy.findByTestId('dt_empty_state_action').should('contain.text', language[1].beforeContent.buttonText).click()
                    cy.findByTestId('dt_empty_state_title').should('contain.text', language[1].afterContent.summary)
                    cy.findByTestId('dt_empty_state_description').should('contain.text', language[1].afterContent.description)
                    cy.findByTestId('dt_empty_state_action').should('contain.text', language[1].afterContent.linkText)
                    prevLanguage = language[1].urlCode.replace('-', '_')
                    cy.c_rateLimit({waitTimeAfterError:15000})
                })
            })
        })
    })
})