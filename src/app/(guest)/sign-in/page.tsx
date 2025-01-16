import { SignIn } from "@clerk/nextjs";
import React from "react";
import { BsCloudHaze2 } from "react-icons/bs";

function SignInPage() {
  return (
    <div className="flex py-10 md:py-0 flex-col flex-1 justify-center items-center bg-primary">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Logo Info */}
        <div className="flex flex-col items-center justify-center space-y-5 text-white">
          <div className="p-5">
            <div className="text-center">
              <div className="flex flex-col justify-center items-center space-x-2">
                <BsCloudHaze2 size={128} className="text-white" />
                <div className="flex flex-col items-center -space-y-1">
                  <h1 className="text-5xl">Alsemble</h1>
                  <h2 className="text-base font-light">
                    for seamless interactions...
                  </h2>
                </div>
              </div>
              <h3 className="my-5 font-bold">Sign in to get started</h3>
            </div>
          </div>
        </div>

        <SignIn routing="hash" fallbackRedirectUrl="/" />
      </div>
    </div>
  );
}

export default SignInPage;
