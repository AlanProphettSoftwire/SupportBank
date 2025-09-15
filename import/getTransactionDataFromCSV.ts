import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import type { TransactionRecord } from "../types/transactionRecord";
import type { FileDataRecord } from "../types/fileDataRecord";
import { parseObjectsToTransactionRecords } from "../utils/parseObjectToTransactionRecord";

const HEADERS = ["Date", "From", "To", "Narrative", "Amount"];

export const getTransactionData = (filePath: string): TransactionRecord[] => {
  let transactionRecords: TransactionRecord[] = [];

  const fileContent = readFileSync(filePath, { encoding: "utf-8" });

  const records = parse(fileContent, {
    delimiter: ",",
    columns: HEADERS,
    from_line: 2,
  });

  parseObjectsToTransactionRecords(transactionRecords, records as FileDataRecord[]);

  return transactionRecords;
};
