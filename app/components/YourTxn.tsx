import React, { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { ITransaction } from '@/models/Transaction';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { Switch } from "@/components/ui/switch"


interface YourTxnProps {
    balance?: number | null;
    refresh?: boolean;
    setBalance: React.Dispatch<React.SetStateAction<number | null>>;
    setCreateTxn?: React.Dispatch<React.SetStateAction<boolean>>;
}

const YourTxn: React.FC<YourTxnProps> = ({ setBalance, setCreateTxn, refresh }) => {
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [transactions, setTransactions] = React.useState<ITransaction[] | []>([]);
  const [showOnlyLendedTxn, setShowOnlyLendedTxn] = React.useState<boolean>(false);
  const [showDueTxn, setShowDueTxn] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/txn/user`);
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        if(response.status === 200) {
          if(data.transactions.length === 0) {
            toast.info("No transactions found for this user.", {
              position: "top-right",
              style: { background: "#f59e0b", color: "#fff" }
            });
          }
          console.log(data);
          setTransactions(data.transactions);
          setBalance(data.balance || 0);
        } else {
          toast.error(`Error fetching transactions: ${data.error || 'Unknown error'}`, {
            position: "top-right",
            style: { background: "#ef4444", color: "#fff" }
          });
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    if(isLoaded && user && !showDueTxn) {
      fetchTransactions();
    }
  }, [isLoaded, user, refresh, showDueTxn, setShowDueTxn]);

  useEffect(() => {
    const fetchDueTransactions = async () => {
      if (!showDueTxn) return;
      setLoading(true);
      try {
        const response = await fetch(`/api/txn/due`);
        if (!response.ok) {
          throw new Error('Failed to fetch due transactions');
        }
        const data = await response.json();
        if(response.status === 200) {
          setTransactions(data.transactions);
        } else {
          toast.error(`Error fetching due transactions: ${data.error || 'Unknown error'}`, {
            position: "top-right",
            style: { background: "#ef4444", color: "#fff" }
          });
        }
      } catch (error) {
        console.error('Error fetching due transactions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDueTransactions();
  }, [showDueTxn, showOnlyLendedTxn]);



  const getTransactionStatusColor = (amount: number) => {
    return amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
  };

  useEffect(() => {
    console.log(transactions, "transactions");
  }, [transactions])

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Transactions
          </h2>
          <p className="mt-1 mb-2 text-sm text-gray-500 dark:text-gray-400">
            Track and manage your financial activities
          </p>
          {!showDueTxn && <div>
            <Switch className='mr-2' checked={showOnlyLendedTxn} onCheckedChange={setShowOnlyLendedTxn} />
            Show lended transactions only
          </div>}
          <div>
            <Switch className='mr-2' checked={showDueTxn} onCheckedChange={setShowDueTxn} />
            Show due transactions
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* Add filter/sort options here if needed */}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : transactions.length > 0 ? (
        <div className="grid gap-4">
          {transactions
            .filter(txn => !showOnlyLendedTxn || txn.settled === false)
            .map((txn) => (
              !showDueTxn ? (
                <div
                key={txn._id.toString()}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {txn.description}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-gray-500 dark:text-gray-400">
                      {txn.to && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {txn.settled ? "" : "Lend "} To: {txn.to && txn.to.toString().length === 24 ? `@${txn.toUsername}` : (txn.to ? txn.to.toString() : 'Unknown')}
                        </span>
                      )}
                      {txn.merchant && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          {txn.merchant}
                        </span>
                      )}
                      {txn.category && (
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m6-6V5a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V9m-6-6h6m-6 0H7" />
                          </svg>
                          {txn.category}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='flex flex-col items-start justify-between'>
                    <div className='ml-4'>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(txn.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="ml-4 flex items-center space-x-4">
                      <div className={`text-xl font-bold ${getTransactionStatusColor(txn.amount)}`}>
                        {txn.amount > 0 ? '+' : ''}{txn.amount} 
                        <span className="text-sm ml-1">{txn.method}</span>
                      </div>
                      <div>
                        <Trash2 onClick={async() => {
                          if(confirm("Are you sure you want to delete this transaction?")){
                            const response = await fetch(`/api/txn/delete?id=${txn._id}`, {
                              method: 'DELETE',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                            });
                            if(response.status === 200) {
                              setTransactions(transactions.filter(t => t._id.toString() !== txn._id.toString()));
                              setBalance(prev => prev! - txn.amount);
                              toast.success("Transaction deleted successfully", {
                                position: "top-right",
                                style: { background: "#22c55e", color: "#fff" }
                              });
                            }
                            else {
                              const data = await response.json();
                              toast.error(`Error deleting transaction: ${data.error || 'Unknown error'}`, {
                                position: "top-right",
                                style: { background: "#ef4444", color: "#fff" }
                              });
                            }
                          }
                        }} color='red' />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              ) : !txn.settled && (
                <div key={txn._id.toString()}>
                    <div className='flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow duration-200'>
                      <span>You owe {txn.fromUserName} {Math.abs(Number(txn.amount))} Rs</span>
                      <button 
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      disabled={txn.settled}
                       onClick={async() => {
                        if(confirm("Are you sure you want to settle this transaction?")) {
                          const response = await fetch(`/api/txn/settle?txnId=${txn._id}`)
                          if(response.status === 200) {
                            const data = await response.json();
                            setBalance(data.balance);
                            setTransactions(transactions.filter(t => t._id.toString() !== txn._id.toString()));
                            toast.success("Transaction settled successfully", {
                              position: "top-right",
                              style: { background: "#22c55e", color: "#fff" }
                            });
                          }
                          else {
                            const data = await response.json();
                            toast.error(`Error settling transaction: ${data.error || 'Unknown error'}`, {
                              position: "top-right",
                              style: { background: "#ef4444", color: "#fff" }
                            });
                          }
                        }
                      }} >
                          Settle Now
                      </button>
                    </div>
                </div>
              )
            ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No transactions</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new transaction.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setCreateTxn?.(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Transaction
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default YourTxn;