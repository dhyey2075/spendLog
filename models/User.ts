import mongoose from "mongoose";

export interface IUserSettings {
    currency: string;
    dailyLimit: number;
    notificationEnabled: boolean;
    theme: "light" | "dark";
}

export interface IUser {
    clerkId: string;
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    balance: number;
    friends?: mongoose.Types.ObjectId[];
    groups?: mongoose.Types.ObjectId[];
    settings?: IUserSettings;
    createdAt: Date;
    updatedAt: Date;
}



const userSchema = new mongoose.Schema<IUser>({
    clerkId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
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