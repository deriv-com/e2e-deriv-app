const { defineConfig } = require('cypress')
require('dotenv').config()

//const gViewPortSize = {small: 'phone-xr', large: 'macbook-16'} //TODO Use enum

module.exports = defineConfig({
  e2e: {
    projectId: 'qc89n6',
    setupNodeEvents(on, config) {},
    baseUrl: 'https://app.deriv.com',
    defaultCommandTimeout: 15000,
    supportFile: "cypress/support/e2e.js",
    experimentalWebKitSupport: true,
  },
  env: {
    RegionEU: '/?region=at',
    RegionROW: '/?region=za',
    skipROWTests: false,
    email: 'test@example.com',
    viewPortSize: 'small',
    loginEmail: process.env.DERIV_LOGIN,
    loginPassword: process.env.DERIV_PASSWORD,
    endpointPath: process.env.ENDPOINT_PATH,
    appstorePath: process.env.APPSTORE_PATH,
    configServer: process.env.CONFIG_SERVER,
    configAppId: process.env.CONFIG_APPID,
    oAuthUrl: process.env.OAUTH_URL,
    tradersHubUrl: 'appstore/traders-hub'
  },  
  retries: {
      "runMode": 2,
      "openMode": 0
    },
})
