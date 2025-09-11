import { AccountManager } from "../account/accountManager.js"
import { getTransactionData } from "../utils/getTransactionData.js"

const MAIN_MENU_TEXT = `
SUPPORT BANK
[1] - List All Accounts and Balances
[2] - List Account Transactions
`

export class Menu{
    account_manager:AccountManager

    constructor(){
        this.account_manager = new AccountManager();
        this.#load_transaction_records()
    }

    print_all_accounts_and_balances = () => {
        const accounts = this.account_manager.getAccounts()

        accounts.forEach((_accountInstance, _accountName) => {
            const current_account_balance = _accountInstance.getBalance()
            console.log(`Account: ${_accountName} - Balance ${current_account_balance}`)
        })
    }

    #load_transaction_records = () => {
        const transaction_records = getTransactionData("./data/Transactions2014.csv");
        transaction_records.forEach(record => {
            this.account_manager.add_transaction_record(record);
        })
    }

    runLoop = () => {
        this.print_all_accounts_and_balances()
    }
}