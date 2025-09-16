import type { TransactionRecord } from "../types/transactionRecord";
import type { FileDataRecord } from "../types/fileDataRecord";
import * as datefns from "date-fns"
import { convertPoundsToPence, convertPenceToPounds } from "./penceConverter";
import { getLogger } from "./logger";

const logger = getLogger("parseObjectToTransactionRecord");
logger.level = "debug";

function getTransactionRecordValidityWarnings(
  originalRecord: FileDataRecord,
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

  if (
    convertPenceToPounds(transactionRecord.Amount).toString() !==
    originalRecord.Amount.trim()
  ) {
    warningMessages.push(`Amount - There was a error parsing the amount`);
  }

  return warningMessages;
}

function parseDate(dateStr: string): Date {
  return datefns.parse(dateStr, "d/M/y", new Date());
}

function parseDataRecordToTransactionRecords(
  Record: FileDataRecord,
  lineIndexNumber: number,
): TransactionRecord | null {
  const parsedDate = parseDate(Record.Date);
  const amountInPence = convertPoundsToPence(parseFloat(Record.Amount));

  const newTransactionRecord: TransactionRecord = {
    Date: parsedDate,
    From: Record.From,
    To: Record.To,
    Narrative: Record.Narrative,
    Amount: amountInPence,
  };

  const warnings = getTransactionRecordValidityWarnings(
    Record,
    newTransactionRecord,
  );
  if (warnings.length === 0) return newTransactionRecord;

  logger.warn(`Warnings present on line ${lineIndexNumber + 1}`);
  warnings.forEach((warning) => {
    logger.warn(warning);
  });

  return null;
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
    const parsedRecord = parseDataRecordToTransactionRecords(row, i);
    if (parsedRecord === null) {
      isAllValid = false;
      continue;
    }
    parsedDataRecords.push(parsedRecord);

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
