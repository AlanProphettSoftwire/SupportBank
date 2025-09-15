import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import type { TransactionRecord } from "../types/transactionRecord";
import { parse as dateParseFns } from "date-fns";
import { convertPoundsToPence } from "./penceConverter";

const HEADERS = ["Date", "From", "To", "Narrative", "Amount"];

interface CsvRow {
  Date: string;
  From: string;
  To: string;
  Narrative: string;
  Amount: string;
}

function parseDate(dateStr: string): Date {
  return dateParseFns(dateStr, "d/M/y", new Date());
}

const setTransactionRecordsFromCsvRows = (
  transactionRecords: TransactionRecord[],
  csvRows: CsvRow[],
) => {
  csvRows.forEach((row: CsvRow) => {
    const amountInPence = convertPoundsToPence(parseFloat(row.Amount));
    const record: TransactionRecord = {
      Date: parseDate(row.Date),
      From: row.From,
      To: row.To,
      Narrative: row.Narrative,
      Amount: amountInPence,
    };
    transactionRecords.push(record);
  });
};

export const getTransactionData = (filePath: string): TransactionRecord[] => {
  let transactionRecords: TransactionRecord[] = [];

  const fileContent = readFileSync(filePath, { encoding: "utf-8" });

  const records = parse(fileContent, {
    delimiter: ",",
    columns: HEADERS,
    from_line: 2,
  });

  setTransactionRecordsFromCsvRows(transactionRecords, records as CsvRow[]);

  return transactionRecords;
};
