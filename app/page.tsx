import Image from "next/image";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold">Welcome to Split Log here</h1>
      <p className="mt-4">This is a simple Next.js application with Clerk authentication.</p>

      <SignedOut>
        <div className="mt-6">
            <SignInButton
            mode="modal"
            forceRedirectUrl="/dashboard"
            >
            Sign In
            </SignInButton>
          <SignUpButton mode="modal">
            Sign Up
          </SignUpButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="mt-6">
          <UserButton />
        </div>
      </SignedIn>   
    </div>
  );
}
