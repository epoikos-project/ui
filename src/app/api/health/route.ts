import { NextResponse } from "next/server";

export async function GET() {
  const health = {
    status: "ok",
  };

  return NextResponse.json(health);
}
