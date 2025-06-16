import { dbConnect } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() }, { status: 200 });
    } catch (error) {
        console.error("Health check failed:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}