export class LoginPage{

    enterLoginID(){
       return cy.get('[title="Enter Login"] > .svelte-1hckigs').type('41492917')

    }

    enterPassword(){
        return cy.get('.password > .input > .svelte-1hckigs').type('Abcd@1234')

    }

    clickConnectToAccount(){
        return cy.get('.footer > .button').click()
        
    }

}