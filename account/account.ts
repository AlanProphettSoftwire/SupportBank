import type { TransactionRecord } from "../types/transactionRecord";

export class Account{
    account_name: string;
    transactionsOut: TransactionRecord[]
    transactionsIn: TransactionRecord[]
    balance: number|null;

    constructor(_account_name:string){
        this.account_name = _account_name;
        this.transactionsOut = [];
        this.transactionsIn = [];
        this.balance = null
    }

    addTransactionIn = (transactionRecord:TransactionRecord) => {
        this.transactionsIn.push(transactionRecord);
    }

    addTransactionOut = (transactionRecord:TransactionRecord) => {
        this.transactionsOut.push(transactionRecord);
    }

    getBalance = () =>{
        if (this.balance !== null) return this.balance;

        let accumulated_balance = 0;

        this.transactionsIn.forEach(record => {
            accumulated_balance += record.Amount
        });

        this.transactionsOut.forEach(record => {
            accumulated_balance -= record.Amount
        });

        this.balance = accumulated_balance

        return accumulated_balance;
    }
}