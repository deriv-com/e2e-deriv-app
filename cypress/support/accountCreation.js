const puppeteer = require('puppeteer');
const WebSocket = require('ws');
require('dotenv').config();
const DerivAPI = require('@deriv/deriv-api/dist/DerivAPI');
const app_id = process.env.APP_ID
const websocketURL = process.env.WEBSOCKET_URL
const auth_url = process.env.E2E_OAUTH_URL
const connection  = new WebSocket(`${websocketURL}?l=EN&app_id=${app_id}&brand=deriv`);
const api         = new DerivAPI({ connection })
// basic.ping().then(console.log); // Testing for connection

const emailGenerator = () => {
  const vowels = 'aeiou';    
  return `qa+test${vowels[Math.floor(Math.random() * 5)]}${Math.floor(Math.random() * 1000)}@deriv.com`
}

const randomEmail = emailGenerator();

const getVerificationCode = (async () => {
  // verifyEmail API call
  await api.basic.verifyEmail({
      "verify_email": `${randomEmail}`,
      "type": "account_opening"
    })
  // Visit /events to extract the email verification code
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.authenticate({
      username: process.env.EMAIL,
      password: process.env.PASSWORD
    });
  await page.goto(`${process.env.BASIC_AUTH_URL}/events`);
  
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  // Click on the last link on the page
  await page.evaluate(() => {
      const links = document.querySelectorAll('a');
      links[links.length - 1].click();
    });

  await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

  // Extract the href attribute of the last link and process it
  const href = await page.evaluate(() => {
      const links = document.querySelectorAll('a');
      const targetLink = links[links.length - 1].getAttribute('href');
      return targetLink
    });

  const codeMatch = href.match(/code=([A-Za-z0-9]{8})/);
  if (codeMatch) {
      const verification_code = codeMatch[1];
      await browser.close();
      return verification_code;
    } else {
      console.log('Unable to find code in the URL');
      await browser.close();
    }
})

const createAccountVirtual = (async () => {
  try {
      const response = await api.basic.newAccountVirtual({
        "new_account_virtual": 1,
        "type": "trading",
        "client_password": "Abcd1234",
        "residence": "id",
        "verification_code": `${await getVerificationCode()}`,
      })
      const { new_account_virtual: { oauth_token } } = response;
      return oauth_token;
  } catch(e) {
      console.log(e)
  }
})

const createAccountReal = (async () => {
  try {
    await api.account(`${await createAccountVirtual()}`)
    const response = await api.basic.newAccountReal({
      "new_account_real": 1,
      "address_line_1": "20 Broadway Av",
      "date_of_birth": "1980-01-31",
      "first_name": "Auto",
      "last_name": `${randomEmail.split('@')[0].replace(/[0-9+]/g, '')}`,
      "currency": "USD",
      "residence": "id"
    })
    const { new_account_real: { client_id }, echo_req: { residence } } = response;
    const results = [randomEmail, client_id, residence]
    console.log(results);
    return results
} catch(e) {
    console.log(e)
}  // commented finally
})

createAccountReal()

// const authoriseApp =  (async () => {
//   try {
//     const accountData = await createAccountReal()
//     const browser = await puppeteer.launch({headless: false});
//     const page = await browser.newPage();
//     await page.goto(`${auth_url}?app_id=${app_id}`);
//     await page.type('#txtEmail', accountData[0]);
//     await page.type('#txtPass','Abcd1234');
//     await page.click('[name="login"]');
//     await page.waitForSelector('#btnGrant', {visible: true});
//     await page.click('#btnGrant');
//     console.log('done!!')
//     await browser.close();
    
//   } catch (e) {
//     console.log(e)  
//   } finally {
//     connection.close()
//   }


// });

// authoriseApp()
