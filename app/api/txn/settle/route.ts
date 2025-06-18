import { NextResponse, NextRequest } from "next/server";
import { dbConnect } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return new Response("Unauthorized", { status: 401 });

        await dbConnect();

        const url = new URL(req.url);
        const txnId = url.searchParams.get("txnId");
        if (!txnId) return new Response("Transaction ID is required", { status: 400 });

        const txn = await Transaction.findById(txnId);
        if (!txn) return new Response("Transaction not found", { status: 404 });

        console.log(txn);

        const toUser = await User.findById(txn.to);
        const fromUser = await User.findById(txn.from);
        toUser.balance = (toUser.balance || 0) + txn.amount; 
        fromUser.balance = (fromUser.balance || 0) - txn.amount; 
        console.log("From User Balance:", fromUser.balance);
        console.log("To User Balance:", toUser.balance);

        await toUser.save();
        await fromUser.save();

        txn.settled = true;
        await txn.save();

        return NextResponse.json(
            { message: "Transaction settled successfully", transaction: txn, balance: toUser.balance },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error settling transaction:", error);
        return NextResponse.json(
            { error: "Failed to settle transaction" },
            { status: 500 }
        );
    }
}