import { NextResponse } from "next/server";
import { updateDriverLocation } from "@/lib/actions/drivers";

export async function POST(
  request: Request,
  { params }: { params: { driverId: string } }
) {
  const body = await request.json();

  await updateDriverLocation(params.driverId, {
    lat: body.lat,
    lng: body.lng
  });

  return NextResponse.json({ ok: true });
}
