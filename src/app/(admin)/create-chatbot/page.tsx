"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@apollo/client";
import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { CREATE_CHATBOT } from "../../../../graphql/mutations/mutations";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function CreateChatbot() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const router = useRouter();

  const [createChatbot, { loading, error }] = useMutation(CREATE_CHATBOT);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      console.error("User is not authenticated");
      return;
    }

    const currentTimestamp = new Date().toISOString(); // Generate current timestamp

    try {
      const { data } = await createChatbot({
        variables: {
          clerk_user_id: user.id,
          name,
          created_at: currentTimestamp, // Pass created_at
        },
      });

      // console.log("Chatbot Creation Data:", data);

      if (data?.insertChatbots?.id) {
        router.push(`/edit-chatbot/${data.insertChatbots.id}`);
      } else {
        console.error("Chatbot ID missing in response");
      }
    } catch (err) {
      console.error("Error creating chatbot:", err);
    } finally {
      setName("");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center bg-white m-10 p-10 rounded-md gap-5">
      <TbMessageChatbotFilled className="text-primary w-32 h-32 md:w-164 md:h-164 md:inline hidden" />
      <Image
        src="/assets/create.svg"
        width={100}
        height={100}
        alt="Create"
        className="md:w-1/2 w-full inline md:hidden"
      />
      <div>
        <h1 className="text-xl lg:text-3xl font-semibold">Create</h1>
        <h2 className="md:font-light font-extralight">
          Customize your AI chatbot to enhance customer conversations with
          tailored interactions.
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row md:gap-2 gap-4 mt-5"
        >
          <Input
            placeholder="Chatbot name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            className="max-w-lg focus:border-primary placeholder:text-gray-500"
            required
          />
          <Button
            type="submit"
            disabled={loading || !name}
            className="hover:bg-primary/60"
          >
            {loading ? "Creating Chatbot..." : "Create Chatbot"}
          </Button>
        </form>

        {error && <p className="text-red-500 mt-2">Error: {error.message}</p>}

        <p className="text-gray-300 mt-5">Example: Customer Support Chatbot</p>
      </div>
    </div>
  );
}

export default CreateChatbot;
