import { NextResponse } from "next/server";
import { listOrdersByDriver } from "@/lib/actions/orders";

export async function GET(
  _request: Request,
  { params }: { params: { driverId: string } }
) {
  const orders = await listOrdersByDriver(params.driverId);
  return NextResponse.json({ orders });
}
