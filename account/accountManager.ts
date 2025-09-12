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

    add_transaction_record = (transaction_record: TransactionRecord) => {
        const from_account = this.getAccount(transaction_record.From)
        const to_account = this.getAccount(transaction_record.To)

        from_account.addTransactionOut(transaction_record)
        to_account.addTransactionIn(transaction_record)
    }

    getAccounts = (): Map<string, Account> => {
        return this.accounts
    }
}