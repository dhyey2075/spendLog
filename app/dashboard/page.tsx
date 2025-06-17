"use client";
import React, { useEffect } from "react";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import TxnForm from "../components/TxnForm";
import YourTxn from "../components/YourTxn";
import Balance from "../components/Balance";
import { Loader2, Stars } from "lucide-react";
import { toast } from "sonner";
import SetUserName from "../components/SetUserName";
import AddFriend from "../components/AddFriend";

const Dashboard = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [createTxn, setCreateTxn] = React.useState(false);
  const [balance, setBalance] = React.useState<number | null>(null);
  const [message, setMessage] = React.useState<string>("");
  const [refresh, setRefresh] = React.useState<boolean>(false);
  const [userName, setUserName] = React.useState<string>("");
  const [loadingUserName, setLoadingUserName] = React.useState<boolean>(true);
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
          return res.json();
        })
        .then((data) => {
          console.log("Test", data);
          setUserName(data.username);
          setLoadingUserName(false);
        })
        .catch((err) => {
          console.error("Error syncing user:", err.message);
        });
    }
   
  }, [isSignedIn, refresh]);

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
          <div className="flex justify-end mb-6 space-x-4">
          <div>
            <AddFriend />
          </div>
            {loadingUserName ? (<>
              <Loader2 />
            </>) : userName ? (
              <div className="flex items-center p-2 rounded-sm space-x-4 bg-gradient-to-r from-blue-500 to-orange-500">
                <span className="text-md font-bold text-gray-600 dark:text-gray-300">
                  @{userName || "Not set"}
                </span>
              </div>
            ) : (
              <SetUserName refresh={refresh} setRefresh={setRefresh} />
            )}
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

          <div className="flex items-center space-x-2">
            <input type="text" 
              placeholder="Use AI to generate a transaction..." 
              className="w-full max-w-md px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              onChange={(e) => setMessage(e.target.value)} 
              value={message}
            />
            <div className="mb-4 p-2 rounded-sm bg-gradient-to-r from-pink-500 to-purple-500"
              onClick={async() => {
                if (message.trim()) {
                  const response = await fetch("/api/ai", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ prompt: message, userId: user?.id }),
                  })
                  const data = await response.json();
                  if(response.status === 200) {
                    setMessage("");
                    toast.success("Transaction created successfully by AI!", {
                      position: "top-right",
                      style: { background: "#22c55e", color: "#fff" }
                    });
                    setRefresh(!refresh);
                  }
                  else {
                    toast.error(data.error || "Failed to create transaction");
                  }
                }
              }}
            >
              <Stars />
            </div>
          </div>

          {createTxn ? (
            <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              
              <TxnForm createTxn={createTxn} setCreateTxn={setCreateTxn} />
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <YourTxn setBalance={setBalance} setCreateTxn={setCreateTxn} refresh={refresh} />
            </div>
          )}
        </main>
      </SignedIn>
    </div>
  );
};

export default Dashboard;