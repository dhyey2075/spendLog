"use client";
import React, { useEffect } from 'react'
import { getSuggestions, ISuggestedUser } from '../components/AddFriend';
import { toast } from 'sonner';

const Lend = () => {
    const [amount, setAmount] = React.useState<number | null>(null);
    const [to, setTo] = React.useState<string>("");
    const [toID, setToID] = React.useState<string>("");
    const [method, setMethod] = React.useState<"UPI" | "Cash" | "Credit" | "Debit">("UPI");
    const [suggestions, setSuggestions] = React.useState<ISuggestedUser[]>([]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!amount || !toID || !method) {
            console.error("All fields are required");
            return;
        }

        try {
            const response = await fetch("/api/txn/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount: Number(amount) , to: toID, method, settled: false, isExpense: true }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Lend successful:", data);
                toast.success(`Lent successful.`, {
                    position: "top-right",
                    style: { background: "#22c55e", color: "#fff" }
                })
                // Optionally, you can reset the form or show a success message
            } else {
                console.error("Error lending money:", response.statusText);
            }
        } catch (error) {
            console.error("Error lending money:", error);
        }
    }

    useEffect(() => {
        const i = setTimeout(async() => {
            if(to.trim().length >= 3) {
                const sug = await getSuggestions(to);
                console.log(sug, "suggestions");
                console.log(toID)
                setSuggestions(sug);
            }

            return () => clearTimeout(i);
        }, 1000);
    }, [to])
  return (
    <div>
        <form onSubmit={handleSubmit} action="POST">
            <div className="flex flex-col gap-4">
                <label htmlFor="amount" className="text-sm font-medium">Amount to Lend</label>
                <input placeholder='Enter amount' value={amount ?? ""} onChange={(e) => setAmount(Number(e.target.value))} type="number" id="amount" name="amount" required className="border rounded p-2" />
                
                <label htmlFor="to" className="text-sm font-medium">Lend To</label>
                <input value={to} onChange={(e) => setTo(e.target.value)} type="text" id="to" name="to" required className="border rounded p-2" placeholder="Enter username" />
                {to && suggestions.length > 0 && (
                    <ul className="border rounded bg-white shadow-md mt-2 max-h-60 overflow-y-auto">
                        {suggestions.map((user) => (
                            <li key={user._id} onClick={() => {
                                setTo(user.username);
                                setToID(user._id);
                                setSuggestions([]);
                            }} className="p-2 hover:bg-gray-100 cursor-pointer">
                                {user.username}
                            </li>
                        ))}
                    </ul>
                )}

                <label htmlFor="description" className="text-sm font-medium">Method</label>
                <select value={method} onChange={(e) => setMethod(e.target.value as "UPI" | "Cash" | "Credit" | "Debit")} id="method" name="method" required className="border rounded p-2">
                    <option value="UPI">UPI</option>
                    <option value="Cash">Cash</option>
                    <option value="Credit">Credit Card</option>
                    <option value="Debit">Debit Card</option>
                </select>
                
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">Lend</button>
            </div>
        </form>
    </div>
  )
}

export default Lend