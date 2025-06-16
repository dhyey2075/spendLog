"use client";
import React, { useEffect } from "react";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import TxnForm from "../components/TxnForm";
import YourTxn from "../components/YourTxn";
import { Pen } from "lucide-react";
import Balance from "../components/Balance";

const Dashboard = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [createTxn, setCreateTxn] = React.useState(false);
  const [balance, setBalance] = React.useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/sync-user")
        .then((res) => {
          if (res.status === 200) {
            console.log("User synced successfully");
          }
        })
        .catch((err) => {
          console.error("Error syncing user:", err.message);
        });
    }
  }, [isSignedIn]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SignedIn>
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome, {user?.firstName} {user?.lastName}
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your transactions and track your activities
                </p>
              </div>
              <div className="flex items-center space-x-4 spa">
                <Balance balance={balance} setBalance={setBalance} />
                <div>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setCreateTxn(!createTxn)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              {createTxn ? (
                <>
                  <span className="mr-2">✕</span>
                  Close Form
                </>
              ) : (
                <>
                  <span className="mr-2">+</span>
                  Create Transaction
                </>
              )}
            </button>
          </div>

          {createTxn ? (
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <span className="i-lucide-pencil-line" /> New Transaction
              </h2>
              <TxnForm createTxn={createTxn} setCreateTxn={setCreateTxn} />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <YourTxn balance={balance} setBalance={setBalance} setCreateTxn={setCreateTxn} />
            </div>
          )}
        </main>
      </SignedIn>
    </div>
  );
};

export default Dashboard;