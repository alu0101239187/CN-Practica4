import * as fs from "fs";

export async function cleanupFile(filePath: string) {
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    console.error("Error deleting uploaded file:", err);
  }
}
