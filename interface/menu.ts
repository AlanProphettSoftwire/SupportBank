import { AccountManager } from "../account/accountManager.js"
import { getTransactionData } from "../utils/getTransactionData.js"
import { convertPenceToPounds } from "../utils/penceConverter.js";
import { getUserInput } from "../utils/getUserInput.js"

const MAIN_MENU_TEXT = `
######### SUPPORT BANK MENU #########
[1] - List All Accounts and Balances
[2] - List Account Transactions
[3] - Exit
Select a menu option
`
const MAIN_MENU_INPUT_REGEX = /^(1|2|3)$/

const ACCOUNT_NAME_REGEX = /^[A-Za-z ]+$/


export class Menu{
    account_manager:AccountManager

    constructor(){
        this.account_manager = new AccountManager();
        this.#load_transaction_records()
    }

    #getAmountString(current_balance_in_pounds:number){
        return `${current_balance_in_pounds<0?"-":""}£${Math.abs(current_balance_in_pounds).toFixed(2)}`
    }

    print_all_accounts_and_balances = () => {
        const accounts = this.account_manager.getAccounts()

        accounts.forEach((_accountInstance, _accountName) => {
            const current_account_balance_in_pence = _accountInstance.getBalance()
            const current_balance_in_pounds = convertPenceToPounds(current_account_balance_in_pence)
            const amount_string = this.#getAmountString(current_balance_in_pounds)
            console.log(`Account: ${_accountName} - Balance ${amount_string}`)
        })
    }

    print_account_transactions = async () => {
        console.log("Enter the account name you wish to view the transactions of:")
        const user_inputted_account_name = await getUserInput(ACCOUNT_NAME_REGEX)
        
        const is_account_exists = this.account_manager.isExistingAccount(user_inputted_account_name)

        if (is_account_exists){
            const selected_account = this.account_manager.getAccount(user_inputted_account_name)
            const transactions = [...selected_account.transactionsIn, ...selected_account.transactionsOut]
            transactions.sort((a, b) => b.Date.getTime() - a.Date.getTime());

            console.log(`Transaction records for ${user_inputted_account_name}:`)
            if (transactions.length === 0){
                console.log("No Records")
            }
            else{
                console.log("Date | from | To | Narrative | Amount")
                transactions.forEach(transaction_record => {
                    const date_in_string_format = transaction_record.Date.toDateString()
                    const current_balance_in_pounds = convertPenceToPounds(transaction_record.Amount) 
                    const amount_string = this.#getAmountString(current_balance_in_pounds)
                    console.log(`${date_in_string_format} | ${transaction_record.From} |  ${transaction_record.To} | ${transaction_record.Narrative} | ${amount_string}` )
                });
            }
        }
        else{
            console.log(`Account '${user_inputted_account_name}' does not exist.`)
        }
    }

    #load_transaction_records = () => {
        const transaction_records = getTransactionData("./data/Transactions2014.csv");
        transaction_records.forEach(record => {
            this.account_manager.add_transaction_record(record);
        })
    }

    runLoop = async () => {
        while(true){
            console.log(MAIN_MENU_TEXT)
            const user_input = await getUserInput(MAIN_MENU_INPUT_REGEX)
            switch(user_input){
                case "1":
                    this.print_all_accounts_and_balances();
                    break
                case "2":
                    await this.print_account_transactions();
                    break
                case "3":
                    console.log("Exiting SupportBank...")
                    return
            }
        }
    }
}