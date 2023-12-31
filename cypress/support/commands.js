// ***********************************************
// This general commands that will be used for general test cases
//
// ***********************************************


// this command is to change side layout (responsive mode)
Cypress.Commands.add('login_setup' , (username) => {
  cy.viewport_switch('macbook-16');
  const felink = Cypress.env('FELINK');
  
  cy.visit(felink);
  cy.loading_check(); 
  cy.homepage_loading();
  cy.go_to_login_page();

  cy.login_to_site(username);
  cy.loading_check();  
})

Cypress.Commands.add('login_setup_mobile' , (username) => {
  cy.viewport_switch('iphone-xr');
  const felink = Cypress.env('FELINK');
  
  cy.visit(felink);
  cy.loading_check(); 
  cy.homepage_loading_mobile();
  cy.go_to_login_page();

  cy.login_to_site(username);
  cy.loading_check();  
})

Cypress.Commands.add('viewport_switch', (visualViewport) => {
  cy.viewport(visualViewport);
});

// This command is to check page is loaded properly - chart is loaded properly 
Cypress.Commands.add('loading_check', () => {
    cy.xpath('//*[contains(@class,"initial-loader")]')
      .should('not.exist');
});
Cypress.Commands.add('social_login', () => { // For now we are not using this function,
   cy.iframe().find('#button_google').should('not.be.disabled');
});

// This command is to check home page is loading  properly
Cypress.Commands.add('homepage_loading' , () =>{
cy.get('#dt_login_button')
    .should('be.visible');
   
  // cy.get('#dc_stake_toggle_item')
  //   .should('be.visible'); Commenting out this, will replace this with other checks 

  //cy.get('#dropdown-display')
  // .should('be.visible');
  
  cy.get('.footer')
    .should('be.visible')
});

Cypress.Commands.add('homepage_loading_mobile' , () =>{
  cy.get('#dt_login_button')
      .should('be.visible');
     
    cy.get('#dt_signup_button')
      .should('be.visible');
  
    cy.get('#dt_mobile_drawer_toggle')
      .should('be.visible');
    
    cy.get('#dt_contract_dropdown')
      .should('be.visible')

  });


// this command is to ensure login page is loaded properly 
Cypress.Commands.add('go_to_login_page' , () =>{
  cy.get('#dt_login_button').click();
  
  cy.get('#txtEmail')
    .should('be.visible');

  cy.get('#txtPass')
    .should('be.visible');

    cy.get('.social_login_providers')
    .should('be.visible');
  });

 // This command is to key in credential 
Cypress.Commands.add('login_to_site' , (myusername) =>{

  const password = Cypress.env('password');
  
  if (typeof password !== 'string' || !password) {
      throw new Error('Missing password value, set using CYPRESS_password=...')
    }

   cy.get('#txtEmail').type(myusername);
   cy.get('#txtPass').type(password, {log: false})
  
   cy.get('.button').contains('Log in').click()
   cy.loading_check();

  });

Cypress.Commands.add('click_add_real_account' , () =>{

  cy.get('#dt_core_account-info_acc-info')
    .should('be.visible')
    .click();
  
  cy.get('#real_account_tab')
    .should('be.visible')
    .click();
  
  cy.get('#dt_core_account-switcher_add-new-account')
    .should('be.visible')
    .click();

  });

Cypress.Commands.add('click_add_real_mf_account_Traders_hub' , (viewport) =>{

  cy.xpath('//*[@id="dropdown-display"]')
    .should('be.visible')
    .click();

  cy.wait(2000)

  cy.get('#real')
    .should('be.visible')
    .click();

  cy.wait(2000)
  cy.contains('Demo').should('not.exist')
  if(viewport == 'mobile')
  {
    cy.get('#dc_options_toggle_item').should('be.visible').click();
  }
  
  cy.get('.dc-btn--primary__light')
    .eq(0)
    .should('be.visible')
    .click();

  });

  Cypress.Commands.add('click_demo_mf_account_Traders_hub' , () =>{// name of the function need to change 

    cy.xpath('//*[@id="dropdown-display"]')
      .should('be.visible')
      .click();
  
    cy.wait(2000)
  
    cy.get('#demo')
      .should('be.visible')
      .click({ force: true });
  
    cy.wait(2000)
    cy.contains('Real').should('not.exist')

    cy.get('.asset-summary').should('be.visible')
  
    });


Cypress.Commands.add('wait_account_info_visible' , () =>{ // only can be used for Dtrader page 

   cy.get('#dt_core_account-info_acc-info')
     .should('be.visible')
  });

