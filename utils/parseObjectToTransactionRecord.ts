import type { TransactionRecord } from "../types/transactionRecord";
import type { FileDataRecord } from "../types/fileDataRecord";
import { parse as dateParseFns, isValid as isValidDateFns } from "date-fns";
import { convertPoundsToPence, convertPenceToPounds } from "./penceConverter";
import setUpLogger from "./setUpLogger";

const logger = setUpLogger.getLogger("parseObjectToTransactionRecord");
logger.level = "debug";

function get_TransactionRecord_validity_warnings(
  original_record: FileDataRecord,
  transactionRecord: TransactionRecord,
): string[] {
  const warningMessages: string[] = [];

  if (!isValidDateFns(transactionRecord.Date)) {
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
    original_record.Amount.trim()
  ) {
    warningMessages.push(`Amount - There was a error parsing the amount`);
  }

  return warningMessages;
}

function parseDate(dateStr: string): Date {
  return dateParseFns(dateStr, "d/M/y", new Date());
}

function parseDataRecordToTransactionRecords(
  Record: FileDataRecord,
  line_index_number: number,
): TransactionRecord | null {
  const parsedDate = parseDate(Record.Date);
  const amount_in_pence = convertPoundsToPence(parseFloat(Record.Amount));

  const newTransactionRecord: TransactionRecord = {
    Date: parsedDate,
    From: Record.From,
    To: Record.To,
    Narrative: Record.Narrative,
    Amount: amount_in_pence,
  };

  const warnings = get_TransactionRecord_validity_warnings(
    Record,
    newTransactionRecord,
  );
  if (warnings.length === 0) return newTransactionRecord;

  logger.warn(`Warnings present on line ${line_index_number + 1}`);
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
    if (parsedRecord != null) {
      parsedDataRecords.push(parsedRecord);
      isAllValid = false;
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
