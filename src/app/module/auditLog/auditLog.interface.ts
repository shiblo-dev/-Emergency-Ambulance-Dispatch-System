export interface IAuditLogFilters {
	searchTerm?: string;
	userId?: string;
	action?: string;
	entityType?: string;
	entityId?: string;
	ipAddress?: string;
	startDate?: string;
	endDate?: string;
}
