/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GetChatbotByIdResponse,
  Message,
  MessagesByChatSessionIdResponse,
  MessagesByChatSessionIdVariables,
} from "../../../../../types/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import startNewChat from "@/lib/startNewChat";
import Avatar from "@/components/Avatar";
import { useQuery } from "@apollo/client";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "../../../../../graphql/queries/queries";
import Messages from "@/components/Messages";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BsCloudHaze2 } from "react-icons/bs";
import { LoaderPinwheel } from "lucide-react";

const formSchema = z.object({
  message: z.string().min(2, "Opps!, your message is too short!"),
});

function ChatbotPage({ id }: { id: string }) {
  //   console.log("ChatbotPage id", id);

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(true);
  const [chatId, setChatId] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);

  // unsplash setup
  const fetchRandomBackground = async () => {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?client_id=aeZVk1cLmWuP0ccHlU9xMyq9LqJjwWTCUiwfjYXwfps&orientation=landscape`
    );
    const data = await response.json();
    return data.urls.full;
  };

  const [randomBackground, setRandomBackground] = React.useState("");

  useEffect(() => {
    fetchRandomBackground().then(setRandomBackground);
  }, []);

  //   form validation for inputting message
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { data: chatBotData } = useQuery<GetChatbotByIdResponse>(
    GET_CHATBOT_BY_ID,
    {
      variables: { id },
    }
  );

  const {
    loading: loadingQuery,
    error: messagesError,
    data,
  } = useQuery<
    MessagesByChatSessionIdResponse,
    MessagesByChatSessionIdVariables
  >(GET_MESSAGES_BY_CHAT_SESSION_ID, {
    variables: { chat_session_id: chatId },
    skip: !chatId,
  });

  useEffect(() => {
    if (data) {
      setMessages(data.chat_sessions.messages);
    }
  }, [data]);

  const handleInformationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log("ID before calling startNewChat:", id);

    const chatId = await startNewChat(name, email, Number(id));
    console.log("Chat ID", chatId);

    setChatId(chatId);
    setIsOpen(false);
    setLoading(false);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const { message: formMessage } = values;

    const message = formMessage;
    form.reset();

    if (!name || !email) {
      setIsOpen(true);
      setLoading(false);
      return;
    }

    if (!message.trim()) {
      return; // Empty message won't be submitted
    }

    const userMessage: Message = {
      id: Date.now(),
      content: message,
      created_at: new Date().toISOString(),
      chat_session_id: chatId,
      sender: "user",
    };

    const loadingMessage: Message = {
      id: Date.now() + 1,
      content: "Thinking...",
      created_at: new Date().toISOString(),
      chat_session_id: chatId,
      sender: "ai",
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      loadingMessage,
    ]);

    try {
      const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          chat_session_id: chatId,
          chatbot_id: id,
          content: message,
        }),
      });
      const result = await response.json();
      console.log("Message sent successfully: ", result);

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.content === "Thinking..." && msg.sender === "ai"
            ? { ...msg, content: result.content, id: result.id }
            : msg
        )
      );
    } catch (error) {
      console.error("Error sending message: ", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="w-full flex bg-gray-100"
      style={{
        backgroundImage: `url(${randomBackground})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form className="md:px-8" onSubmit={handleInformationSubmit}>
            <DialogHeader>
              <DialogTitle>Let's help you out!</DialogTitle>
              <DialogDescription>
                I just need a few details from you to get started.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Adaobi"
                  className="col-span-3 placeholder:text-gray-500"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 mt-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adaobi@email.com"
                  className="col-span-3 placeholder:text-gray-500"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-primary text-white"
                disabled={!name || !email || loading}
              >
                {!loading ? "Start Chatting" : "Starting Chat..."}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col w-full max-w-3xl mx-auto bg-white md:rounded-t-lg shadow-2xl md:mt-10">
        <div className="pb-4 border-b sticky top-0 z-50 bg-primary py-5 px-10 text-white md:rounded-t-lg flex items-center space-x-4">
          <Avatar
            seed={chatBotData?.chatbots.name ?? "default-seed"}
            className="h-12 w-12 bg-white rounded-full border-2 border-white"
          />
          <div>
            <h1 className="truncate text-lg">{chatBotData?.chatbots.name}</h1>
            <p className="text-sm text-gray-300">Active </p>
          </div>
        </div>

        {/* intro */}
        <div className="flex flex-col gap-2 justify-center items-center py-3">
          <div className=" flex justify-center items-center">
            <div className="p-2 bg-primary rounded">
              <BsCloudHaze2 size={48} className="text-white" />
            </div>
          </div>
          <div className="max-w-sm">
            <h2 className="md:text-3xl text-lg text-gray-900 text-center font-bold">
              Hello, I am here to help you.
            </h2>
          </div>
        </div>

        {loadingQuery && (
          <div className="mx-auto animate-spin p-20">
            <LoaderPinwheel size={48} className="text-primary" />
          </div>
        )}
        {messagesError && (
          <p className="text-red-500">
            Error loading messages: {messagesError.message}
          </p>
        )}

        {!loadingQuery && !messagesError && (
          <Messages
            messages={messages}
            chatbotName={chatBotData?.chatbots.name ?? "Default Chatbot"}
          />
        )}

        {/* form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center sticky bottom-0 z-50 space-x-4 drop-shadow-lg p-4 bg-gray-100 rounded-md"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel hidden>Message</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Input a message..."
                      {...field}
                      className="p-6 text-gray-800 placeholder:text-gray-500 focus:border-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={form.formState.isSubmitting || !form.formState.isValid}
              type="submit"
              className="h-full text-white"
            >
              Send
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default ChatbotPage;
