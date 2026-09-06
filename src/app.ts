import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import httpStatus from "http-status";
import config from "./app/config";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { AuthRoutes } from "./app/module/auth/auth.route";
import { AmbulanceRoutes } from "./app/module/ambulances/ambulance.route";
import { EmergencyRequestRoutes } from "./app/module/emergencyRequest/emergencyRequest.route";
import { DispatchRoutes } from "./app/module/dispatch/dispatch.route";

const app: Application = express();

app.use(
	cors({
		origin: config.frontend_url,
		credentials: true,
	}),
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

 app.use("/api/v1/auth", AuthRoutes);
 app.use("/api/v1/ambulances", AmbulanceRoutes);
 app.use("/api/v1/emergency-requests", EmergencyRequestRoutes);
 app.use("/api/v1/dispatch", DispatchRoutes);
app.get("/", async (req: Request, res: Response) => {
	res.status(httpStatus.OK).json({
		success: true,
		message: "Welcome to Emergency Ambulance Dispatch System",
	});
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