Cypress.Commands.add('wait_traders_hub_header' , () =>{ // for landing page website traders hub 

  cy.get('#dt_cashier_tab')
    .should('be.visible') 
  cy.get('.notifications-toggle__icon-wrapper')
    .should('be.visible')

  });


Cypress.Commands.add('traders_hub_landing_page_check' , () => {
  const felink = Cypress.env('FELINK');
  cy.url()
    .should('be.equal', felink+'appstore/traders-hub')
  cy.get('.asset-summary').should('be.visible')
  // cy.get('.currency-switcher-container--has-interaction').should('be.visible') // only for Real account
  cy.get('.cfd-accounts__title').find('.dc-text').contains('CFDs').should('be.visible')
  
} )

  
Cypress.Commands.add('verify_account_signup_modal' , () =>{


  cy.get('#real_account_signup_modal')
    .should('be.visible')

  cy.xpath('//label[@for="USD" and @class="currency-list__item"]')
    .should('be.visible')
    .click();

  });

Cypress.Commands.add('complete_personal_details' , () =>{

  cy.xpath('//*[@name="first_name"]')
    .should('be.visible')
    .type('Name Testing',)

  cy.xpath(' //*[@name="last_name"]')
    .should('be.visible')
    .type('My last name')
       
  cy.xpath('//*[@name="date_of_birth"]')
    .click();

  cy.xpath('//*[@class="dc-calendar"]/div[2]/span[2][text()="2001"]')
    .should('be.visible')
    .click();
   
  cy.xpath('//*[@class="dc-calendar"]/div[2]/span[1][text()="Jan"]')
    .should('be.visible')
    .click();

  cy.xpath('//*[@class="dc-calendar"]/div[2]/span[8][text()="1"]')
    .should('be.visible')
    .click();

  cy.xpath('//*[@name="phone"]')
    .should('be.visible')
    .type('8156787678')

  cy.xpath('//*[@name="place_of_birth"]')
    .click()
    .type('Colombia')
  
  cy.contains('Colombia').click({ force: true });
  
  cy.xpath('//*[@name="tax_residence"]')
    .click()
    .type('Colombia')
  
  cy.contains('Colombia').click({ force: true });
  
  cy.xpath('//*[@name="tax_identification_number"]')
    .should('be.visible')
    .type('8156787678')
  
  cy.xpath('//*[@name="account_opening_reason"]//parent::div[@id="dropdown-display"]')
    .should('be.visible')
    .click();
  
  cy.get('#Hedging')
    .should('be.visible')
    .click({ force: true });

  });

  Cypress.Commands.add('complete_mf_personal_details' , () =>{

    cy.xpath('//*[@value="Mr"]//parent::label')
      .should('be.visible')
      .click();

    cy.xpath('//*[@name="first_name"]')
      .should('be.visible')
      .type('Name Testing',)
  
    cy.xpath(' //*[@name="last_name"]')
      .should('be.visible')
      .type('My last name')
         
    cy.xpath('//*[@name="date_of_birth"]')
      .click();
  
    cy.xpath('//*[@class="dc-calendar"]/div[2]/span[2][text()="2001"]')
      .should('be.visible')
      .click();
     
    cy.xpath('//*[@class="dc-calendar"]/div[2]/span[1][text()="Jan"]')
      .should('be.visible')
      .click();
  
    cy.xpath('//*[@class="dc-calendar"]/div[2]/span[8][text()="1"]')
      .should('be.visible')
      .click();
 
    cy.xpath('//*[@name="place_of_birth"]')
      .click()
      .type('Afghanistan')

    cy.contains('Afghanistan').click({ force: true });

    cy.xpath('//*[@name="citizen"]')
      .should('have.value', 'Spain')


    cy.xpath('//*[@name="phone"]')
      .should('be.visible')
      .type('8156787678')

    cy.xpath('//*[@name="tax_residence"]')
      .should('have.value', 'Spain')

    cy.xpath('//*[@name="tax_identification_number"]')
      .should('be.visible')
      .type('12345678A')

    cy.xpath('//*[@data-testid="dti_dropdown_display"]')
      .eq(1)
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="Employed"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@name="tax_identification_confirm"]/following-sibling::span[@class="dc-checkbox__box"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@name="account_opening_reason"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();
    
    cy.get('#Hedging')
      .should('be.visible')
      .click({ force: true });

    });

  Cypress.Commands.add('complete_financial_assessment' , () => {

    // Financial information
    cy.xpath('//*[@name="income_source"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="Salaried Employee"]')
      .should('be.visible')
      .click();    
 
    cy.xpath('//*[@name="employment_status"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="Employed"]')
      .should('be.visible')
      .click();   

    cy.xpath('//*[@name="employment_industry"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="Construction"]')
      .should('be.visible')
      .click();   

    cy.xpath('//*[@name="occupation"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="Chief Executives, Senior Officials and Legislators"]')
      .should('be.visible')
      .click();   

    cy.xpath('//*[@name="source_of_wealth"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="Accumulation of Income/Savings"]')
      .should('be.visible')
      .click();   

    cy.xpath('//*[@name="education_level"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="Primary"]')
      .should('be.visible')
      .click();   

    cy.xpath('//*[@name="net_income"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="Less than $25,000"]')
      .should('be.visible')
      .click();   

    cy.xpath('//*[@name="estimated_worth"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="Less than $100,000"]')
      .should('be.visible')
      .click(); 

    cy.xpath('//*[@name="account_turnover"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="Less than $25,000"]')
      .should('be.visible')
      .click(); 

    // Trading experience
    cy.xpath('//*[@name="forex_trading_experience"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="0-1 year"]')
      .should('be.visible')
      .click(); 

    cy.xpath('//*[@name="forex_trading_frequency"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="0-5 transactions in the past 12 months"]')
      .should('be.visible')
      .click(); 

    cy.xpath('//*[@name="binary_options_trading_experience"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="0-1 year"]')
      .should('be.visible')
      .click(); 

    cy.xpath('//*[@name="binary_options_trading_frequency"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="0-5 transactions in the past 12 months"]')
      .should('be.visible')
      .click(); 

    cy.xpath('//*[@name="cfd_trading_experience"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="0-1 year"]')
      .should('be.visible')
      .click(); 

      cy.xpath('//*[@name="cfd_trading_frequency"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="0-5 transactions in the past 12 months"]')
      .should('be.visible')
      .click(); 

      cy.xpath('//*[@name="other_instruments_trading_experience"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="0-1 year"]')
      .should('be.visible')
      .click(); 

      cy.xpath('//*[@name="other_instruments_trading_frequency"]//parent::div[@id="dropdown-display"]')
      .should('be.visible')
      .click();

    cy.xpath('//*[@id="0-5 transactions in the past 12 months"]')
      .should('be.visible')
      .click(); 

      });

