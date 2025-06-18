import mongoose from "mongoose";

interface IFrom {
    _id: mongoose.Types.ObjectId;
    username: string; // Optional field for username of the sender
}

export interface ITransaction {
    _id: mongoose.Types.ObjectId;
    to?: mongoose.Types.ObjectId;
    merchant?: string;
    toUsername: string; // Optional field for username of the recipient
    from: mongoose.Types.ObjectId | IFrom; // Can be an ObjectId or an object with username
    amount: number;
    description: string;
    method: "Credit" | "Debit" | "UPI" | "Cash";
    category?: string;
    splitBetween?: mongoose.Types.ObjectId[];
    splitType?: "Equal" | "Unequal";
    settled?: boolean;
    createdAt: Date;
    fromUserName?: string; // Optional field for username of the sender
}

const transactionSchema = new mongoose.Schema<ITransaction>({
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    merchant: { type: String, default: null },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    description: { type: String, required: true, minlength: 1, maxlength: 100 },
    method: { type: String, enum: ["Credit", "Debit", "UPI", "Cash"], required: true },
    category: { type: String, default: "Uncategorized" },
    splitBetween: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    splitType: { type: String, enum: ["Equal", "Unequal"], default: "Equal" },
    settled: { type: Boolean, default: true },
}, {
    timestamps: true,
});

const Transaction = mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", transactionSchema);
export default Transaction;