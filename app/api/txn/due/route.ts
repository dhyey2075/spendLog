import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new Response("Unauthorized", { status: 401 });

        await dbConnect();

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return new Response("User not found", { status: 404 });
        }
        const dueTransactions = await Transaction.find({
            to: user._id,
            settled: false
        }).populate("from", "username");

        // Map transactions to add fromUserName as a separate field
        const transactionsWithFromUserName = dueTransactions.map(txn => {
            const txnObj = txn.toObject();
            return {
            ...txnObj,
            fromUserName: txnObj.from?.username || null,
            from: txnObj.from?._id || txnObj.from // keep only the id in 'from'
            };
        });

        return NextResponse.json(
            { message: "Due transactions fetched successfully", transactions: transactionsWithFromUserName },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching due transactions:", error);
        return NextResponse.json(
            { error: "Failed to fetch due transactions" },
            { status: 500 }
        );
    }
}