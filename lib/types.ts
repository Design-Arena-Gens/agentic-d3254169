export type OrderStatus =
  | "pending"
  | "assigned"
  | "accepted"
  | "picked-up"
  | "in-transit"
  | "delivered"
  | "returned";

export interface Order {
  id: string;
  reference: string;
  customerName: string;
  customerPhone: string;
  address: string;
  cashOnDelivery: number;
  status: OrderStatus;
  assignedDriverId?: string | null;
  promisedAt: string;
  notes?: string;
  barcode?: string;
  timeline: Array<{
    status: OrderStatus;
    at: string;
    actor: string;
    note?: string;
  }>;
  cashCollected?: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  licensePlate: string;
  currentOrderIds: string[];
  lastHeartbeat: string;
  location: {
    lat: number;
    lng: number;
  };
  etaReturningMinutes?: number;
  cashOnHand: number;
  status: "available" | "on-task" | "offline";
}

export interface CashSession {
  id: string;
  driverId: string;
  date: string;
  expectedAmount: number;
  declaredAmount: number;
  status: "pending" | "verified" | "discrepancy";
  verifierId?: string;
  verifierNote?: string;
}

export interface AssignmentLog {
  id: string;
  orderId: string;
  driverId: string;
  assignedBy: string;
  assignedAt: string;
  note?: string;
}
