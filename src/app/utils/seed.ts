import bcrypt from "bcryptjs";
import { Role } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import { AppError } from "./AppError";
import httpStatus from "http-status";

export const seedTesterAdmin = async () => {
	try {
		const isTesterAdminExist = await prisma.user.findUnique({
			where: {
				email: config.tester_admin_email,
			},
		});

		if (isTesterAdminExist) {
			console.log("Tester Admin Already Exists!");
			return;
		}

		const name = config.tester_admin_name;
		const email = config.tester_admin_email;
		const password = config.tester_admin_password;

		if (!name || !email || !password) {
			throw new AppError(
				httpStatus.INTERNAL_SERVER_ERROR,
				"Tester Admin Name , Email, Password Missing In Env File!!!",
			);
		}

		const hashedPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const testerAdmin = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: Role.ADMIN,
				needPasswordChange: false,
				emailVerified: true,
			},
		});

		console.log("Tester Admin Created : ", testerAdmin);
	} catch (error) {
		console.log("Error Seeding Tester Admin : ", error);

		await prisma.user.delete({
			where: {
				email: config.tester_admin_email,
			},
		});
	}
};

export const seedTesterPatient = async () => {
	try {
		const isTesterPatientExist = await prisma.user.findUnique({
			where: {
				email: config.tester_patient_email,
			},
		});

		if (isTesterPatientExist) {
			console.log("Tester Patient Already Exists!");
			return;
		}

		const name = config.tester_patient_name;
		const email = config.tester_patient_email;
		const password = config.tester_patient_password;

		if (!name || !email || !password) {
			throw new AppError(
				httpStatus.INTERNAL_SERVER_ERROR,
				"Tester Patient Name, Email, Password Missing In Env File!!!",
			);
		}

		const hashedPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const testerPatient = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: Role.PATIENT,
				needPasswordChange: false,
				emailVerified: true,
			},
		});

		console.log("Tester Patient Created : ", testerPatient);
	} catch (error) {
		console.log("Error Seeding Tester Patient : ", error);

		await prisma.user.delete({
			where: {
				email: config.tester_patient_email,
			},
		});
	}
};

export const seedTesterDispatcher = async () => {
	try {
		const isTesterDispatcherExist = await prisma.user.findUnique({
			where: {
				email: config.tester_dispatcher_email,
			},
		});

		if (isTesterDispatcherExist) {
			console.log("Tester Dispatcher Already Exists!");
			return;
		}

		const name = config.tester_dispatcher_name;
		const email = config.tester_dispatcher_email;
		const password = config.tester_dispatcher_password;

		if (!name || !email || !password) {
			throw new AppError(
				httpStatus.INTERNAL_SERVER_ERROR,
				"Tester Dispatcher Name, Email, Password Missing In Env File!!!",
			);
		}

		const hashedPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds),
		);

		const testerDispatcher = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: Role.DISPATCHER,
				needPasswordChange: false,
				emailVerified: true,
			},
		});

		console.log("Tester Dispatcher Created : ", testerDispatcher);
	} catch (error) {
		console.log("Error Seeding Tester Dispatcher : ", error);

		await prisma.user.delete({
			where: {
				email: config.tester_dispatcher_email,
			},
		});
	}
};