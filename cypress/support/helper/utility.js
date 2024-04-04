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