Cypress.Commands.add('complete_mobile_financial_assessment' , () => {

  // Financial information
  cy.xpath('//*[@name="income_source"]')
    .select('Salaried Employee');

  cy.xpath('//*[@name="employment_status"]')
    .select('Employed');

  cy.xpath('//*[@name="employment_industry"]')
    .select('Construction');

  cy.xpath('//*[@name="occupation"]')
    .select('Chief Executives, Senior Officials and Legislators');

  cy.xpath('//*[@name="source_of_wealth"]')
    .select('Accumulation of Income/Savings');

  cy.xpath('//*[@name="education_level"]')
    .select('Primary');
    
  cy.xpath('//*[@name="net_income"]')
    .select('Less than $25,000');

  cy.xpath('//*[@name="estimated_worth"]')
    .select('Less than $100,000');

  cy.xpath('//*[@name="account_turnover"]')
    .select('Less than $25,000');

  // Trading experience
  cy.xpath('//*[@name="forex_trading_experience"]')
    .select('0-1 year');

  cy.xpath('//*[@name="forex_trading_frequency"]')
    .select('0-5 transactions in the past 12 months');

  cy.xpath('//*[@name="binary_options_trading_experience"]')
    .select('0-1 year');

  cy.xpath('//*[@name="binary_options_trading_frequency"]')
    .select('0-5 transactions in the past 12 months');

  cy.xpath('//*[@name="cfd_trading_experience"]')
    .select('0-1 year');

  cy.xpath('//*[@name="cfd_trading_frequency"]')
    .select('0-5 transactions in the past 12 months');

  cy.xpath('//*[@name="other_instruments_trading_experience"]')
    .select('0-1 year');

  cy.xpath('//*[@name="other_instruments_trading_frequency"]')
    .select('0-5 transactions in the past 12 months');

    });

Cypress.Commands.add('click_next_button' , () => {

  cy.xpath('//*[@type="submit"]/span[text()="Next"]//parent::button')
    .should('be.visible')
    .click();

  });

  Cypress.Commands.add('click_next_question' , () => {

    cy.get('button[name="Next"]')
      .should('be.visible')
      .click({ force: true });
  
    });

