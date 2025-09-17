import type { TransactionRecord } from "../types/transactionRecord";
import type { FileDataRecord } from "../types/fileDataRecord";
import * as datefns from "date-fns"
import { convertPoundsToPence, convertPenceToPounds } from "./penceConverter";
import { getLogger } from "./logger";

const logger = getLogger("parseObjectToTransactionRecord");
logger.level = "debug";

const EXPECTED_MONETARY_REGEX = /^\d+\.\d\d$/;

function getTransactionRecordValidityWarnings(
  transactionRecord: TransactionRecord,
): string[] {
  const warningMessages: string[] = [];

  if (!datefns.isValid(transactionRecord.Date)) {
    warningMessages.push(
      `Invalid Date: ${transactionRecord.Date} is not valid.`,
    );
  }

  if (transactionRecord.From.trim() === "") {
    warningMessages.push(`From - Field must not be empty`);
  }

  if (transactionRecord.To.trim() === "") {
    warningMessages.push(`To - Field must not be empty`);
  }

  if (transactionRecord.Narrative.trim() === "") {
    warningMessages.push(`Narrative - Field must not be empty`);
  }

  return warningMessages;
}

function parseDate(dateStr: string): Date {
  return datefns.parse(dateStr, "d/M/y", new Date());
}

function parseDataRecordToTransactionRecords(
  record: FileDataRecord,
  lineIndexNumber: number,
): TransactionRecord {
  const parsedDate = parseDate(record.Date);

  const amountInPence = convertPoundsToPence(parseFloat(record.Amount));

  const newTransactionRecord: TransactionRecord = {
    Date: parsedDate,
    From: record.From,
    To: record.To,
    Narrative: record.Narrative,
    Amount: amountInPence,
  };

  const warnings = getTransactionRecordValidityWarnings(
    newTransactionRecord,
  );

  if(EXPECTED_MONETARY_REGEX.test(record.Amount) === false){
    warnings.push(`Amount - ${record.Amount} is not in the expected format of a decimal number with two decimal places (e.g., 123.45)`);
  }

  if (warnings.length === 0) return newTransactionRecord;

  logger.warn(`Warnings present on line ${lineIndexNumber + 1}`);
  warnings.forEach((warning) => {
    logger.warn(warning);
  });

  throw new Error("Invalid record found");
}

export function getParsedObjectsToTransactionRecords(
  dataRecords: FileDataRecord[],
) {
  const parsedDataRecords: TransactionRecord[] = [];

  let isAllValid = true;

  for (let i = 0; i < dataRecords.length; i++) {
    const row = dataRecords[i];
    if (row == null || row === undefined) {
      logger.warn(`No record found on line ${i + 1}`);
      isAllValid = false;
      continue;
    }
    try{
      const parsedRecord = parseDataRecordToTransactionRecords(row, i);
      parsedDataRecords.push(parsedRecord);
    }
    catch (e){
      isAllValid = false;
      continue;
    }
  }

  if (!isAllValid) {
    logger.warn(
      "The above warnings were found while parsing the records. Please fix the issues and try again.",
    );
    process.exit(1);
  }

  logger.info(
    `Successfully parsed ${parsedDataRecords.length} valid records out of ${dataRecords.length} total records.`,
  );
  return parsedDataRecords;
}
