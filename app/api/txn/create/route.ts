import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Transaction from "@/models/Transaction";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return new Response("Unauthorized", { status: 401 });

        await dbConnect();

        const body = await req.json();
        const { amount, description, method, category, to, merchant } = body;

        // Validate input
        if (typeof amount !== "number" || typeof description !== "string") {
            return new Response("Invalid input", { status: 400 });
        }

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        const newTxn = new Transaction({
            from: user._id,
            to: to || null,
            merchant: merchant || null,
            amount: -amount,
            description: description || "No description provided",
            method,
            category: category || "Uncategorized",
            createdAt: new Date(),
        })
        await newTxn.save();

        user.balance = (user.balance || 0) - amount; 
        await user.save();

        return NextResponse.json(
            { message: "Transaction created successfully", transaction: newTxn, balance: user.balance },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating transaction:", error);
        return NextResponse.json(
            { error: "Failed to create transaction" },
            { status: 500 }
        )
    }
}