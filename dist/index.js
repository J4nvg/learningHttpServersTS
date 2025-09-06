import express from "express";
import { errorMiddleWare, middlewareLogResponse, middlewareMetricsInc } from "./api/middleware.js";
import { handlerHits } from "./admin/metrics.js";
import { handlerResetHits } from "./admin/reset.js";
import { handlerReadiness } from "./api/health.js";
import { handlerCreateChirp, handlerGetChrip, handlerGetChrips } from "./api/chirps.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";
import { handlerCreateUser, handlerLoginUser } from "./api/users.js";
const app = express();
const PORT = 8080;
app.use(middlewareLogResponse);
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);
app.use("/app", middlewareMetricsInc);
app.use("/app", express.static("./src/app"));
app.use(express.json());
app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerHits(req, res)).catch(next);
});
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerResetHits(req, res)).catch(next);
});
app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.post("/api/users", (req, res, next) => {
    Promise.resolve(handlerCreateUser(req, res)).catch(next);
});
app.post("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerCreateChirp(req, res)).catch(next);
});
app.get("/api/chirps", (req, res, next) => {
    Promise.resolve(handlerGetChrips(req, res)).catch(next);
});
app.get("/api/chirps/:id", (req, res, next) => {
    Promise.resolve(handlerGetChrip(req, res)).catch(next);
});
app.post("/api/login", (req, res, next) => {
    Promise.resolve(handlerLoginUser(req, res)).catch(next);
});
app.use(errorMiddleWare);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
