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

export function generateRandomPassword(length) {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numberChars = '0123456789'
  const allChars = lowercaseChars + uppercaseChars + numberChars

  let password = ''

  password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]
  password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]
  password += numberChars[Math.floor(Math.random() * numberChars.length)]

  while (password.length < length) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  return password
}
