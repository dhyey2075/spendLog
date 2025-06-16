import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { auth } from "@clerk/nextjs/server";

interface IParams {
    amount: string;
}

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        await dbConnect();
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        // Extract the dynamic route parameter from the URL
        const amount = req.nextUrl.pathname.split("/").pop();
        if (!amount || isNaN(Number(amount))) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }
        user.balance = Number(amount);
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