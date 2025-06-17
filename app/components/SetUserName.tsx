import React from 'react'
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
                <DialogTrigger>Open</DialogTrigger>
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
                        <button
                            type="submit"
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