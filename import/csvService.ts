import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import type { TransactionRecord } from "../types/transactionRecord";
import type { FileDataRecord } from "../types/fileDataRecord";
import { getParsedObjectsToTransactionRecords } from "../utils/parseObjectToTransactionRecord";

const HEADERS = ["Date", "From", "To", "Narrative", "Amount"];

export const csvService = (filePath: string): TransactionRecord[] => {
  const fileContent = readFileSync(filePath, { encoding: "utf-8" });

  const records = parse(fileContent, {
    delimiter: ",",
    columns: HEADERS,
    from_line: 2,
  });

  let transactionRecords: TransactionRecord[] =
    getParsedObjectsToTransactionRecords(records as FileDataRecord[]);

  return transactionRecords;
};
