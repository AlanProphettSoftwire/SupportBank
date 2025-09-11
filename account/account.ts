import type { TransactionRecord } from "../types/transactionRecord";

export class Account{
    account_name: string;
    transactions_out: TransactionRecord[]
    transactions_in: TransactionRecord[]
    balance: number|null;

    constructor(_account_name:string){
        this.account_name = "";
        this.transactions_out = [];
        this.transactions_in = [];
        this.balance = null
    }

    addTransactionIn = (transaction_record:TransactionRecord) => {
        this.transactions_in.push(transaction_record);
    }

    addTransactionOut = (transaction_record:TransactionRecord) => {
        this.transactions_out.push(transaction_record);
    }

    getBalance = () =>{
        if (this.balance !== null) return this.balance;

        let accumulated_balance = 0;

        this.transactions_in.forEach(record => {
            accumulated_balance += record.Amount
        });

        this.transactions_out.forEach(record => {
            accumulated_balance -= record.Amount
        });

        this.balance = accumulated_balance

        return accumulated_balance;
    }
}