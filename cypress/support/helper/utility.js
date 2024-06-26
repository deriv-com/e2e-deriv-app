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

/**
 * Used to calculate and return coversion fee for internal account transfers having different currencies
 * @param {number} amountTransferred
 * @returns {number} conversion fee
 */
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
 * Generates a random name or string based on specified options.
 *
 * @param {Object} [options] - The options for name generation.
 * @param {boolean} [options.fakeProfile=false] - If true, generates a string without vowels.
 * @param {number} [options.length=8] - The length of the generated string.
 * @returns {string} A randomly generated string based on the specified options.
 * @example
 * const defaultName = generateRandomName();
 * console.log(defaultName); // e.g., "RtKlMnPq"
 * @example
 * const fakeName = generateRandomName({ fakeProfile: true });  // Generate a fake profile name (no vowels)
 * console.log(fakeName); // e.g., "BcDfGhJk"
 */
const VOWELS = new Set('aeiouAEIOU')
const ALL_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
const CONSONANTS = ALL_CHARACTERS.split('')
  .filter((char) => !VOWELS.has(char))
  .join('')

export function generateRandomName({ fakeProfile = false, length = 8 } = {}) {
  const characters = fakeProfile ? CONSONANTS : ALL_CHARACTERS
  return Array.from(
    { length },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join('')
}
