import { parse } from "csv-parse/sync";
import { readFileSync } from 'fs';
import type { TransactionRecord } from "../types/transactionRecord.js"

const HEADERS = ["Date", "From", "To", "Narrative", "Amount"]

interface CsvRow {
    Date: string;
    From: string;
    To: string;
    Narrative: string;
    Amount: string;
}

function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split("/");

    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

const setTransactionRecordsFromCsvRows = (
    transactionRecords: TransactionRecord[],
    csvRows: any
) => {

    csvRows.forEach((e: CsvRow) => {
        const record: TransactionRecord = {
            Date: parseDate(e.Date),
            From: e.From,
            To: e.To,
            Narrative: e.Narrative,
            Amount: Number(e.Amount)
        };
        transactionRecords.push(record);
    });
}


export const getTransactionData = (
    filePath: string
): TransactionRecord[] => {
    let transactionRecords: TransactionRecord[] = []

    const fileContent = readFileSync(filePath, { encoding: 'utf-8' });

    const records = parse(fileContent, {
        delimiter: ",",
        columns: HEADERS,
    });

    setTransactionRecordsFromCsvRows(transactionRecords, records);

    return transactionRecords;
}