import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({ status: "Webhook path is active" });
}

export async function POST(req: Request) {
  return NextResponse.json({ status: "OK" });
}