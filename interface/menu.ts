import { AccountManager } from "../account/accountManager";
import { getTransactionData } from "../utils/getTransactionData";
import { convertPenceToPounds } from "../utils/penceConverter";
import { getUserInput } from "../utils/getUserInput";

const MAIN_MENU_TEXT = `
######### SUPPORT BANK MENU #########
[1] - List All Accounts and Balances
[2] - List Account Transactions
[3] - Exit
Select a menu option
`;
const MAIN_MENU_INPUT_REGEX = /^(1|2|3)$/;

const ACCOUNT_NAME_REGEX = /^[A-Za-z ]+$/;

export class Menu {
  accountManager: AccountManager;

  constructor() {
    this.accountManager = new AccountManager();
    this.#loadTransactionRecords();
  }

  #getAmountString(currentBalanceInPounds: number) {
    return `${currentBalanceInPounds < 0 ? "-" : ""}£${Math.abs(currentBalanceInPounds).toFixed(2)}`;
  }

  printAllAccountsAndBalances = () => {
    const accounts = this.accountManager.getAccounts();

    accounts.forEach((_accountInstance, _accountName) => {
      const currentAccountBalanceInPence = _accountInstance.getBalance();
      const currentBalanceInPounds = convertPenceToPounds(
        currentAccountBalanceInPence,
      );
      const amountString = this.#getAmountString(currentBalanceInPounds);
      console.log(`Account: ${_accountName} - Balance ${amountString}`);
    });
  };

  printAccountTransactions = async () => {
    console.log("Enter the account name you wish to view the transactions of:");
    const userInputtedAccountName = await getUserInput(ACCOUNT_NAME_REGEX);

    const isAccountExists = this.accountManager.isExistingAccount(
      userInputtedAccountName,
    );

    if (isAccountExists) {
      const selectedAccount = this.accountManager.getOrCreateAccount(
        userInputtedAccountName,
      );

      const transactions = selectedAccount.getTransactionRecordsSortedByDate();
      
      console.log(`Transaction records for ${userInputtedAccountName}:`);
      if (transactions.length === 0) {
        console.log("No Records");
      } else {
        console.log("Date | from | To | Narrative | Amount");
        transactions.forEach((transactionRecord) => {
          const dateInStringFormat = transactionRecord.Date.toDateString();
          const currentBalanceInPounds = convertPenceToPounds(
            transactionRecord.Amount,
          );
          const amountString = this.#getAmountString(
            currentBalanceInPounds,
          );
          console.log(
            `${dateInStringFormat} | ${transactionRecord.From} |  ${transactionRecord.To} | ${transactionRecord.Narrative} | ${amountString}`,
          );
        });
      }
    } else {
      console.log(`Account '${userInputtedAccountName}' does not exist.`);
    }
  };

  #loadTransactionRecords = () => {
    const transactionRecords = getTransactionData(
      "./data/Transactions2014.csv",
    );
    transactionRecords.forEach((record) => {
      this.accountManager.addTransactionRecord(record);
    });
  };

  runLoop = async () => {
    while (true) {
      console.log(MAIN_MENU_TEXT);
      const userInput = await getUserInput(MAIN_MENU_INPUT_REGEX);
      switch (userInput) {
        case "1":
          this.printAllAccountsAndBalances();
          break;
        case "2":
          await this.printAccountTransactions();
          break;
        case "3":
          console.log("Exiting SupportBank...");
          return;
      }
    }
  };
}
