"use client";
import React, { useEffect } from "react";
import { Chatbot } from "../../types/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import Avatar from "./Avatar";
import Link from "next/link";
import ReactTimeago from "react-timeago";

function ChatbotSessions({ chatbots }: { chatbots: Chatbot[] }) {
  const [sortedChatbots, setSortedChatbots] =
    React.useState<Chatbot[]>(chatbots);

  useEffect(() => {
    const sortedArray = [...chatbots].sort(
      (a, b) => b.chat_sessions.length - a.chat_sessions.length
    );

    setSortedChatbots(sortedArray);
  }, [chatbots]);

  return (
    <div className="bg-white">
      <Accordion type="single" collapsible>
        {sortedChatbots.map((chatbot) => {
          const hasSessions = chatbot.chat_sessions.length > 0;

          return (
            <AccordionItem
              key={chatbot.id}
              value={`item-${chatbot.id}`}
              className="px-10 py-5"
            >
              {hasSessions ? (
                <>
                  <AccordionTrigger>
                    <div className="flex items-center text-left w-full">
                      <Avatar
                        seed={chatbot.name}
                        className="h-16 w-16 md:h-24 md:w-24 mr-4"
                      />
                      <div className="flex flex-1  justify-between space-x-4">
                        <p>{chatbot.name}</p>
                        <p className=" pr-4 font-bold text-right">
                          {chatbot.chat_sessions.length}{" "}
                          <span className="hidden md:inline">sessions</span>
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="space-y-5 p-5 bg-gray-100">
                    {chatbot.chat_sessions.map((session) => (
                      <Link
                        key={session.id}
                        href={`/view-sessions/${session.id}`}
                        className="relative p-10 bg-primary text-white block"
                      >
                        <p className="text-lg font-bold">
                          {session.guests?.name || "Anonymous"}
                        </p>
                        <p className="text-sm font-light">
                          {session.guests?.email || "No email provided"}
                        </p>
                        <p className="absolute top-5 right-5 text-xs text-white">
                          <ReactTimeago date={new Date(session.created_at)} />
                        </p>
                      </Link>
                    ))}
                  </AccordionContent>
                </>
              ) : (
                <p className="text-gray-500">No chat sessions yet</p>
              )}
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

export default ChatbotSessions;
