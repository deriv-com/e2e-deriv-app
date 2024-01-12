class Common {
  get loader() {
    return cy.get("div[data-testid='dt_initial_loader']");
  }

  get accountSwitcherButton() {
    return cy.get("div.acc-info");
  }

  get demoAccountTab() {
    return cy.xpath("//li[text()='Demo']");
  }

  get demoAccount() {
    return cy.xpath("//span[@class='acc-switcher__id']/span[text()='Demo']");
  }

  get skipButton() {
    return cy.xpath("//span[text()='Skip']", { timeout: 10000 });
  }

  get botRunButton() {
    return cy.get("button[id='db-animation__run-button']");
  }

  get botStopButton() {
    return cy.get("button[id='db-animation__stop-button']");
  }

  get blocklyDurationType() {
    return cy.xpath(
      "(//*[@class='blocklyText' and text()='Duration:']/..)/*[@class='blocklyEditableText']"
    );
  }

  get blocklyDurationValue() {
    return cy.xpath(
      "((//*[@class='blocklyText' and text()='Duration:']/..)//*[@data-argument-type='text number'])[1]"
    );
  }

  get accountBalance() {
    return cy.get(".acc-info__balance");
  }

  get snackBar() {
    return cy.get(".dc-toast__message-content");
  }

  get snackBarCloseIcon() {
    return cy.get(".dc-icon.notification-close");
  }

  botRunButtonEl = "button[id='db-animation__run-button']";

  removeCurrencyCode = (text) => {
    return text.replace("USD", "").trim();
  };

  removeComma = (text) => {
    return text.replace(/,/g, "").trim();
  };

  switchToDemo = () => {
    this.accountSwitcherButton.click();
    this.demoAccountTab.click();
    this.demoAccount.click();
    cy.wait(5000);
  };

  logOut = () => {
    cy.xpath('//*[@id="dc_login-history_link"]').should("be.visible").click();
  };

  getElementWithTimeout = (element, waitduration) => {
    return cy.get(element, { timeout: waitduration });
  };

  enterMartingaleValues = () => {
    cy.window().then((win) => {
      const martingaleValues = ["5", "4", "1"]; //Expected Profit, Expected Loss, Trade Amount
      let call = 0;
      cy.stub(win, "prompt").callsFake(() => {
        return martingaleValues[call++];
      });
      this.botRunButton.click();
    });
  };

  verifyMartingaleStrategyCompleted = (totalPL) => {
    getElementWithTimeout("div.run-panel__stat-amount", 3200000).then(
      ($amt) => {
        if ($amt.hasClass("run-panel__stat-amount--positive")) {
          cy.on("window:alert", (str) => {
            expect(str).to.contain(
              `Expected Profit Made! Total Profit: ${totalPL}`
            );
          });
        } else {
          cy.on("window:alert", (str) => {
            expect(str).to.contain(
              `Maximum Loss Occurred! Total Loss: ${totalPL}`
            );
          });
        }
      }
    );
  };

  setBlocklyDuration = () => {
    this.blocklyDurationType.click();
    cy.get(".goog-menuitem.goog-option").contains("Ticks").click();
    this.blocklyDurationValue.type("2");
  };

  /**
   * Skip the tour
   */
  skipTour = () => {
    this.skipButton.click({ force: true });
  };

  /**
   * Start the bot
   */
  runBot = () => {
    this.botRunButton.should("exist").click();
  };

  /**
   * Stop the bot
   * @param waitduration Time to wait before stopping the bot
   */
  stopBot = (waitduration = undefined) => {
    if (waitduration) {
      cy.wait(waitduration);
    }
    this.botStopButton.should("exist").click();
  };
}

export default Common;
