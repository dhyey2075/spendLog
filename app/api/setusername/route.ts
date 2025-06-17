import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";
import { dbConnect } from "@/lib/db";

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username } = body;

    if (!username || typeof username !== 'string' || username.length < 3) {
        return NextResponse.json({ error: "Username must be a string and atleast 3 letters long." }, { status: 400 });
    }

    try {
        await dbConnect();
        const user = await User.findOne({ clerkId: userId });
        user.username = username;
        await user.save();
        return NextResponse.json({ message: "Username set successfully", username }, { status: 200 });
    } catch (error) {
        console.error("Error setting username:", error);
        return NextResponse.json({ error: "Failed to set username" }, { status: 500 });
    }
}