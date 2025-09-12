import { Account } from "./account.js"
import type { TransactionRecord } from "../types/transactionRecord.js";

export class AccountManager {
    accounts: Map<string, Account>;

    constructor() {
        this.accounts = new Map<string, Account>();
    }

    isExistingAccount = (account_name: string): boolean => {
        const existingAccount = this.accounts.get(account_name);
        return existingAccount !== undefined
    }

    getAccount = (account_name: string): Account => {
        const existingAccount = this.accounts.get(account_name);
        if (existingAccount) return existingAccount

        // account does not exist therefore make a new account 
        const newAccount = new Account(account_name);
        this.accounts.set(account_name, newAccount)
        return newAccount
    }

    add_transaction_record = (transactionRecord: TransactionRecord) => {
        const from_account = this.getAccount(transactionRecord.From)
        const to_account = this.getAccount(transactionRecord.To)

        from_account.addTransactionOut(transactionRecord)
        to_account.addTransactionIn(transactionRecord)
    }

    getAccounts = (): Map<string, Account> => {
        return this.accounts
    }
}