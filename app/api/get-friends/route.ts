import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const user = await User.findOne({ clerkId: userId })
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const friends = user.friends
        return NextResponse.json({ friends }, { status: 200 });
    } catch (error) {
        console.error("Error fetching friends:", error);
        return NextResponse.json({ error: "Failed to fetch friends" }, { status: 500 });
    }
}