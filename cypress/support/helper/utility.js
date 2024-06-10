/**
 * Used to generate Epoch.
 * @example generateEpoch()
 * @returns {EpochTimeStamp}
 */
export function generateEpoch() {
  return Math.floor(new Date().getTime() % 10000)
}

/**
 * Used to generate a random Account number.
 * @param {number} length
 * @returns {number}
 */
export const generateAccountNumberString = (length) => {
  let result = ''
  const characters = '0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export const calculateTransferFee = (amountTransferred) => {
  const percentFeeRate = 0.02 // 2% transfer fee
  const minimumFee = 0.01 // Minimum fee in USD
  const calculatedFee = amountTransferred * percentFeeRate
  return Math.max(calculatedFee, minimumFee)
}

/**
 * Returns the current date in the format "YYYY-MM-DD".
 *
 * @returns {string} The current date in the format "YYYY-MM-DD".
 */
export function getCurrentDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-based, so we add 1
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const generateCPFNumber = () => {
  const getRandomDigit = () => Math.floor(Math.random() * 10)
  return `0${getRandomDigit()}${getRandomDigit()}.${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}.${getRandomDigit()}${getRandomDigit()}${getRandomDigit()}-${getRandomDigit()}${getRandomDigit()}`
}

/**
 * @description Used to generate a random 8-character long name
 * @returns {string} Randomly generated 8-character string
 * @example
 * const randomName = generateRandomName();
 * console.log(randomName); // e.g., 'a1B2c3D4'
 */
export function generateRandomName() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
