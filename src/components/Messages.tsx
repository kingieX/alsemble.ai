/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useRef } from "react";
import { Message } from "../../types/types";
import { usePathname } from "next/navigation";
import Avatar from "./Avatar";
import { UserCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function Messages({
  messages,
  chatbotName,
}: {
  messages: Message[];
  chatbotName: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const path = usePathname();

  const isReviewsPage = path.includes("view-sessions");

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto md:space-y-10 space-y-5 md:py-10 py-5 px-5 bg-white rounded-lg">
      {messages.map((message) => {
        const isSender = message.sender !== "user";

        return (
          <div
            key={message.id}
            className={`chat ${isSender ? "chat-start" : "chat-end"} relative`}
          >
            {isReviewsPage && (
              <p className="absolute -bottom-5 text-xs text-gray-300">
                sent {new Date(message.created_at).toLocaleString()}
              </p>
            )}

            <div className={`chat-image avatar w-10 ${!isSender && "-mr-4"}`}>
              {isSender ? (
                <Avatar
                  seed={chatbotName}
                  className="h-8 w-8 bg-white rounded-full border-2"
                />
              ) : (
                <UserCircle className="text-[#39ee29]" />
              )}
            </div>

            <p
              className={`chat-bubble text-white md:text-lg text-sm ${
                isSender
                  ? "chat-bubble-primary bg-primary"
                  : "chat-bubble-secondary bg-gray-300"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                className={"break-words"}
                components={{
                  ul: ({ node, ...props }) => (
                    <ul
                      className="list-disc list-inside ml-5 mb-5"
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      className="list-decimal list-inside ml-5 mb-5"
                      {...props}
                    />
                  ),

                  h1: ({ node, ...props }) => (
                    <h1
                      className="text-2xl font-bold break-words mb-5"
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      className="text-xl font-bold break-words mb-5"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      className="text-lg font-bold break-words mb-5"
                      {...props}
                    />
                  ),

                  table: ({ node, ...props }) => (
                    <table
                      className="table-auto w-full border-separate border-2 rounded-sm border-spacing-4 border-white mb-5"
                      {...props}
                    />
                  ),
                  th: ({ node, ...props }) => (
                    <th className="text-left underline" {...props} />
                  ),

                  p: ({ node, ...props }) => (
                    <p
                      className={`whitespace-break-spaces mb-5 ${
                        message.content === "Thinking..." && "animate-pulse"
                      } ${isSender ? "text-white" : "text-gray-700"}`}
                      {...props}
                    />
                  ),

                  a: ({ node, ...props }) => (
                    <a
                      className="font-bold hover:text-blue-500 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      {...props}
                    />
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </p>
          </div>
        );
      })}

      <div ref={ref}></div>
    </div>
  );
}

export default Messages;
