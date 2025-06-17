import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return new Response("Unauthorized", { status: 401 });

        await dbConnect();

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('query') || '';


        const users = await User.find({
            clerkId: { $ne: userId },
            username: { $regex: query, $options: 'i' }
        }).select('username');

        return NextResponse.json({ suggestions: users }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user suggestions:", error);
        return NextResponse.json({ error: "Failed to fetch user suggestions" }, { status: 500 });
    }
}