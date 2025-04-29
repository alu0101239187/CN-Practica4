import fs from "fs";
import path from "path";
import HttpError from "../errors/HttpError";

export async function loadJSONFilesByName(
  directory: string,
  fileName: string
): Promise<any[]> {
  const filePaths: any[] = [];

  const entries = await fs.promises.readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const directoryName = entry.name;
    const directoryPath = path.join(directory, directoryName);
    const filePath = path.join(directoryPath, fileName);

    try {
      await fs.promises.access(filePath);
      const fileContent = JSON.parse(
        await fs.promises.readFile(filePath, "utf-8")
      );
      filePaths.push(fileContent);
    } catch {
      // File does not exist, skip
    }
  }

  return filePaths;
}

export async function loadJSONFile(filePath: string): Promise<any> {
  try {
    const fileContent = JSON.parse(
      await fs.promises.readFile(filePath, "utf-8")
    );
    return fileContent;
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new HttpError(404, "Archivo no encontrado");
    } else if (error instanceof SyntaxError) {
      throw new HttpError(400, "Error de sintaxis en el archivo JSON");
    } else {
      throw new HttpError(500, "Error al leer el archivo JSON");
    }
  }
}
