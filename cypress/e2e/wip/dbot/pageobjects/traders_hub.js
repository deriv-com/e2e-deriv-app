class TradersHub {
  get openBotButton() {
    return cy.get("a[href='/bot']");
  }
}

export default new TradersHub();
