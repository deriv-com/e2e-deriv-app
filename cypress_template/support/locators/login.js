export const loginPageLocators = {
  emailField: () => cy.get('input[id="txtEmail"]'),
  passwordField: () => cy.get('input[id="txtPass"]'),
  loginBtn: () => cy.findByRole('button', { name: 'Log in' }),
  responsive: {},
}
