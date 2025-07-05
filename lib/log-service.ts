// lib/log-service.ts

interface LogEntry {
  timestamp: string;
  message: string;
  args: string; // Store stringified args
}

const MAX_LOGS = 200; // Keep a reasonable limit to avoid memory issues
export const logs: LogEntry[] = [];

export function addLog(message: string, ...args: any[]): void {
  const timestamp = new Date().toISOString();
  let argsString = "";
  try {
    // Attempt to stringify, handling potential circular references or large objects
    argsString = args.map(arg => {
      if (typeof arg === 'object' && arg !== null) {
        try {
          // Basic check for large/complex objects; you might want more sophisticated handling
          if (Object.keys(arg).length > 20) return '[Object too large to log fully]';
          return JSON.stringify(arg);
        } catch (e) {
          return '[Unserializable Object]';
        }
      }
      return String(arg);
    }).join(" ");
  } catch (e) {
    argsString = "[Error stringifying args]";
  }

  const logEntry: LogEntry = {
    timestamp,
    message,
    args: argsString,
  };

  if (logs.length >= MAX_LOGS) {
    logs.shift(); // Remove the oldest log
  }
  logs.push(logEntry);

  // Also log to console for developers
  console.log(`[LOG] ${timestamp} - ${message}`, ...args);
}

export function getLogs(): LogEntry[] {
  return [...logs]; // Return a copy
}

export function clearLogs(): void {
  logs.length = 0;
  addLog("Log cache cleared.");
}
