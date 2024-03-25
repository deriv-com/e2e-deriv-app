import { cashierPageLocators } from './cashier'
import { commonPageLocators } from './common'
import { dBotPageLocators } from './dBot'
import { dTraderPageLocators } from './dtrader'
import { p2pPageLocators } from './p2p'
import { reportsPageLocators } from './reports'
import { settingsPageLocators } from './settings'
import { tradersHubPageLocators } from './tradersHub'
import { walletsPageLocators } from './wallets'

export const derivApp = {
  walletsPage: walletsPageLocators,
  cashierPage: cashierPageLocators,
  commonPage: commonPageLocators,
  dBotPage: dBotPageLocators,
  dTraderPage: dTraderPageLocators,
  reportsPage: reportsPageLocators,
  settingsPage: settingsPageLocators,
  tradersHubPage: tradersHubPageLocators,
  p2p: p2pPageLocators,
  // Remaining Page locators here...
}
