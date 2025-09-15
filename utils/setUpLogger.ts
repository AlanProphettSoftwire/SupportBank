import { configure } from "log4js";

export default configure({
  appenders: {
    file: { type: "file", filename: "logs.log" },
    out: { type: "stdout" },
  },
  categories: {
    default: { appenders: ["file", "out"], level: "error" },
  },
});
