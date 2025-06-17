import React, { useEffect } from 'react'
import { toast } from "sonner"

interface TxnFormProps {
    createTxn: boolean;
    setCreateTxn: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ISuggestions {
    _id: string;
    username: string;
}

const TxnForm: React.FC<TxnFormProps> = ({ createTxn, setCreateTxn }) => {
    const [txn, setTxn] = React.useState({
        amount: '',
        isExpense: true,
        to: '',
        date: new Date().toISOString().split('T')[0],
        category: '',
        description: '',
        method: 'UPI',
        merchant: '',
    });
    const [loading, setLoading] = React.useState<boolean>(false);
    const [suggestions, setSuggestions] = React.useState<ISuggestions[]>([]);
    const [Xtrato, setXtraTo] = React.useState<string>('');
    const categories = [
        'Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Salary', 'Investment', 'Gift', 'Travel', 'Groceries', 'Utilities', 'Subscriptions', 'Personal Care', 'Charity', 'Miscellaneous', 'Uncategorized', 'Other'
    ]
    const merchant = [
        "Papa",
        'Mummy',
        "Friends",
        "Honey One",
        "Aashapura",
        "Padma Kamal",
        "Shinestar",
        "Kaka's Shop",
        "Nescafe",
        "Juice Shop",
        "KPP",
        "Amul",
        "Mess",
        "Pramukh",
        "RC",
        "Other"
    ];
    // useEffect(() => {
    //     if (hasFetched.current) return;
    //     hasFetched.current = true;
    //     const fetchMerchants = async () => {
    //         try {
    //             const response = await fetch('/api/get-friends');
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch friends');
    //             }
    //             const data = await response.json();
    //             return data.friends;
    //         } catch (error) {
    //             console.error('Error fetching merchants:', error);
    //             toast.error("Error fetching merchants", {
    //                 position: "top-right",
    //                 style: { background: "#ef4444", color: "#fff" }
    //             });
    //             return [];
    //         }
    //     };
    //     fetchMerchants()
    //         .then(friends => {
    //             if (friends.length > 0) {
    //                 setMerchant(prev => [...prev, ...friends]);
    //             }
    //             setFetchingFriends(false);
    //         })
    //         .catch(error => {
    //             console.error("Error fetching friends:", error);
    //         });
    // }, []);

    useEffect(() => {
        const i = setTimeout(async () => {
            if (txn.to.trim().length < 3) {
                setSuggestions([]);
                return;
            }
            try {
                const response = await fetch(`/api/suggest-friends?query=${txn.to}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch suggestions');
                }
                const data = await response.json();
                setSuggestions(data.suggestions || []);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                toast.error("Error fetching suggestions", {
                    position: "top-right",
                    style: { background: "#ef4444", color: "#fff" }
                });
            }
        }, 1000);
        return () => clearTimeout(i);
    }, [txn.to])
    return (
        <div>
            <div>
                <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span className="i-lucide-pencil-line" /> New Transaction
                </h2>
                <form action="POST">
                    <div className="mb-4">
                        <label className="block text-gray-700">Amount</label>
                        <input
                            type="number"
                            value={txn.amount}
                            onChange={(e) => setTxn({ ...txn, amount: e.target.value })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Type</label>
                        <select
                            value={txn.isExpense ? 'Expense' : 'Income'}
                            disabled={txn.to !== ''}
                            onChange={(e) => setTxn({ ...txn, isExpense: e.target.value === 'Expense' })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="Expense">Expense</option>
                            <option value="Income">Income</option>

                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Merchant</label>
                        <select
                            value={txn.merchant}
                            disabled={txn.to !== ''}
                            onChange={(e) => setTxn({ ...txn, merchant: e.target.value })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="">Select To</option>
                            {merchant.map((to: string ) => (
                                <option key={to} value={to}>
                                    {to}
                                </option>
                            ) 
                            )}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">To</label>
                        <input
                            type="text"
                            value={txn.to}
                            disabled={txn.merchant !== ''}
                            onChange={(e) => setTxn({ ...txn, to: e.target.value })}
                            placeholder="Enter recipient's name or ID"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <div className='text-md mt-2 border-2-blue-500 border-dashed p-2 rounded-md bg-gray-300'>
                            {txn.to.trim() === "" ? "Type to get suggestions..." : suggestions.length > 0 ? (
                                <ul className="list-disc pl-5">
                                    {suggestions.map((user) => (
                                        <li onClick={() => {
                                            setTxn({ ...txn, to: user.username });
                                            setXtraTo(user._id);
                                            setSuggestions([]);
                                        }} key={user._id} className="list-none">
                                            <span className="font-medium">{user.username}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No suggestions found</p>
                            )}
                        </div>

                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Date</label>
                        <input
                            type="date"
                            value={txn.date}
                            onChange={(e) => setTxn({ ...txn, date: e.target.value })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700">Category</label>
                        <select
                            value={txn.category}
                            onChange={(e) => setTxn({ ...txn, category: e.target.value })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="" disabled>Select category</option>
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <textarea
                            value={txn.description}
                            onChange={(e) => setTxn({ ...txn, description: e.target.value })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Method</label>
                        <select
                            value={txn.method}
                            onChange={(e) => setTxn({ ...txn, method: e.target.value })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="UPI">UPI</option>
                            <option value="Credit">Credit</option>
                            <option value="Debit">Debit</option>
                            <option value="Cash">Cash</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        disabled={loading}
                        onClick={async (e) => {
                            setLoading(true);
                            e.preventDefault();
                            if (!txn.amount) {
                                alert("Please fill in all required fields.");
                                return;
                            }
                            if (!txn.merchant && !txn.to) {
                                toast.error("Please select a merchant or enter a recipient.", {
                                    position: "top-right",
                                    style: { background: "#ef4444", color: "#fff" }
                                });
                                setLoading(false);
                                return;
                            }
                            const response = await fetch('/api/txn/create', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    amount: parseFloat(txn.amount),
                                    isExpense: txn.isExpense,
                                    date: txn.date,
                                    to: Xtrato || null,
                                    merchant: txn.merchant || null,
                                    category: txn.category,
                                    description: txn.description,
                                    method: txn.method,
                                }),
                            })
                            const data = await response.json();
                            if (response.status === 201) {
                                toast.success("Transaction created successfully!", {
                                    position: "top-right",
                                    style: { background: "#22c55e", color: "#fff" }
                                });
                            }
                            else {
                                toast.error(`Error creating transaction: ${data.error || "Unknown error"}`, {
                                    position: "top-right",
                                    style: { background: "#ef4444", color: "#fff" }
                                });
                                console.error("Error creating transaction:", data);
                            }
                            setCreateTxn(!createTxn);
                            setLoading(false);
                            setTxn(
                                {
                                    amount: '',
                                    isExpense: true,
                                    to: '',
                                    merchant: '',
                                    date: new Date().toISOString().split('T')[0],
                                    category: '',
                                    description: '',
                                    method: 'UPI',
                                }
                            )
                        }}
                    >
                        {loading ? "Creating..." : "Create Transaction"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default TxnForm