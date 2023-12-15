const { defineConfig } = require('cypress')
require('dotenv').config()

//const gViewPortSize = {small: 'phone-xr', large: 'macbook-16'} //TODO Use enum

module.exports = defineConfig({
  e2e: {
    projectId: 'qc89n6',
    setupNodeEvents(on, config) {},
    baseUrl: 'https://test-app.deriv.com',
    //baseUrl: 'https://deriv-app-git-fork-yauheni-deriv-evgeniygetchangeablefieldbug.binary.sx',
    //baseUrl: 'https://deriv-app-git-fork-lubega-deriv-wall-2270-add-try-fiat-onramp.binary.sx',
    //baseUrl: 'https://deriv-app-git-fork-maryia-deriv-maryia-dtra-147trade-typ-456a1b.binary.sx',
    defaultCommandTimeout: 15000,
    supportFile: "cypress/support/e2e.js",
    experimentalWebKitSupport: true,
    chromeWebSecurity: false,
  },
  env: {
    RegionEU: '/?region=at',
    RegionROW: '/?region=za',
    skipROWTests: false,
    email: 'test@example.com',
    viewPortSize: 'small',
    loginEmail: process.env.E2E_DERIV_LOGIN,
    loginPassword: process.env.E2E_DERIV_PASSWORD,
    doughflowLoginEmail:  process.env.E2E_DOUGHFLOW_LOGIN,
    doughflowLoginPassword: process.env.E2E_DOUGHFLOW_PASSWORD,
    qaBoxLoginEmail: process.env.E2E_QABOX_LOGIN,
    qaBoxLoginPassword: process.env.E2E_QABOX_PASSWORD,
    qaBoxBaseUrl: process.env.E2E_QABOX_BASEURL,
    mainQaBoxBaseUrl: process.env.E2E_MAIN_QABOX_BASEURL,
    mt5Login: process.env.E2E_MT5_LOGIN,
    mt5Password: process.env.E2E_MT5_PASSWORD,
    mt5BaseUrl: process.env.E2E_MT5_BASEURL,
    endpointPath: process.env.ENDPOINT_PATH,
    appstorePath: process.env.APPSTORE_PATH,
    configServer: process.env.E2E_CONFIG_SERVER,
    configAppId: process.env.E2E_CONFIG_APPID,
    onrampConfigAppId: process.env.E2E_ONRAMP_CONFIG_APPID,
    onrampProviderUrl: process.env.E2E_ONRAMP_PROVIDER_URL,
    doughflowConfigServer: process.env.E2E_DOUGHFLOW_CONFIG_SERVER,
    doughflowConfigAppId: process.env.E2E_DOUGHFLOW_CONFIG_APPID,
    oAuthUrl: process.env.E2E_OAUTH_URL,
    demoOAuthUrl: process.env.E2E_DEMO_WALLET_OAUTH_URL,
    demoOAuthToken: process.env.E2E_DEMO_OAUTH_TOKEN,
    oAuthToken: process.env.E2E_OAUTH_TOKEN,
    doughflowOAuthUrl: process.env.E2E_DOUGHFLOW_OAUTH_URL,
    doughflowOAuthToken: process.env.E2E_DOUGHFLOW_OAUTH_TOKEN,
    walletsWithdrawalUrl: process.env.E2E_WALLETS_WITHDRAWAL_URL,
    walletsWithdrawalCode: process.env.E2E_WALLETS_WITHDRAWAL_CODE,
    HMACKey: process.env.E2E_HMAC_KEY,
    tradersHubUrl: 'appstore/traders-hub'
  },  
  retries: {
      "runMode": 2,
      "openMode": 0
    },
})
