import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import teachersRouter from "./routes/teachers.routes";
import infoRouter from "./routes/info.routes";
import eventsRouter from "./routes/events.routes";
import authRouter from "./routes/auth.routes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "core-service" });
});

app.use("/api/teachers", teachersRouter);
app.use("/api/university", infoRouter);
app.use("/api/events", eventsRouter);
app.use("/api/auth", authRouter);

const PORT = Number(process.env.PORT || 3020);
const server = app.listen(PORT, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log(`core-service running on port ${PORT}`);
});

server.on("error", (err: any) => {
  console.error("Server error:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});

// Keep process alive
setInterval(() => {
  // eslint-disable-next-line no-console
  console.log("Server heartbeat");
}, 30000);


