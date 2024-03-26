const createAccountReal = require('../support/helper/accountCreationUtiliy')

module.exports = (on, config) => {
  on('task', {
    async createRealAccountTask() {
      try {
        const accountDetails = await createAccountReal()
        return accountDetails // Return the result so it can be used in tests
      } catch (error) {
        console.error('Error creating account:', error)
        throw error // Rethrow the error so Cypress is aware the task failed
      }
    },
  })
}
