# Cypress E2E Testing Project 

This repository contains End-to-End (E2E) tests using Cypress for various features of the Deriv website in a staging environment. 

## Project Structure

The project structure includes the following files and directories:

- `cypress.config.js`: Cypress configuration file.
- `package.json`: Lists project dependencies, including Cypress.
- `cypress/support/e2e.js`: Support file for common configurations and custom commands.
- `cypress/e2e/`: Directory containing E2E test files for different features.

## Getting Started

To set up and run the E2E tests, follow these steps:

1. Clone this repository:

   ```bash
   git clone git@github.com:deriv-com/e2e-deriv-app.git
2. Navigate to the project directory:
    ```bash
    cd e2e-deriv-app
3. Install Project Dependencies:
    ```bash
    npm i
4. Install Cypress:
    ```bash
    npm install cypress --save-dev
5. Write e2e tests under `cypress/e2e/`

6. **To run the available test using Cypress APP UI**
    ```sh
    npx cypress open
    ```
7. **To run the available test in terminal**
    ```sh
    npx cypress run

## Cypress Configuration

In `cypress.config.js`, the Cypress configuration includes settings such as:

- `baseUrl`: The base URL for the staging environment.
- `supportFile`: The support file that contains common configurations and custom commands.
- `env`: Environment variables that can be used in your tests.

Make sure to adapt these settings according to your project's needs.

## .env

Create a .env file within the e2e-deriv-app folder and save the following environment variables (where you see [abcd], add your own credentials; where empty, leave empty):<br>
E2E_DERIV_LOGIN=[Your Deriv Login]<br>
E2E_DERIV_PASSWORD=[Your Deriv Password]<br>
E2E_MT5_LOGIN=[Your MT5 Login]<br>
E2E_MT5_PASSWORD=[Your MT5 Password]<br>
E2E_CONFIG_SERVER=[Your Server]<br>
E2E_CONFIG_APPID=[Your AppId]<br>
E2E_STD_CONFIG_SERVER=[Your Server]<br>
E2E_STD_CONFIG_APPID=[Your AppId]<br>
E2E_OAUTH_URL=<empty><br>
E2E_OAUTH_TOKEN=<br>
E2E_HMAC_KEY=[Your Challenge Key]<br>
E2E_MT5_BASEURL=https://mt5-demo-web.deriv.com<br>

## Contributing

Feel free to contribute to this project by submitting issues, pull requests, or adding new E2E tests for different features.

## License

This project is licensed under the [MIT License](LICENSE).


