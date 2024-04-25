import {
  connectionWS,
  makeRequests,
  authorizeAPI,
  balanceAPI,
} from '../../support/helper/balanceCall.js'

const authToken = process.env.E2E_OAUTH_TOKEN
const appId = process.env.E2E_STD_CONFIG_APPID
const websocketURL = `wss://${process.env.E2E_STD_CONFIG_SERVER}/websockets/v3`

describe('Checking the Balance', () => {
  it('should show balance call', () => {
    const wsh = connectionWS(`${websocketURL}?l=EN&app_id=${appId}&brand=deriv`)
    makeRequests(async () => {
      console.log(wsh)
      console.log(authToken)
      authorizeAPI(wsh, authToken)
      balanceAPI(wsh)
    })
  })
})
