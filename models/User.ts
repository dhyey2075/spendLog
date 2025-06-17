import mongoose from "mongoose";

export interface IUserSettings {
    currency: string;
    dailyLimit: number;
    notificationEnabled: boolean;
    theme: "light" | "dark";
}

export interface IFriend {
    _id: mongoose.Types.ObjectId;
    username: string; 
    friendSince: Date;
}

export interface IUser {
    clerkId: string;
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    username?: string; // Optional field for username
    balance: number;
    friends?: IFriend[]; // Array of friends with additional info
    groups?: mongoose.Types.ObjectId[];
    settings?: IUserSettings;
    createdAt: Date;
    updatedAt: Date;
}

const friendSchema = new mongoose.Schema<IFriend>({
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true },
    friendSince: { type: Date, default: Date.now },
})


const userSchema = new mongoose.Schema<IUser>({
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, unique: true, sparse: true }, 
    balance: { type: Number, default: 0 },
    friends: [friendSchema],
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    settings: {
        currency: { type: String, default: "INR" },
        dailyLimit: { type: Number, default: 1000 },
        notificationEnabled: { type: Boolean, default: true },
        theme: { type: String, enum: ["light", "dark"], default: "light" },
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;