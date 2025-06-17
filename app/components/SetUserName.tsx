import React, { useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from 'sonner';

interface SetUserNameProps {
    refresh?: boolean;
    setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
}

const SetUserName: React.FC<SetUserNameProps> = ({ refresh, setRefresh }) => {
    const [userName, setUserName] = React.useState<string>("");
    const [userAvailable, setUserAvailable] = React.useState<boolean | null>(null);
    const fetchIsUserAvailable = async (username: string): Promise<boolean> => {
        setUserAvailable(null); // Reset availability status before checking
        const response = await fetch(`/api/check-username?username=${username}`);
        if (!response.ok) {
            throw new Error("Failed to check username availability");
        }
        const data = await response.json();
        return data.available;
    }

    useEffect(() => {
        const i = setTimeout(async () => {
            if (userName.length >= 3) {
                try {
                    const isAvailable = await fetchIsUserAvailable(userName);
                    console.log(isAvailable, "userName");
                    setUserAvailable(isAvailable);
                } catch (error) {
                    console.error("Error checking username availability:", error);
                    setUserAvailable(null);
                    // toast.error("Error checking username availability", {
                    //     position: "top-right",
                    //     style: { background: "#ef4444", color: "#fff" }
                    // });
                }
            }
        }, 1000);
        return () => clearTimeout(i);
    }, [userName]);

    const handleChangeUserName = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const response = await fetch("/api/setusername", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username: userName }),
        });
        const data = await response.json();
        if (response.status === 200) {
            toast.success("Username set successfully!", {
                position: "top-right",
                style: { background: "#22c55e", color: "#fff" }
            });
            if (setRefresh) setRefresh(!refresh)
            setUserName("");
        } else {
            toast.error(data.error || "Failed to set username", {
                position: "top-right",
                style: { background: "#ef4444", color: "#fff" }
            });
        }
    }
    return (
        <div>
            <Dialog>
                <DialogTrigger>Add Username</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Set your username</DialogTitle>
                        <DialogDescription>
                            Please enter your desired username below.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleChangeUserName} className="flex flex-col gap-4 mt-4">
                        <label htmlFor="username" className="text-sm font-medium">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                            className="border rounded px-3 py-2 focus:outline-none focus:ring"
                            placeholder="Enter username"
                        />
                        {
                            userAvailable === null ? (
                                <p className="text-gray-500 text-md">Checking availability...</p>
                            ) : userAvailable ? (
                                <p className="text-green-500 text-md">Username is available!</p>
                            ) : (
                                <p className="text-red-500 text-md">Username is already taken.</p>
                            )
                        }
                        <button
                            type="submit"
                            disabled={!userAvailable || userName.length < 3}
                            className="bg-blue-600 text-white rounded px-4 py-2 mt-2 hover:bg-blue-700"
                        >
                            Save
                        </button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default SetUserName