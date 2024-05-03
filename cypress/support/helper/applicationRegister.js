require('dotenv').config()

const registerNewApplicationId = async (
  api,
  appRegisterID,
  appRegisterHomePage,
  appRegisterName,
  appRegisterReDirectUri,
  appRegistersScope,
  appRegisterVerificationUri
) => {
  try {
    const registerAppResponse = await api.basic({
      app_register: appRegisterID,
      homepage: appRegisterHomePage,
      name: appRegisterName`+${numbersGeneratorForName()}`,
      redirect_uri: appRegisterReDirectUri,
      scopes: appRegistersScope,
      verification_uri: appRegisterVerificationUri,
    })
    console.log(
      'The response of Register New Application Id is : ',
      registerAppResponse
    )
  } catch (e) {
    console.error('Operation failed', e)
    throw e
  }
}

const numbersGeneratorForName = () => {
  let array = new Uint8Array(4)
  crypto.randomFillSync(array) // Synchronously fill the array with random bytes
  return Array.from(array, (byte) => byte % 10).join('')
}

module.exports = { registerNewApplicationId }
