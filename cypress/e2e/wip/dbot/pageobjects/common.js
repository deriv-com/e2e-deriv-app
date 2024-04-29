class Common {
  get loader() {
    return cy.get("div[data-testid='dt_initial_loader']")
  }

  removeCurrencyCode = (text) => {
    return text.replace('USD', '').trim()
  }

  removeComma = (text) => {
    return text.replace(/,/g, '').trim()
  }
}

export default Common
