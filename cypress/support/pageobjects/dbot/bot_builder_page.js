import { DOWNLOAD_PATH, FILEPATH } from './constants'
class BotBuilder {
  marketIndex = 1
  previewTabName = 'Local'

  get openStrategyButton() {
    return cy.xpath(
      "//span[contains(@class,'dc-btn__text') and text() = 'Open']"
    )
  }

  get fileInput() {
    return cy.get('input[type=file]')
  }

  get botBuilderTab() {
    return cy.get('#id-bot-builder')
  }

  get toolbarSaveButton() {
    return cy.get('#db-toolbar__save-button')
  }

  get saveStrategyModalTitle() {
    return cy.get('h3.dc-text')
  }

  get saveStrategyModalContent() {
    return cy.get('div.modal__content')
  }

  get botNameInput() {
    return cy.get("input[name='bot_name']")
  }

  get saveStrategyInputLabel() {
    return cy.get('label.dc-input__label')
  }

  get saveStrategyButton() {
    return cy.get('button.dc-btn--primary.modal__footer--button')
  }

  get blocklyMarket() {
    return cy.xpath(
      `((//*[@class='blocklyText' and text()='Market:']/..)/*[@class='blocklyEditableText'])[${this.marketIndex}]`
    )
  }

  get blocklyDropdown() {
    return cy.get('.goog-menuitem.goog-option')
  }

  get toolbarImportButton() {
    return cy.get('#db-toolbar__import-button')
  }

  get botPreviewModalTab() {
    return cy.xpath(
      `//*[contains(@class,'dc-tabs__item') and text() = '${this.previewTabName}']`
    )
  }

  get toolbarResetButton() {
    return cy.get('#db-toolbar__reset-button')
  }

  get confirmReset() {
    return cy.xpath("//span[contains(@class,'dc-btn__text') and text() = 'OK']")
  }

  get digitEvenLogo() {
    return cy.xpath(
      "//*[name()='use' and contains(@*,'ic-tradetype-digiteven')]"
    )
  }

  get digitOddLogo() {
    return cy.xpath(
      "//*[name()='use' and contains(@*,'ic-tradetype-digitodd')]"
    )
  }

  openBotBuilderTab = () => {
    this.botBuilderTab.should('be.visible').click()
  }

  pickDerivedMarket = () => {
    // cy.get('.blocklyEditableText').click();
    cy.get('.blocklyText.blocklyDropdownText').contains('Forex').click()
    // cy.contains('.goog-menuitem-content', 'Derived').click();
    cy.get('.goog-menuitem.goog-option').contains('Derived').click()
  }

  /**
   * Save a strategy from bot builder page
   * @param {*} strategyName File name
   */
  saveStrategyFromToolbar = (strategyName) => {
    this.toolbarSaveButton.click()
    this.saveStrategyModalTitle.should('have.text', 'Save Strategy')
    this.saveStrategyModalContent.should(
      'contain.text',
      'Enter your bot name, choose to save on your computer or Google Drive, and hit '
    )
    this.saveStrategyModalContent.should('contain.text', 'Save')
    this.saveStrategyInputLabel.should('have.text', 'Bot name')
    this.botNameInput.clear()
    this.botNameInput.type(strategyName)
    this.saveStrategyButton.click()
    cy.readFile(DOWNLOAD_PATH + `${strategyName}.xml`)
  }

  /**
   * Change market type and symbols
   * @param {*} index 1: Change market (eg. Derived), 2: Change market type (eg. Continuous Indices), 3: Change market symbol (eg. Volatility 10 Index)
   * @param value Market/Market type/Symbol name
   */
  changeMarketOnBlocklyWorkspace = (index, value) => {
    cy.wait(2000)
    this.marketIndex = index
    this.blocklyMarket.should('be.visible').click()
    this.blocklyDropdown.contains(value).click()
  }

  switchTabOnPreviewModal = (tabName) => {
    this.previewTabName = tabName
    this.botPreviewModalTab.should('be.visible').click()
  }

  /**
   * Import custom strategy from dashboard
   * @param strategyFileName File Name
   */
  importStrategyFromToolbar = (strategyFileName) => {
    this.toolbarImportButton.should('be.visible').click()
    this.switchTabOnPreviewModal('Local')
    this.fileInput.selectFile(FILEPATH + `${strategyFileName}.xml`, {
      force: true,
    })
    this.openStrategyButton.click({ force: true })
  }
}

export default BotBuilder
