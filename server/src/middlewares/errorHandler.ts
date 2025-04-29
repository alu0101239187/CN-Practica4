import { Request, Response, NextFunction } from "express";

function errorHandler(
  err: { statusCode?: number; message?: string; stack?: string },
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(`[${new Date().toISOString()}] ${err.stack}`);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({ error: message });
}

export default errorHandler;