Cypress.Commands.add('complete_address_details', () => {

  cy.xpath('//*[@name="address_line_1"]')
     .should('be.visible')
     .type('myaddress 1')

  cy.xpath('//*[@name="address_line_2"]')
     .should('be.visible')
     .type('myaddress 2')  
     
  cy.xpath('//*[@name="address_city"]')
     .should('be.visible')
     .type('my city')
  
  cy.xpath('//*[@name="address_postcode"]')
    .should('be.visible')
    .type('12345678')
  
  });

 Cypress.Commands.add('type_state_in_browser' , () =>{

    cy.xpath('//*[@name="address_state"]')
      .should('be.visible')
      .click();
    
    cy.get('.dc-dropdown-list__item')
      .contains('Aceh')
      .click();
    
  });

  Cypress.Commands.add('type_mf_state_in_browser' , () =>{

    cy.xpath('//*[@name="address_state"]')
      .should('be.visible')
      .click();
    
    cy.get('.dc-dropdown-list__item')
      .contains('Albacete')
      .click();
    
  });

 Cypress.Commands.add('select_state_in_mobile' , () =>{

    cy.get('#dt_components_select-native_select-tag')
      .select('Aceh')
  });

  Cypress.Commands.add('select_mf_state_in_mobile' , () =>{

    cy.get('#dt_components_select-native_select-tag')
      .select('Albacete')
  });

Cypress.Commands.add('check_tnc' , () => {
  
  cy.xpath('//*[contains(text(),"not a PEP")]//preceding::span[1]')
     .should('be.visible')
     .click();   

  cy.xpath('//*[contains(text(),"I agree")]//preceding::span[1]')
     .should('be.visible')
     .click();   
  });
  
Cypress.Commands.add('verify_mobile_account_signup_modal' , () =>{


    cy.get('.dc-mobile-dialog__account-signup-mobile-dialog')
      .should('be.visible')
  
    cy.xpath('//label[@for="USD" and @class="currency-list__item"]')
      .should('be.visible')
      .click();
  
    });

Cypress.Commands.add('mobile_complete_personal_details' , () =>{

  cy.xpath('//*[@name="first_name"]')
    .should('be.visible')
    .type('Name Testing',)

  cy.xpath(' //*[@name="last_name"]')
    .should('be.visible')
    .type('My last name')
       
  cy.xpath('//*[@name="date_of_birth"]')
    .click();

  cy.get('input[type=date]').type('2012-08-07');
 
  cy.xpath('//*[@name="phone"]')
    .should('be.visible')
    .type('8156787678')

  cy.xpath('//*[@name="place_of_birth"]')
    .select('Colombia');
  
  cy.xpath('//*[@name="tax_residence"]')
    .select('Colombia');
    
  cy.xpath('//*[@name="tax_identification_number"]')
    .should('be.visible')
    .type('8156787678')

  cy.xpath('//*[@name="account_opening_reason"]')
    .select('Hedging');
  
  });

Cypress.Commands.add('mobile_complete_mf_personal_details' , () =>{

  cy.xpath('//*[@value="Mr"]//parent::label')
    .should('be.visible')
    .click();

  cy.xpath('//*[@name="first_name"]')
    .should('be.visible')
    .type('Name Testing',)

  cy.xpath(' //*[@name="last_name"]')
    .should('be.visible')
    .type('My last name')
       
  cy.xpath('//*[@name="date_of_birth"]')
    .click();

  cy.get('input[type=date]').type('2012-08-07');

  cy.xpath('//*[@name="place_of_birth"]')
    .select('Afghanistan');

  cy.xpath('//*[@name="citizen"]')
    .select('Afghanistan');

  cy.xpath('//*[@name="phone"]')
    .should('be.visible')
    .type('8156787678')

  cy.xpath('//*[@name="tax_residence"]')
    .select('Afghanistan');

  cy.xpath('//*[@name="tax_identification_number"]')
    .should('be.visible')
    .type('12345678A')
  
  cy.xpath('//*[@name="employment_status"]')
    .select('Employed');

  cy.xpath('//*[@name="tax_identification_confirm"]/following-sibling::span[@class="dc-checkbox__box"]')
    .should('be.visible')
    .click();

  cy.xpath('//*[@name="account_opening_reason"]')
    .select('Hedging');

  });
  

Cypress.Commands.add('open_markets_switcher' , () => {
 
  cy.xpath('//*[@class="cq-symbol-select-btn"]')
    .should('be.visible')
    .click({ force: true });
  
  });

Cypress.Commands.add('trade_type_switcher' , () => {
 
  cy.get('#dt_contract_dropdown')
    .should('be.visible')
    .click();
  });  


 Cypress.Commands.add('close_web_modal' , () => {
  cy.xpath('//*[@class="dc-modal-header__close"]')
    .click();
 });

 Cypress.Commands.add('close_mobile_modal' , () => {
 cy.xpath('//*[@class="dc-icon dc-mobile-dialog__close-btn-icon"]')
 .click();
});

