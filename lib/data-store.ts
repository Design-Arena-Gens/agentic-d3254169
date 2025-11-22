import { promises as fs } from "fs";
import path from "path";
import { AssignmentLog, CashSession, Driver, Order } from "./types";

const dataDir = path.join(process.cwd(), "data");

async function readJsonFile<T>(file: string): Promise<T> {
  const filePath = path.join(dataDir, file);
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data) as T;
}

async function writeJsonFile<T>(file: string, data: T) {
  const filePath = path.join(dataDir, file);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export async function getOrders(): Promise<Order[]> {
  return readJsonFile<Order[]>("orders.json");
}

export async function saveOrders(orders: Order[]) {
  await writeJsonFile("orders.json", orders);
}

export async function getDrivers(): Promise<Driver[]> {
  return readJsonFile<Driver[]>("drivers.json");
}

export async function saveDrivers(drivers: Driver[]) {
  await writeJsonFile("drivers.json", drivers);
}

export async function getCashSessions(): Promise<CashSession[]> {
  return readJsonFile<CashSession[]>("cash_sessions.json");
}

export async function saveCashSessions(sessions: CashSession[]) {
  await writeJsonFile("cash_sessions.json", sessions);
}

export async function getAssignmentLogs(): Promise<AssignmentLog[]> {
  return readJsonFile<AssignmentLog[]>("assignments.json");
}

export async function saveAssignmentLogs(logs: AssignmentLog[]) {
  await writeJsonFile("assignments.json", logs);
}
