import type { TransactionRecord } from "../types/transactionRecord";

export class Account {
  accountName: string;
  transactionsOut: TransactionRecord[];
  transactionsIn: TransactionRecord[];
  balance: number | null;

  constructor(_accountName: string) {
    this.accountName = _accountName;
    this.transactionsOut = [];
    this.transactionsIn = [];
    this.balance = null;
  }

  addTransactionIn = (transactionRecord: TransactionRecord) => {
    this.transactionsIn.push(transactionRecord);
    this.balance = null;
  };

  addTransactionOut = (transactionRecord: TransactionRecord) => {
    this.transactionsOut.push(transactionRecord);
    this.balance = null;
  };

  getBalance = () => {
    if (this.balance !== null) return this.balance;

    let accumulatedBalance = 0;

    this.transactionsIn.forEach((record) => {
      accumulatedBalance = accumulatedBalance + record.Amount;
    });

    this.transactionsOut.forEach((record) => {
      accumulatedBalance = accumulatedBalance - record.Amount;
    });

    this.balance = accumulatedBalance;

    return accumulatedBalance;
  };

  getTransactionRecordsSortedByDate = (): TransactionRecord[] => {
    const transactions = [...this.transactionsIn, ...this.transactionsOut];
    transactions.sort((a, b) => b.Date.getTime() - a.Date.getTime());

    return transactions;
  };
}
