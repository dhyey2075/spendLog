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
import { Plus } from 'lucide-react';

interface ISuggestedUser {
    _id: string;
    username: string;
}

const AddFriend = () => {
    const [query, setQuery] = React.useState<string>("");
    const [suggestions, setSuggestions] = React.useState<ISuggestedUser[]>([]);
    const getSuggestions = async (query: string): Promise<ISuggestedUser[]> => {
        try {
            const response = await fetch(`/api/suggest-friends?query=${query}`);
            if (!response.ok) {
                throw new Error("Failed to fetch suggestions");
            }
            const data = await response.json();
            return data.suggestions || [];
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            return [];
        }
    }
    useEffect(() => {
        const i = setTimeout(async () => {
            console.log("Here")
            if (query.trim().length >= 3) {
                const suggestions = await getSuggestions(query);
                console.log(suggestions, "suggestions");
                setSuggestions(suggestions);
                if (suggestions.length === 0) {
                    console.warn("No suggestions found for the query:", query);
                }
            }
        }, 1000);
        return () => clearTimeout(i);
    }, [query]);
    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <div className='bg-blue-500 text-sm px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer'>
                        <div className='flex items-center gap-2'>
                            <span>Friend</span> <Plus size={15} />
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a Friend</DialogTitle>
                        <DialogDescription>
                            Enter your friend&#39;s username to add it to your friend list.
                        </DialogDescription>
                    </DialogHeader>
                    <form action="POST">
                        <div className="">
                            <label className="block text-gray-700">Friend&#39;s Username</label>
                            <input
                                type="text"
                                placeholder="Enter friend's username"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="border rounded px-3 py-2 focus:outline-none focus:ring w-full"
                                required
                            />
                        </div>
                        
                    </form>
                    {query.trim() === "" ? "Type to get suggestions..." : suggestions.length > 0 ? ( (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">Suggestions</h3>
                            <ul className="list-disc pl-5">
                                {suggestions.map((user) => (
                                    <li key={user._id} className="mt-2">
                                        <span className="font-medium">{user.username}</span>
                                        <button
                                            className="ml-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            onClick={async() => {
                                                console.log(`Friend request sent to ${user.username}`);
                                                const response = await fetch('/api/add-friend', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify({ id: user._id.toString(), username: user.username }),
                                                })
                                                if (response.status === 200) {
                                                    toast.success(`@${user.username} added to your friends.`, {
                                                        position: "top-right",
                                                        style: { background: "#22c55e", color: "#fff" }
                                                    })
                                                } else {
                                                    const data = await response.json();
                                                    console.error("Error adding friend: ", data.error || "Unknown error");
                                                    toast.error(`Error adding friend: ${data.error || "Unknown error"}`, {
                                                        position: "top-right",
                                                        style: { background: "#ef4444", color: "#fff" }
                                                    });
                                                }
                                            }}
                                        >
                                            Add
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )) : (
                        <div className="mt-4 text-gray-500">
                            No suggestions found. Try a different username.
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddFriend