require('dotenv').config()
const DerivAPI = require('@deriv/deriv-api/dist/DerivAPI')

const appId = process.env.E2E_STD_CONFIG_APPID
const websocketURL = `wss://${process.env.E2E_STD_CONFIG_SERVER}/websockets/v3`

const connection = new WebSocket(
  `${websocketURL}?l=EN&app_id=${appId}&brand=deriv`
)
const api = new DerivAPI({ connection })

const connectionWS = async (url) => {
  this.handlers = {}
  this.request_id = 0
  this.ws = new WebSocket(url)
  setupWebSocket()
}

const setupWebSocket = async () => {
  this.ws.onmessage = (data_str) => {
    // Check for rate limit
    if (JSON.stringify(data_str).includes('error')) {
      console.log('Error: ', data_str)
      fail('An error occoured')
    }
    const data = JSON.parse(data_str.data)
    const req_id = data.req_id
    if (req_id !== undefined && req_id in this.handlers) {
      this.handlers[data.req_id](data)
      delete this.handlers[data.req_id]
    }
  }
}

const closews = async () => {
  this.ws.close()
}

const callApi = async (params, responseHandler = undefined) => {
  return new Promise((resolve) => {
    const req_id = this.request_id++
    params.req_id = req_id
    this.handlers[req_id] = (data) => {
      console.log(data.req_id)
      console.log(params.req_id)
      if (data.req_id == params.req_id) {
        console.log(responseHandler)
        resolve(responseHandler ? responseHandler(data) : data)
      }
    }
    this.wsh.send(JSON.stringify(params))
  })
}

const makeRequests = async (calls) => {
  this.ws.onopen = calls
}

const authorizeAPI = async (authToken) => {
  callApi({ authorize: authToken })
}

const balanceAPI = async () => {
  callApi({ balance: 1, subscribe: 1 })
}

module.exports = { connectionWS, makeRequests, authorizeAPI, balanceAPI }
