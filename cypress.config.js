const { defineConfig } = require('cypress')
require('dotenv').config()

//const gViewPortSize = {small: 'phone-xr', large: 'macbook-16'} //TODO Use enum

module.exports = defineConfig({
  e2e: {
    projectId: 'qc89n6',
    setupNodeEvents(on, config) {},
    baseUrl: 'https://app.deriv.com',
    //baseUrl: 'https://deriv-app-git-fork-yauheni-deriv-evgeniygetchangeablefieldbug.binary.sx',
    //baseUrl: 'https://deriv-app-git-fork-lubega-deriv-wall-2270-add-try-fiat-onramp.binary.sx',
    //baseUrl: 'https://deriv-app-git-fork-maryia-deriv-maryia-dtra-147trade-typ-456a1b.binary.sx',
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
    mt5Login: process.env.MT5_LOGIN,
    mt5Password: process.env.MT5_PASSWORD,
    endpointPath: process.env.ENDPOINT_PATH,
    appstorePath: process.env.APPSTORE_PATH,
    configServer: process.env.E2E_CONFIG_SERVER,
    configAppId: process.env.E2E_CONFIG_APPID,
    oAuthUrl: process.env.E2E_OAUTH_URL,
    oE2EToken: process.env.E2E_TOKEN,
    tradersHubUrl: 'appstore/traders-hub'
  },  
  retries: {
      "runMode": 2,
      "openMode": 0
    },
})
