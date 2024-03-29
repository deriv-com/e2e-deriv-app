require("dotenv").config()
const { defineConfig } = require("cypress")
const {createAccountReal, createAccountVirtual} = require('./cypress/support/helper/accountCreationUtility');

//const gViewPortSize = {small: 'phone-xr', large: 'macbook-16'} //TODO Use enum
 
module.exports = defineConfig({
  e2e: {
    projectId: "rjvf4u",
    setupNodeEvents(on, config) {},
    baseUrl: "https://staging-app.deriv.com",
    defaultCommandTimeout: 15000,
    supportFile: "cypress/support/e2e.js",
    experimentalWebKitSupport: true,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      on('task', {
        async createRealAccountTask() {
          try {
            const realAccountDetails = await createAccountReal();
            return realAccountDetails;
          } catch (error) {
            console.error('Error creating account:', error);
            throw error;
          }
        },
        async createVirtualAccountTask() {
          try {
              const virtualAccountDetails = await createAccountVirtual();
              return virtualAccountDetails;
          } catch (error) {
              console.error('Error creating virtual account:', error);
              throw error;
          }
      },
      });

      return config;  // Return the config object is important for custom configurations to take effect
    },
  },
  env: {
    stagingUrl: "https://staging-app.deriv.com/",
    prodURL: "https://app.deriv.com/",
    derivComProdURL: "https://deriv.com/",
    smartTraderUrl: {
      staging: "https://staging-smarttrader.deriv.com/en/trading",
      prod: "https://smarttrader.deriv.com/en/trading",
    },
    binaryBotUrl: {
      staging: "https://staging-bot.deriv.com/?l=en",
      prod: "https://bot.deriv.com/?l=en",
    },
    credentials: {
    test:{
      masterUser: {
        ID: process.env.E2E_DERIV_LOGIN,
        PSWD: process.env.E2E_DERIV_PASSWORD
      },
      dBot: {
        ID: process.env.E2E_LOGIN_ID_DBOT,
        PSWD: process.env.E2E_LOGIN_PSWD_DBOT
      },
      p2pFixedRate: {
        ID: process.env.E2E_LOGIN_ID_P2P_FIXEDRATE,
        PSWD: process.env.E2E_PSWD_P2P
      },
      p2pFloating: {
        ID: process.env.E2E_P2P_FLOATING,
        PSWD: process.env.E2E_PSWD_P2P
      },
      diel: {
        ID: process.env.E2E_DIEL_LOGIN,
        PSWD: process.env.E2E_DIEL_PASSWORD,
      },
      eu: {
        ID: process.env.E2E_EU_LOGIN,
        PSWD: process.env.E2E_EU_PASSWORD,
      },
    },
    production:{
      masterUser:{
        ID: process.env.E2E_DERIV_LOGIN_PROD,
        PSWD: process.env.E2E_DERIV_PASSWORD_PROD
      },
      dBot: {
        ID: process.env.E2E_LOGIN_ID_PROD_DBOT,
        PSWD: process.env.E2E_LOGIN_PSWD_PROD_DBOT
      },
      cashierWithdrawal:{
        ID: process.env.E2E_CASHIER_WITHDRAWAL_PROD,
        PSWD: process.env.E2E_CASHIER_PROD_PASSWORD
      }
    }
  },
    RegionEU: "/?region=at",
    RegionROW: "/?region=za",
    skipROWTests: false,
    email: "test@example.com",
    viewPortSize: "small",
    loginEmail: process.env.E2E_DERIV_LOGIN,
    walletloginEmail: process.env.E2E_DERIV_LOGIN_WALLET,
    loginPassword: process.env.E2E_DERIV_PASSWORD,
    p2pbuyloginEmail: process.env.E2E_P2P_BUY,
    p2psellloginEmail: process.env.E2E_P2P_SELL,
    loginEmailProd: process.env.E2E_DERIV_LOGIN_PROD,
    loginPasswordProd: process.env.E2E_DERIV_PASSWORD_PROD,
    prodServer: process.env.E2E_PROD_SERVER,
    prodAppId: process.env.E2E_PROD_APPID,
    stgAppId: process.env.E2E_STG_APPID,
    doughflowLoginEmail: process.env.E2E_DOUGHFLOW_LOGIN,
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
    stdConfigServer: process.env.E2E_STD_CONFIG_SERVER,
    stdConfigAppId: process.env.E2E_STD_CONFIG_APPID,
    oAuthUrl: process.env.E2E_OAUTH_URL,
    demoOAuthUrl: process.env.E2E_DEMO_WALLET_OAUTH_URL,
    demoOAuthToken: process.env.E2E_DEMO_OAUTH_TOKEN,
    oAuthToken: process.env.E2E_OAUTH_TOKEN,
    doughflowOAuthUrl: process.env.E2E_DOUGHFLOW_OAUTH_URL,
    doughflowOAuthToken: process.env.E2E_DOUGHFLOW_OAUTH_TOKEN,
    walletsWithdrawalCode: process.env.E2E_WALLETS_WITHDRAWAL_CODE,
    verificationUrl:  process.env.E2E_WALLETS_PASSWORD_URL,
    HMACKey: process.env.E2E_HMAC_KEY,
    username_cr_unauthenticated: process.env.E2E_USENAME_BOT,
    password: process.env.E2E_PASS_BOT,
    tradersHubUrl: "appstore/traders-hub",
    emailVerificationCode: process.env.E2E_EMAIL_VERIFICATION_CODE,
    emailUser: process.env.E2E_AUTH_EMAIL_USER,
    emailPassword: process.env.E2E_AUTH_EMAIL_PASSWORD,
    event_email_url: process.env.E2E_EVENTS_EMAIL,
    MAILISK_API_KEY: process.env.E2E_MAILISK_API_KEY, // the variable name should be like MAILISK_API_KEY as per mailisk documentation
    mailiskNamespace: process.env.E2E_MAILISK_NAMESPACE,
    diel_country_list: [
      "Ecuador",
      "South Africa",
      "Brazil",
      "Sri Lanka",
      "Uruguay",
      "Switzerland",
    ],
    CoROnfidoROW: process.env.E2E_COUNTRY_OF_RESI_ROW_ONFIDO,
    CoRIDVROW: process.env.E2E_COUNTRY_OF_RESI_ROW_IDV,
    CoRMF: process.env.E2E_COUNTRY_OF_RESI_MF,
    user_password: process.env.E2E_USERPASSWORD,
    citizenshipOnfidoROW: process.env.E2E_CITIZENSHIP_ROW_ONFIDO,
    citizenshipIDVROW: process.env.E2E_CITIZENSHIP_ROW_IDV,
    citizenshipMF: process.env.E2E_CITIZENSHIP_MF,
    dielCountry: "South Africa",
    countries: {
      ZA: "South Africa",
      CO: "Colombia",
      ID: "Indonesia",
      ES: "Spain",
      KE: "Kenya",
    },
    nationalIDNum: {
      ID: "1010101010101010",
      KE: "10101010",
      ZA: "1234567890111",
    },
    taxIDNum: {
      CO: "1234567890",
      KE: "P000111111A",
      ZA: "1234567890",
      ES: "12345678A",
    },
    accountCurrency: {
      USD: "US Dollar",
      EUR: "Euro",
      GBP: "Pound Sterling",
      AUD: "Australian Dollar",
      BTC: "Bitcoin",
    },
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
})