Cypress.Commands.add('wait_agreement_to_load' , () => {
  cy.get('.onfido-sdk-ui-Spinner-inner').should('be.visible') // waiting for the onfido loading spinner to appear 
  cy.get('.onfido-sdk-ui-Spinner-inner', {timeout: 10000}).should('not.exist') // waiting for the onfido loading spinner not exist 
  cy.get('.body').then($btn => { // target/get the body in order to access the elements inside. In this case I have targeted all the buttons inside the frame. 
    if($btn.find('button[data-onfido-qa="userConsentBtnPrimary"]').length > 0) // find the "accept" button if its appear go through first true statement 
    {
      cy.xpath('//*[contains(@class,"ods-button -action--primary onfido-sdk-ui-Theme-button-sm onfido-sdk-ui-UserConsent-action")and text()="Accept" ]') //find accept button
        .should('be.visible')// must be visible 
        .wait(1000)// wait for the 1000 for the content to be fully loaded 
        .click()
      cy.contains('Choose your document')
        .should('be.visible');
    } 
    else// if websocket is other than 'US' region will go through this
     {
      cy.contains('Choose your document')
        .should('be.visible');
     }
    });
});


Cypress.Commands.add('scroll_to_mobile_markets' , () => {
  cy.xpath('//*[@class="sc-mcd__content__body__scroll"]')
    .scrollTo('bottom');
});

Cypress.Commands.add('wait_mobile_traders_hub_header', () => {
  cy.xpath('//*[@id="dt_core_header_acc-info-container"]')
    .should('be.visible')
})


Cypress.Commands.add('complete_financial_assessment_mf' , () => {

  // Financial assessment
  cy.xpath('//*[@name="income_source"]//parent::div[@id="dropdown-display"]')
    .should('be.visible')
    .click();

  cy.xpath('//*[@id="Salaried Employee"]')
    .should('be.visible')
    .click();   
  
  cy.xpath('//*[@name="employment_industry"]//parent::div[@id="dropdown-display"]')
    .should('be.visible')
    .click();

  cy.xpath('//*[@id="Information & Communications Technology"]')
    .should('be.visible')
    .click(); 
  
  cy.xpath('//*[@name="occupation"]//parent::div[@id="dropdown-display"]')
    .should('be.visible')
    .click();

  cy.xpath('//*[@id="Managers"]')
    .should('be.visible')
    .click();
    
  cy.xpath('//*[@name="source_of_wealth"]//parent::div[@id="dropdown-display"]')
    .should('be.visible')
    .click();

  cy.xpath('//*[@id="Investment Income"]')
    .should('be.visible')
    .click();
  
  cy.xpath('//*[@name="education_level"]//parent::div[@id="dropdown-display"]')
    .should('be.visible')
    .click();

  cy.xpath('//*[@id="Tertiary"]')
    .should('be.visible')
    .click();

  cy.xpath('//*[@name="net_income"]//parent::div[@id="dropdown-display"]')
    .should('be.visible')
    .click();

  cy.xpath('//*[@id="$25,000 - $50,000"]')
    .should('be.visible')
    .click();

  cy.xpath('//*[@name="estimated_worth"]//parent::div[@id="dropdown-display"]')
    .should('be.visible')
    .click();

  cy.xpath('//*[@id="$100,000 - $250,000"]')
    .should('be.visible')
    .click();

  cy.xpath('//*[@name="account_turnover"]//parent::div[@id="dropdown-display"]')
    .should('be.visible')
    .click();

  cy.xpath('//*[@id="$50,001 - $100,000"]')
    .should('be.visible')
    .click();
  

})


Cypress.Commands.add('mobile_traders_hub_landing_page', () => {
  
  cy.xpath('//*[@class="traders-hub-header__mobile-parent"]').should('be.visible')
  cy.xpath('//*[@class="traders-hub-header__cashier-button"]').should('be.visible')
  cy.get('.asset-summary').should('be.visible')
  cy.get('#dc_options_toggle_item').should('be.visible')
  cy.get('#dc_cfd_toggle_item').should('be.visible')
  // cy.get('.currency-switcher-container--has-interaction').should('be.visible') // only for Real account
})


Cypress.Commands.add("close_notification_banner", () => {
  cy.wait(2000);
  cy.get('body').then(($body) => {
    if ($body.find('.notification--warning').length) {
      cy.get('.notification--warning')
        .should('exist')
        .each(($element) => {
          cy.wrap($element).find('.notification__close-button').should('be.visible').click({ force: true });
        });
    }
  });
});

  
