require("dotenv").config()
const { defineConfig } = require("cypress")
const {createAccountReal, createAccountVirtual, verifyEmail} = require('./cypress/support/helper/accountCreationUtility');
const {authorizeCall, checkBalance } = require('./cypress/support/helper/balanceCall');
const { registerNewApplicationId } = require('./cypress/support/helper/applicationRegister');

const DerivAPI = require('@deriv/deriv-api/dist/DerivAPI')
const WebSocket = require('ws');

const appId = process.env.E2E_STD_CONFIG_APPID
const websocketURL = `wss://${process.env.E2E_STD_CONFIG_SERVER}/websockets/v3`
let connection;
let api;
let newAppId = null;
//const gViewPortSize = {small: 'phone-xr', large: 'macbook-16'} //TODO Use enum
 
module.exports = defineConfig({
  e2e: {
    projectId: "rjvf4u",
    baseUrl: "https://staging-app.deriv.com/",
    defaultCommandTimeout: 15000,
    supportFile: "cypress/support/e2e.js",
    experimentalWebKitSupport: true,
    chromeWebSecurity: false,
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.family === 'chromium') {
          launchOptions.args.push('--use-fake-ui-for-media-stream')
          launchOptions.args.push('--use-fake-device-for-media-stream')
          launchOptions.args.push('--use-file-for-fake-video-capture=cypress/fixtures/kyc/pass_1.y4m')
        }
        
        return launchOptions
      }),
      on('task', {
        getPRAppId() {
          console.log('Current PR appId = ' + newAppId);
          return newAppId;
        },
        setAppId(id) {
          newAppId = id;
          console.log('Current PR appId = ' + newAppId);
          return null;
        }
      }),
      on('task', {
        wsConnect() {
          // Check if there is an existing connection and close it if open
          if(connection?.readyState === WebSocket.OPEN) {
            connection.close();
            console.log('Previous connection closed');
          }
          // Establish a new connection
          connection = new WebSocket(
            `${websocketURL}?l=EN&app_id=${appId}&brand=deriv`
          );
          connection.onopen = () => console.log('Connection opened successfully');
          connection.onerror = error => console.error('Connection error:', error);

          api = new DerivAPI({ connection });

          return null;
        },
        wsDisconnect() {
          if (connection?.readyState === WebSocket.OPEN) {
            connection.close();
            console.log('Connection closed successfully');
          } else {
            console.log('Connection is not open or has already been closed');
          }
          // Reset connection and api to ensure clean state
          connection = null;
          api = null;
        
          return null;
        },
        async createRealAccountTask({country_code, currency}) {
          try {
            const realAccountDetails = await createAccountReal(api, country_code, currency);
            return realAccountDetails;
          } catch (error) {
            console.error('Error creating account:', error);
            throw error;
          }
        },
        async createVirtualAccountTask({country_code}) {
          try {
              const virtualAccountDetails = await createAccountVirtual(api, country_code);
              return virtualAccountDetails;
          } catch (error) {
              console.error('Error creating virtual account:', error);
              throw error;
          }
      },
        async verifyEmailTask() {
        try {
          const accountEmail = await verifyEmail(api);
          return accountEmail;
        } catch (error) {
          console.error('Error verifying email:', error);
          throw error;
      }
      },
      setVerificationCode: (verificationCode) => {
        process.env.E2E_EMAIL_VERIFICATION_CODE = verificationCode;
        return null;
      },
      async authorizeCallTask(authToken){
        try {
          const authCall = await authorizeCall(api, authToken);
          return authCall;
        } catch (e) {
          console.error('Authorization failed', e)
          throw e
        }
      },
      async checkBalanceTask(){ 
        try {
          const balance_stream = await checkBalance(api, process.env.E2E_OAUTH_TOKEN);
          return balance_stream;
        } catch (e) {
          console.error('Operation failed', e)
          throw e
        }
      },
      async registerNewAppIDTask(){ 
        let registerRedirectURI = process.env.E2E_APP_REGISTER_URL + '/redirect'
        let registerVerificationURI = process.env.E2E_APP_REGISTER_URL + '/verify'
        try {
          const newApplicationID = await registerNewApplicationId(api, process.env.E2E_APP_REGISTER, 
            process.env.E2E_APP_REGISTER_URL, registerRedirectURI, registerVerificationURI
        );
        return newApplicationID;
        } catch (e) {
          console.error('Operation failed', e)
          throw e
        }
      }
      });

      return config;  // Return the config object is important for custom configurations to take effect
    },
  },
  env: {
    runFromPR: process.env.E2E_RUN_FROM_PR,
    stagingUrl: "https://staging-app.deriv.com/",
    prodURL: "https://app.deriv.com/",
    derivComProdURL: "https://deriv.com/",
    derivComStagingURL: "https://staging.deriv.com/",
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
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      p2pStandardAccountWithAds: {
        ID: process.env.E2E_LOGIN_ID_P2P_STANDARDACCOUNTWITHADS,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      p2pStandardAccountWithoutAds: {
        ID: process.env.E2E_LOGIN_ID_P2P_STANDARDACCOUNTWITHOUTADS,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      p2pSortFunctionality: {
        ID: process.env.E2E_LOGIN_ID_P2P_SORT,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      p2pFixedRate: {
        ID: process.env.E2E_LOGIN_ID_P2P_FIXEDRATE,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      p2pFloating: {
        ID: process.env.E2E_P2P_FLOATING,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      p2pFloatingSellAd1: {
        ID: process.env.E2E_LOGIN_ID_P2P_FLOATINGRATE_SELLAD_1,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      p2pFloatingSellAd2: {
        ID: process.env.E2E_LOGIN_ID_P2P_FLOATINGRATE_SELLAD_2,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      p2pVerifyEmptyStateAdScreen: {
        ID: process.env.E2E_LOGIN_ID_P2P_EMPTYSTATE,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      p2pFilterPaymentMethodBase: {
        ID: process.env.E2E_P2P_FILTER_PM_BASE,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      p2pFilterPaymentMethodSelector: {
        ID: process.env.E2E_P2P_FILTER_PM_SELECTOR,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      allcrypto: {
        ID: process.env.E2E_CRYPTO,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD,
      },
      cashierLegacy: {
        ID: process.env.E2E_LOGIN_ID_CASHIER_LEGACY,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      cashierLegacyNonUSD: {
        ID: process.env.E2E_LOGIN_ID_CASHIER_LEGACY_NON_USD,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      diel: {
        ID: process.env.E2E_DIEL_LOGIN,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD,
      },
      eu: {
        ID: process.env.E2E_EU_LOGIN,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD,
      },
      eligibleMigration1: {
        ID: process.env.E2E_WALLETS_MIGARTION_MAIN,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      eligibleMigration2: {
        ID: process.env.E2E_WALLETS_MIGARTION_BACKUP1,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      eligibleMigration3: {
        ID: process.env.E2E_WALLETS_MIGARTION_BACKUP2,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      eligibleMigration4: {
        ID: process.env.E2E_WALLETS_MIGARTION_BACKUP3,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      eligibleMigration5: {
        ID: process.env.E2E_WALLETS_MIGARTION_BACKUP4,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      walletloginEmail: {
        ID: process.env.E2E_DERIV_LOGIN_WALLET,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      walletloginEmailMobile: {
        ID: process.env.E2E_DERIV_LOGIN_WALLET_MOBILE,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      walletMigrationNewClient: {
        ID: process.env.E2E_WALLET_MIGRATION_NEWCLIENT,
        PSWD: process.env.E2E_DERIV_PASSWORD,
      },
      walletMigrationNoVRTC: {
        ID: process.env.E2E_WALLET_MIGRATION_NO_VRTC,
        PSWD: process.env.E2E_DERIV_PASSWORD,
      },
      walletMigrationVRTConly: {
        ID: process.env.E2E_WALLET_MIGRATION_VRTCONLY,
        PSWD: process.env.E2E_DERIV_PASSWORD,
      },
      walletMigrationNoCurrency: {
        ID: process.env.E2E_WALLET_MIGRATION_NO_CURRENCY,
        PSWD: process.env.E2E_DERIV_PASSWORD,
      },
      walletMigratioNonUSD: {
        ID: process.env.E2E_WALLET_MIGRATION_NON_USD,
        PSWD: process.env.E2E_DERIV_PASSWORD,
      },
      walletMigrationP2P:{
        ID: process.env.E2E_WALLET_MIGRATIION_P2P,
        PSWD: process.env.E2E_DERIV_PASSWORD,
      },
      walletMigrationPA:{
        ID: process.env.E2E_WALLET_MIGRATION_PA,
        PSWD: process.env.E2E_DERIV_PASSWORD,
      },
      walletMigrationPAclient:{
        ID: process.env.E2E_WALLET_MIGRATION_PA_CLIENT,
        PSWD: process.env.E2E_DERIV_PASSWORD,
      }
    },
    production:{
      masterUser:{
        ID: process.env.E2E_DERIV_LOGIN_PROD,
        PSWD: process.env.E2E_DERIV_PASSWORD_PROD
      },
      dBot: {
        ID: process.env.E2E_LOGIN_ID_PROD_DBOT,
        PSWD: process.env.E2E_QA_ACCOUNT_PASSWORD
      },
      cashierWithdrawal:{
        ID: process.env.E2E_CASHIER_WITHDRAWAL_PROD,
        PSWD: process.env.E2E_CASHIER_PROD_PASSWORD
      },
      wallets: {
        ID: process.env.E2E_WALLETS_LOGIN_PROD,
        PSWD: process.env.E2E_WALLETS_PASSWORD_PROD
      }
    }
  },
    RegionEU: "/?region=at",
    RegionROW: "/?region=za",
    skipROWTests: false,
    email: "test@example.com",
    viewPortSize: "small",
    baseUrl: process.env.CYPRESS_BASE_URL,
    loginEmail: process.env.E2E_DERIV_LOGIN,
    loginPassword: process.env.E2E_DERIV_PASSWORD,
    walletEmail: process.env.E2E_DERIV_LOGIN_WALLET,
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
    smtConfigAppId: process.env.E2E_SMT_CONFIG_APPID,
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
    dbotStageAppId: process.env.E2E_DBOT_STG_APPID,
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
    user_password: process.env.E2E_DERIV_PASSWORD,
    citizenshipOnfidoROW: process.env.E2E_CITIZENSHIP_ROW_ONFIDO,
    citizenshipIDVROW: process.env.E2E_CITIZENSHIP_ROW_IDV,
    citizenshipMF: process.env.E2E_CITIZENSHIP_MF,
    dielCountry: "South Africa",
    updatedAppId : process.env.E2E_UPDATED_APPID,
    actualAmount : process.env.E2E_ACTUAL_AMOUNT,
    appRegisterID: process.env.E2E_APP_REGISTER,
    appRegisterUrl: process.env.E2E_APP_REGISTER_URL,
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