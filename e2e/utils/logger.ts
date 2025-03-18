import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";



// Function to create a logger for each test
export const createTestLogger = (testNames: string[]) => {

  // testNames = ["form.spec.ts", "Form Practice Page", "should fill the form with valid data"]
  // [0] = File name
  // [1] = Describe block
  // [2] = Test Name

  return winston.createLogger({
    level: "debug", // Capture all logs
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] [${testNames[1]} > ${testNames[2]}]: ${message}`)
    ),
    transports: [
      new winston.transports.Console(), // Log to console
      new DailyRotateFile({
        filename: `logs/${testNames[1]}-%DATE%.log`, // Separate log file for each test
        datePattern: "YYYY-MM-DD",
        zippedArchive: false,
        maxSize: "10m",
        maxFiles: "7d",
      }),
    ],
  });
};
