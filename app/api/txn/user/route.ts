import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    try {
        await dbConnect();
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const txns = await Transaction.find({ from: user._id }).lean();
        for (const txn of txns) {
            const toUser = await User.findById(txn.to);
            if (toUser) {
                txn.toUsername = toUser.username || "Unknown";
            } else {
                txn.toUsername = "Unknown";
            }
        }
        return NextResponse.json(
            { transactions: txns, balance: user.balance || 0 },
            { status: 200 }
        )
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
    }
}