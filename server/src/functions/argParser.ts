import path from "path";
import HttpError from "../errors/HttpError";

import { Request } from "express";

export async function parseArgs(
  req: Request,
  usesArgParser: boolean,
  serviceArgs: {
    type: string;
    name?: string;
    format?: string;
    required?: boolean;
  }[],
  outputFilePath: string
): Promise<string[]> {
  const parsedArgs: string[] = [];

  for (const arg of serviceArgs) {
    if (arg.type === "file") {
      if (!req.file || !("path" in req.file)) {
        if (arg.required) {
          throw new HttpError(400, "El archivo no se ha subido correctamente");
        } else {
          continue;
        }
      }
      const fileExtension = path.extname(req.file.originalname).toLowerCase();
      if (fileExtension !== `.${arg.format!.toLowerCase()}`) {
        throw new HttpError(400, "El formato del archivo no es válido");
      }
      if (usesArgParser) {
        parsedArgs.push("--" + arg.name);
      }
      parsedArgs.push(req.file.path);
    } else if (arg.type === "output") {
      if (usesArgParser) {
        parsedArgs.push("--" + arg.name);
      }
      parsedArgs.push(outputFilePath);
    } else {
      if (!req.body) {
        if (arg.required) {
          throw new HttpError(400, "El cuerpo de la solicitud no es válido");
        } else {
          continue;
        }
      }
      if (!req.body[arg.name!]) {
        if (arg.required) {
          throw new HttpError(400, "Falta el argumento requerido: " + arg.name);
        } else {
          continue;
        }
      }
      if (usesArgParser) {
        parsedArgs.push("--" + arg.name);
      }
      parsedArgs.push(req.body[arg.name!]);
    }
  }

  return parsedArgs;
}
