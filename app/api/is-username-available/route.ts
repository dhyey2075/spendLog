import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { username } = body;

        if (!username || typeof username !== 'string' || username.length < 3) {
            return NextResponse.json({ available : false } , { status: 200 });
        }

        dbConnect();
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return NextResponse.json({ available: false }, { status: 200 });
        }
        return NextResponse.json({ available: true }, { status: 200 });
    } catch (error: any) {
        console.error("Error checking username availability:", error);
        return NextResponse.json({ error: "Failed to check username availability" }, { status: 500 });
    }
}