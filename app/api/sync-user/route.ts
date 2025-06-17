import { dbConnect } from '@/lib/db';
import User from '@/models/User';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new Response("Unauthorized", { status: 401 });

        await dbConnect();

        const client = await clerkClient();
        const user = await client.users.getUser(userId);


        const existing = await User.findOne({ clerkId: userId });
        if (!existing) {
            await User.create({
            clerkId: userId,
            email: user.emailAddresses[0].emailAddress,
            name: user.firstName + ' ' + user.lastName,
            });
        }
        return NextResponse.json(
            { message: "User synced successfully",  username: existing.username ? existing.username : null },
            { status: 200 })
    } catch (error) {
        console.error("Error syncing user:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}
