import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const amount = segments[segments.length - 1];
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        await dbConnect();
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        user.balance = amount;
        await user.save();
        return NextResponse.json(
            { message: "Balance updated successfully", balance: user.balance },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating balance:", error);
        return NextResponse.json({ error: "Failed to update balance" }, { status: 500 });
    }
}