import fs from "fs/promises";
import { exec } from "child_process";
import HttpError from "../errors/HttpError";

const { promisify } = require("util");

export async function executeService(
  serviceName: string,
  serviceFilePath: string,
  executer: string,
  args: string[]
): Promise<string> {
  try {
    await fs.access(serviceFilePath);
  } catch (err) {
    throw new HttpError(404, `No se encontró el archivo de servicio`);
  }
  const asyncExec = promisify(exec);

  try {
    const { stdout } = await asyncExec(
      `${executer} ${serviceFilePath} ${args.join(" ")}`
    );
    const trimmedOutput = stdout.trim();
    return trimmedOutput;
  } catch (error) {
    if (error.code === 1) {
      throw new HttpError(
        400,
        `Entrada no válida ejecutando el servicio ${serviceName}`
      );
    }
    throw new HttpError(500, `Error al ejecutar el servicio ${serviceName}`);
  }
}
