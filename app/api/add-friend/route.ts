import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { username, id } = body;

    if(!username || typeof username !== 'string' || username.length < 3) {
        return NextResponse.json({ error: "Username must be a string and at least 3 characters long." }, { status: 400 });
    }

    try {
        await dbConnect();
        const friendUser = await User.findOne({ username });
        if (!friendUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const user = await User.findOne({ clerkId: userId });
        // Check if the friend is already added
        if (user.friends.includes(id)) {
            return NextResponse.json({ message: "Friend already added" }, { status: 200 });
        }

        user.friends.push({
            _id: id,
            username,
            friendSince: new Date(),
        });
        console.log(user);
        await user.save();

        return NextResponse.json({ message: "Friend added successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error adding friend:", error);
        return NextResponse.json({ error: "Failed to add friend" }, { status: 500 });
    }
}