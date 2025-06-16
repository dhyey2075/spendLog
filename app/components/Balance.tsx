import { Pen, Save } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner';

interface BalanceProps {
    balance: number | null;
    setBalance: React.Dispatch<React.SetStateAction<number | null>>;
}

const Balance: React.FC<BalanceProps> = ({ balance, setBalance }) => {
     const [editing, setEditing] = React.useState<boolean>(false);
     const [newBalance, setNewBalance] = React.useState<number | null>(balance);
    return (
        <div className="flex items-center space-x-2">
            <div>
                {
                    editing ? (
                        <input
                            type="number"
                            value={newBalance ?? ''}
                            onChange={(e) => setNewBalance(Number(e.target.value))}
                            className="border border-gray-300 rounded-md p-2 w-32"
                        />
                    ) : (
                        <span className="text-xl font-bold">
                            {balance !== null ? `₹${balance.toFixed(2)}` : '₹0.00'}
                        </span>
                    )
                }
            </div>
            <div>
                {
                    editing ? (
                        <Save onClick={async() => {
                            setEditing(false);
                            const cachedBalance = balance;
                            setBalance(newBalance);
                            if(newBalance !== null && newBalance >= 0) {
                                setBalance(newBalance);
                                const response = await fetch(`/api/balance/${newBalance}`)
                                const data = await response.json();
                                if(response.status !== 200) {
                                    setBalance(cachedBalance);
                                    toast.error(`Error updating balance: ${data.error || 'Unknown error'}`, {
                                        position: "top-right",
                                        style: { background: "#ef4444", color: "#fff" }
                                    });
                                }
                            }
                        }} />
                    ) : (
                        <Pen onClick={() => {
                            setEditing(!editing);
                        }} />
                    )
                }
            </div>
        </div>
    )
}

export default Balance