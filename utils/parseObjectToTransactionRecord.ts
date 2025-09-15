import type { TransactionRecord } from "../types/transactionRecord";
import type { FileDataRecord } from "../types/fileDataRecord";
import { parse as dateParseFns } from "date-fns";
import { convertPoundsToPence } from "./penceConverter";
   
function parseDate(dateStr: string): Date {
  return dateParseFns(dateStr, "d/M/y", new Date());
}

export function parseObjectsToTransactionRecords(
  transactionRecords: TransactionRecord[],
  dataRecords: FileDataRecord[],
){
  dataRecords.forEach((row: FileDataRecord) => {
    const amount_in_pence = convertPoundsToPence(parseFloat(row.Amount));
    const record: TransactionRecord = {
      Date: parseDate(row.Date),
      From: row.From,
      To: row.To,
      Narrative: row.Narrative,
      Amount: amount_in_pence,
    };
    transactionRecords.push(record);
  });
};
