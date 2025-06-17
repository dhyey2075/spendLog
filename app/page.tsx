import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { ArrowRightCircle, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white flex items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-8">
        <h1 className="text-5xl font-extrabold leading-tight">
          Welcome to <span className="text-blue-400">Split Log</span>
        </h1>
        <p className="text-lg text-gray-300">
          Easily manage and track your shared expenses with secure sign-in powered by Clerk.
        </p>

        <SignedOut>
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col space-y-4">
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold flex items-center justify-center gap-2">
                  <ArrowRightCircle className="w-5 h-5" />
                  Sign In
                </button>
              </SignInButton>

              <div className="text-gray-400">or</div>

              <SignUpButton mode="modal">
                <button className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 transition rounded-lg font-semibold flex items-center justify-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="flex flex-col items-center space-y-4">
            <p className="text-lg font-medium text-green-400">You&#39;re signed in!</p>
            <UserButton />
            <div className='bg-slate-800 rounded-2xl p-6 shadow-xl space-y-4 w-full max-w-md'>
              <Link href={"/dashboard"} >Go to Dashboard</Link>
            </div>
          </div>
        </SignedIn>
      </div>
    </div>
  );
}
