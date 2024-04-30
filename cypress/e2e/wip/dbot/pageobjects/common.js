class Common {
  removeCurrencyCode = (text) => {
    return text.replace('USD', '').trim()
  }

  removeComma = (text) => {
    return text.replace(/,/g, '').trim()
  }
}

export default Common
