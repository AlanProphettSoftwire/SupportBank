import { Account } from "./account";
import type { TransactionRecord } from "../types/transactionRecord";

export class AccountManager {
  accounts: Map<string, Account>;

  constructor() {
    this.accounts = new Map<string, Account>();
  }

  isExistingAccount = (accountName: string): boolean => {
    const existingAccount = this.accounts.get(accountName);
    return existingAccount !== undefined;
  };

  getAccount = (accountName: string): Account => {
    const existingAccount = this.accounts.get(accountName);
    if (existingAccount) return existingAccount;

    // account does not exist therefore make a new account
    const newAccount = new Account(accountName);
    this.accounts.set(accountName, newAccount);
    return newAccount;
  };

  add_transaction_record = (transactionRecord: TransactionRecord) => {
    const from_account = this.getAccount(transactionRecord.From);
    const to_account = this.getAccount(transactionRecord.To);

    from_account.addTransactionOut(transactionRecord);
    to_account.addTransactionIn(transactionRecord);
  };

  getAccounts = (): Map<string, Account> => {
    return this.accounts;
  };
}
