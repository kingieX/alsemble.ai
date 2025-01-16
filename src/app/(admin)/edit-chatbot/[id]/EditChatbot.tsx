"use client";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import React, { useEffect } from "react";
import { BASE_URL } from "../../../../../graphql/apolloClient";
import { Button } from "@/components/ui/button";
import { CopyIcon, LoaderPinwheel } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CHATBOT_BY_ID } from "../../../../../graphql/queries/queries";
import {
  GetChatbotByIdResponse,
  GetChatbotByIdVariables,
} from "../../../../../types/types";
import Avatar from "@/components/Avatar";
import Characteristic from "@/components/Characteristic";
import {
  ADD_CHARACTERISTIC,
  DELETE_CHATBOT,
  UPDATE_CHATBOT,
} from "../../../../../graphql/mutations/mutations";
import { redirect, useRouter } from "next/navigation";

function EditChatbot({ id }: { id: string }) {
  // console.log("id", id);
  const router = useRouter();

  const [url, setUrl] = React.useState<string>("");
  const [chatbotName, setChatbotName] = React.useState<string>("");
  const [newCharacteristic, setNewCharacteristic] = React.useState<string>("");

  //   delete chatbot mutation
  const [deleteChatbot] = useMutation(DELETE_CHATBOT, {
    refetchQueries: ["GetChatbotById"],
    awaitRefetchQueries: true,
  });

  //   update chatbot mutation
  const [updateChatbot] = useMutation(UPDATE_CHATBOT, {
    refetchQueries: ["GetChatbotById"],
  });

  //   add characteristic mutation
  const [addCharacteristic] = useMutation(ADD_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  });

  const { data, loading, error } = useQuery<
    GetChatbotByIdResponse,
    GetChatbotByIdVariables
  >(GET_CHATBOT_BY_ID, {
    variables: { id },
  });

  useEffect(() => {
    if (data) {
      setChatbotName(data.chatbots.name);
    }
  }, [data]);

  useEffect(() => {
    const url = `${BASE_URL}/chatbot/${id}`;

    setUrl(url);
  }, [id]);

  // add characteristic function
  const currentTimestamp = new Date().toISOString(); // Generate current timestamp

  const handleAddCharacteristic = async (content: string) => {
    try {
      const promise = addCharacteristic({
        variables: {
          chatbotId: Number(id),
          content,
          created_at: currentTimestamp, // Pass created_at
        },
      });

      toast.promise(promise, {
        loading: "Adding characteristic...",
        success: "Characteristic added!",
        error: "Error adding characteristic",
      });
    } catch (err) {
      console.error("Error adding characteristic:", err);
    }
  };

  // delete chatbot function
  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this chatbot?"
    );
    if (!isConfirmed) return;

    const promise = deleteChatbot({ variables: { id } });

    toast.promise(promise, {
      loading: "Deleting chatbot...",
      success: "Chatbot deleted!",
      error: "Error deleting chatbot",
    });

    promise
      .then((result) => {
        if (result?.data) {
          router.push("/view-chatbots"); // Navigate to the chatbots list
        }
      })
      .catch((err) => {
        console.error("Error deleting chatbot:", err);
      });
  };

  // update chatbot function
  const handleUpdateChatbot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const promise = updateChatbot({
        variables: {
          id,
          name: chatbotName,
          created_at: currentTimestamp, // Pass created_at
        },
      });

      toast.promise(promise, {
        loading: "Updating chatbot...",
        success: "Chatbot updated!",
        error: "Error updating chatbot",
      });
    } catch (err) {
      console.error("Error updating chatbot:", err);
    }
  };

  if (loading)
    return (
      <div className="mx-auto animate-spin p-10">
        <LoaderPinwheel size={32} className="text-primary" />
      </div>
    );

  if (error) {
    return (
      <div className="p-10 text-center">
        <p>Error: {error.message}</p>
      </div>
    );
  }

  if (!data?.chatbots) return redirect("/view-chatbots");

  return (
    <div className="px-0 md:p-10 mx-5">
      <div className="md:sticky md:top-0 z-50 ml-auto sm:max-w-sm space-y-2 md:border p-5 rounded-b-lg md:rounded-b-lg bg-primary">
        <h2 className="text-white text-sm font-bold">Link to Chat</h2>
        <p className="text-sm italic text-white">
          Share this link with your customers to start a conversation with your
          chatbot.
        </p>
        {/* custom link */}
        <div className="flex items-center space-x-2">
          <Link href={url} className="w-full cursor-pointer hover:opacity-50">
            <Input
              value={url}
              className="cursor-pointer border-gray-400"
              readOnly
            />
          </Link>
          <Button
            size="sm"
            className="px-3 bg-black hover:bg-gray-800"
            onClick={() => {
              navigator.clipboard.writeText(url);
              toast.success("Link copied to clipboard!");
            }}
          >
            <span className="sr-only">Copy</span>
            <CopyIcon className="text-white w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* section */}
      <section className="relative bg-white p-5 mt-5 md:p-10 rounded-lg shadow-md">
        <Button
          className="absolute bg-red-700 text-white top-2 right-2 h-8 w-2"
          onClick={() => handleDelete(id)}
        >
          X
        </Button>

        <div className="flex space-x-4 mt-4 md:mt-0">
          <Avatar
            seed={chatbotName}
            className="w-16 h-16 md:w-24 md:h-24"
            style="identicon"
            backgroundColor="#f0f0f0"
          />

          <form
            onSubmit={handleUpdateChatbot}
            className="flex flex-1 space-x-2 items-center"
          >
            <Input
              value={chatbotName}
              onChange={(e) => setChatbotName(e.target.value)}
              placeholder={chatbotName}
              className="w-full border-transparent bg-transparent md:text-xl font-bold focus:border-primary focus:border"
              required
            />
            <Button type="submit" disabled={!chatbotName}>
              Update
            </Button>
          </form>
        </div>

        <h2 className="text-xl font-bold mt-10">
          Here is what your AI knows...
        </h2>
        <p className="text-gray-500 md:text-lg text-sm">
          Your chatbot is equipped with the following instructions to assist you
          in your conversation with your customers and users.
        </p>

        {/* Characteristics of chatbot */}
        <div className="bg-gray-200 p-5 mt-5 rounded-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAddCharacteristic(newCharacteristic);
              setNewCharacteristic("");
            }}
            className="flex space-x-2 mb-5"
          >
            <Input
              type="text"
              placeholder="Add a characteristic"
              value={newCharacteristic}
              onChange={(e) => setNewCharacteristic(e.target.value)}
            />
            <Button type="submit" disabled={!newCharacteristic}>
              Add
            </Button>
          </form>

          <ul className="flex flex-wrap-reverse gap-2">
            {data?.chatbots.chatbot_characteristics.map((characteristic) => (
              <Characteristic
                key={characteristic.id}
                characteristic={characteristic}
              />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default EditChatbot;
