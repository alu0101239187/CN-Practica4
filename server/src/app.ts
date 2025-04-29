import express from "express";
import cors from "cors";
import servicesRouter from "./routes/services.routes";
import defaultRouter from "./routes/default.routes";
import errorHandler from "./middlewares/errorHandler";

const corsOptions = {
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(servicesRouter);
app.use(defaultRouter);

app.use(errorHandler);

export default app;
