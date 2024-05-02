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
      name: appRegisterName,
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

module.exports = { registerNewApplicationId }
