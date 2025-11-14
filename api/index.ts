import express from "express";
import { registerRoutes } from "../server/routes";
import { seedInitialData } from "../server/seed-data";

const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

export default async (req: any, res: any) => {
  try {
    console.log("Environment check:", {
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      nodeEnv: process.env.NODE_ENV
    });

    // Register routes once
    if (!app._router) {
      console.log("Registering routes...");
      await registerRoutes(app);

      // Skip seeding in production - database should already be set up
      console.log("Skipping data seeding in production");

      app.use((err: any, _req: any, res: any, _next: any) => {
        console.error("Global error handler:", err);
        const status = err.status || err.statusCode || 500;
        const message = process.env.NODE_ENV === "development"
          ? err.message || "Internal Server Error"
          : "Internal Server Error";
        res.status(status).json({
          message,
          ...(process.env.NODE_ENV === "development" && { stack: err.stack })
        });
      });
    }

    return app(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    return res.status(500).json({
      message: "Server initialization failed",
      ...(process.env.NODE_ENV === "development" && { error: error.message })
    });
  }
};