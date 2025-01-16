import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { BsCloudHaze2 } from "react-icons/bs";

function Header() {
  return (
    <header className="bg-white shadow-sm text-gray-800 flex justify-between p-5">
      {/* logo */}
      <Link href="/" className="flex items-center font-thin space-x-2">
        <BsCloudHaze2 size={48} className="text-primary" />

        <div className="-space-y-1">
          <h1 className="text-3xl">Alsemble</h1>
          <h2 className="text-xs">for seamless interactions...</h2>
        </div>
      </Link>

      {/* Auth */}
      <div className="flex items-center">
        <SignedIn>
          <UserButton showName />
        </SignedIn>

        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
