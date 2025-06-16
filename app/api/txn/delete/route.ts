import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id");
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
        return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    try {
        await dbConnect();
        const txn = await Transaction.findById(id);
        const result = await Transaction.deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
        }
        const user = await User.findOne({ clerkId: userId });
        user.balance = (user.balance || 0) - txn.amount; //because txn.amount is negative, this will effectively add the amount back to the user's balance
        await user.save();
        return NextResponse.json({ message: "Transaction deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return NextResponse.json({ error: "Failed to delete transaction" }, { status: 500 });
    }
}