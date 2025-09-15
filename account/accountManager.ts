import { Account } from "./account";
import type { TransactionRecord } from "../types/transactionRecord";
import lodash from "lodash";

export class AccountManager {
  accounts: Map<string, Account>;

  constructor() {
    this.accounts = new Map<string, Account>();
  }

  isExistingAccount = (accountName: string): boolean => {
    return lodash.some([...this.accounts.keys()], (name:string) => name === accountName);
  };

  getAccount = (accountName: string): Account => {
    const existingAccount = this.accounts.get(accountName);
    if (existingAccount) return existingAccount;

    // account does not exist therefore make a new account
    const newAccount = new Account(accountName);
    this.accounts.set(accountName, newAccount);
    return newAccount;
  };

  addTransactionRecord = (transactionRecord: TransactionRecord) => {
    const fromAccount = this.getAccount(transactionRecord.From);
    const toAccount = this.getAccount(transactionRecord.To);

    fromAccount.addTransactionOut(transactionRecord);
    toAccount.addTransactionIn(transactionRecord);
  };

  getAccounts = (): Map<string, Account> => {
    return this.accounts;
  };
}
