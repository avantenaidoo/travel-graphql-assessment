import fs from 'fs/promises'; 
import { fileURLToPath } from 'url';  // For converting URL to file path in ES Modules
import { dirname, join } from 'path';  // For constructing file paths

// Simulate __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define log file paths
const logDirPath = join(__dirname, '..', 'logs');
const logFilePath = join(logDirPath, 'events.log');
const errLogPath = join(logDirPath, 'errors.log');
const reqLogPath = join(logDirPath, 'reqLogs.log');

// Helper function to clean up logs
const cleanupLogFile = async (filePath: string): Promise<void> => {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const lines = fileContent.split('\n');

    if (lines.length > 500) {
      // Keep only the last 500 entries
      const newContent = lines.slice(lines.length - 500).join('\n');
      await fs.writeFile(filePath, newContent, 'utf-8');
      console.log(`Log file at ${filePath} cleaned up.`);
    }
  } catch (error) {
    console.error(`Error cleaning up log file at ${filePath}:`, error);
  }
};

// Function to clean up all logs
const cleanupAllLogs = async (): Promise<void> => {
  await cleanupLogFile(logFilePath);
  await cleanupLogFile(errLogPath);
  await cleanupLogFile(reqLogPath);
};

export { cleanupAllLogs };