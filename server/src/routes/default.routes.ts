import express from "express";
import HttpError from "../errors/HttpError";

const defaultRouter = express.Router();

defaultRouter.all("*", (_, res, next) => {
  next(new HttpError(501, "Ruta no implementada"));
});

export default defaultRouter;
