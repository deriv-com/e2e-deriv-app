const crypto = require('crypto')

const numbersGenerator = () => {
  let array = new Uint8Array(10)
  crypto.randomFillSync(array) // Synchronously fill the array with random bytes
  return Array.from(array, (byte) => byte % 10).join('')
}

const emailGenerator = () => {
  const vowels = 'aeiou'
  // Generate a random index for vowels
  const vowelIndex = crypto.randomInt(0, vowels.length) // 0 to 4
  // Generate a random number between 0 and 999
  const randomNumber = crypto.randomInt(0, 1000)

  return `qa+test${vowels[vowelIndex]}${randomNumber}@deriv.com`
}

const nameGenerator = () => {
  const vowels = 'aeiou'
  const consonants = 'bcdfghjklmnpqrstvwxyz'
  let name = ''

  for (let i = 0; i < 8; i++) {
    if (i < 2) {
      // First two characters are vowels
      const index = crypto.randomInt(0, vowels.length)
      name += vowels[index]
    } else {
      // Next six characters are consonants
      const index = crypto.randomInt(0, consonants.length)
      name += consonants[index]
    }
  }
  return name
}

module.exports = { numbersGenerator, emailGenerator, nameGenerator }
