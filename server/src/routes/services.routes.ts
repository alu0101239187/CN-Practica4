import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { loadJSONFile, loadJSONFilesByName } from "../functions/fileLoader";
import HttpError from "../errors/HttpError";
import { parseArgs } from "../functions/argParser";
import { executeService } from "../functions/serviceExecuter";
import { cleanupFile } from "../functions/fileCleaner";

const servicesRouter = express.Router();

const upload = multer({
  dest: path.join(__dirname, "../../uploads"),
});

servicesRouter.get("/services", async (req, res, next) => {
  try {
    const directoryPath = path.join(__dirname, "../../services");
    const clientSchemas = await loadJSONFilesByName(
      directoryPath,
      "client.schema.json"
    );
    if (!clientSchemas || clientSchemas.length === 0) {
      throw new HttpError(404, "No hay servicios disponibles");
    }
    const clientSchemaDetails = clientSchemas.map((schema) => ({
      name: schema.name,
      description: schema.description,
      url: schema.url,
    }));
    res.status(200).json(clientSchemaDetails);
    return;
  } catch (error) {
    next(error);
  }
});

servicesRouter.get("/services/:serviceName", async (req, res, next) => {
  try {
    const { serviceName } = req.params;
    if (!serviceName) {
      throw new HttpError(400, "Nombre de servicio inválido");
    }
    const filePath = path.join(
      __dirname,
      "../../services",
      serviceName,
      "client.schema.json"
    );
    const fileContent = await loadJSONFile(filePath);
    if (!fileContent) {
      throw new HttpError(404, "Servicio no encontrado");
    }
    res.status(200).json(fileContent);
    return;
  } catch (error) {
    next(error);
  }
});

servicesRouter.post(
  "/services/:serviceName",
  upload.single("file"),
  async (req, res, next) => {
    let outputFilePath: string | null = null;
    try {
      const { serviceName } = req.params;
      if (!serviceName) {
        throw new HttpError(400, "Nombre de servicio inválido");
      }

      // Server configuration reading
      const serverConfigFilePath = path.join(
        __dirname,
        "../../services",
        serviceName,
        "server.config.json"
      );
      const serverConfig = await loadJSONFile(serverConfigFilePath);
      if (!serverConfig) {
        throw new HttpError(404, "Servicio no encontrado");
      }

      // Arguments reading
      const uniqueId = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const outputFileName = `output-${uniqueId}.${serverConfig.response.format}`;
      outputFilePath = path.join(__dirname, "../../outputs", outputFileName);
      const parsedArgs = await parseArgs(
        req,
        serverConfig.uses_arg_parser,
        serverConfig.args,
        outputFilePath
      );

      // Service execution
      const result = await executeService(
        serverConfig.name,
        serverConfig.path,
        serverConfig.executer ? serverConfig.executer : "",
        parsedArgs
      );
      if (serverConfig.response.type === "file") {
        try {
          await fs.promises.access(outputFilePath);
        } catch (err) {
          throw new HttpError(404, `No se encontró el archivo de salida`);
        }
        res.status(200).download(
          outputFilePath,
          path.basename(outputFilePath),
          {
            headers: { "Content-Type": "application/pdf" },
          },
          (err) => {
            if (err) {
              console.error("Error enviando el archivo:", err);
            }
          }
        );
      } else {
        res.status(200).json({
          message: "Servicio ejecutado correctamente",
          output: result,
        });
      }
    } catch (error) {
      next(error);
    } finally {
      if (req.file && req.file.path) {
        await cleanupFile(req.file.path);
      }
      if (outputFilePath) {
        try {
          await fs.promises.access(outputFilePath);
          await cleanupFile(outputFilePath);
        } catch (err) {}
      }
    }
  }
);

export default servicesRouter;
