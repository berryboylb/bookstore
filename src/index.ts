import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import limiter from "./middleware/ratelimiter";
import routes from "./routes";
import { logger, errorResponder, invalidPathHandler } from "./middleware";
import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
dotenv.config();
const port = process.env.PORT || 8000;
const app: Express = express();

Sentry.init({
  dsn: "https://e34d13197d88abd2e1acc99a07d084da@o4506271645499392.ingest.sentry.io/4506271647989760",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(cors());
app.use(express.json({ extended: false } as any));
app.use(limiter());
app.use(logger);

//these are our routes
app.use("/api/v1", routes);
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from express + ts");
});

app.get("/debug-sentry", function mainHandler(req: Request, res: Response) {
  throw new Error("My first Sentry error!");
});

app.use(Sentry.Handlers.errorHandler());
app.use(function onError(err:any, req: Request, res: any, next: NextFunction) {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});
app.use(errorResponder);
app.use(invalidPathHandler);

if (!module.parent) {
  const server = app.listen(port, () => {
    console.log(`now listening on port ${port}`);
  });

  process.on("SIGTERM", () => {
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
}

export default app;
