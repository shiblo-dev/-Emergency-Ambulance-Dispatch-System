type IOptions = {
	page?: number | string;
	limit?: number | string;
	sortBy?: string;
	sortOrder?: "asc" | "desc" | string;
};

type IPaginationResult = {
	page: number;
	limit: number;
	skip: number;
	sortBy: string;
	sortOrder: "asc" | "desc";
};

const calculatePagination = (options: IOptions): IPaginationResult => {
	const page = Number(options.page) || 1;
	const limit = Number(options.limit) || 10;
	const skip = (page - 1) * limit;

	const sortBy = options.sortBy || "createdAt";
	const sortOrder: "asc" | "desc" = options.sortOrder === "asc" ? "asc" : "desc";

	return { page, limit, skip, sortBy, sortOrder };
};

export const paginationHelper = {
	calculatePagination,
};