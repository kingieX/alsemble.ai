/* eslint-disable react/no-unescaped-entities */
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BsChatDots, BsGear, BsLightning } from "react-icons/bs";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-10 bg-white shadow-lg rounded-md w-full max-w-4xl">
        {/* Header Section */}
        <header className="text-center mb-10">
          <h1 className="text-5xl font-light ">
            Welcome to{" "}
            <span className="text-primary font-semibold">Alsemble</span>
          </h1>
          <p className="text-lg text-gray-600 mt-4">
            Your ultimate platform for creating, customizing, and managing
            AI-powered chatbots.
          </p>
        </header>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="flex flex-col items-center text-center">
            <BsChatDots size={48} className="text-primary mb-4" />
            <h3 className="text-xl font-bold">Seamless Conversations</h3>
            <p className="text-gray-600">
              Build chatbots that engage users in meaningful, intelligent
              interactions.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <BsGear size={48} className="text-primary mb-4" />
            <h3 className="text-xl font-bold">Easy Customization</h3>
            <p className="text-gray-600">
              Customize your chatbot's personality, design, and functionality
              with ease.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <BsLightning size={48} className="text-primary mb-4" />
            <h3 className="text-xl font-bold">Lightning Fast Deployment</h3>
            <p className="text-gray-600">
              Launch your chatbot in minutes with our intuitive tools and
              templates.
            </p>
          </div>
        </section>

        {/* Call to Action Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ready to get started?
          </h2>
          <p className="text-gray-600 mb-6">
            Create your first chatbot now and unlock the power of seamless
            interactions.
          </p>
          <Link href="/create-chatbot">
            <Button className="bg-primary hover:bg-primary/50 text-white px-6 py-3 text-lg font-bold">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
