import type { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { auditLogFilterableFields } from "./auditLog.constant";
import pick from "../../utils/pick";
import { AuditLogServices } from "./auditLog.service";

const getAllAuditLogs = catchAsync(async (req: Request, res: Response) => {
	const filters = pick(req.query, auditLogFilterableFields);
	const query = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

	const result = await AuditLogServices.getAllAuditLogs(filters, query);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Audit Logs Retrieved Successfully",
		meta: result.meta,
		data: result.data,
	});
});

const getSingleAuditLog = catchAsync(async (req: Request, res: Response) => {
	const { auditLogId } = req.params;

	const result = await AuditLogServices.getSingleAuditLog(auditLogId as string);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Audit Log Retrieved Successfully",
		data: result,
	});
});

export const AuditLogControllers = {
	getAllAuditLogs,
	getSingleAuditLog,
};
