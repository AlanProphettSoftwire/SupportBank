import { configure } from "log4js";

var loggerConfiguration = configure({
  appenders: {
    file: { type: "file", filename: "logs.log" },
    out: { type: "stdout" },
  },
  categories: {
    default: { appenders: ["file", "out"], level: "error" },
  },
})

export function getLogger(filename: string): ReturnType<typeof loggerConfiguration.getLogger>
{
    const logger = loggerConfiguration.getLogger(filename);
    logger.level = "debug";
    return logger;
}