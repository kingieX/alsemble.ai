import { serverClient } from "@/lib/server/serverClient";
import { NextResponse } from "next/server";
import { OpenAI } from "openai"; // Import the OpenAI client from Hugging Face
import {
  GetChatbotByIdResponse,
  MessagesByChatSessionIdResponse,
} from "../../../../types/types";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "../../../../graphql/queries/queries";
import { INSERT_MESSAGE } from "../../../../graphql/mutations/mutations";

// Initialize the Hugging Face API client with your API key and base URL
const client = new OpenAI({
  baseURL: "https://api-inference.huggingface.co/v1/", // Hugging Face API base URL
  apiKey: process.env.HUGGING_FACE_API_KEY, // Ensure your Hugging Face API key is set in the .env file
});

export async function POST(req: NextResponse) {
  const { chat_session_id, chatbot_id, content, name } = await req.json();

  // console.log(
  //   `Received message from ${chat_session_id}: ${content} (chatbot: ${chatbot_id})`
  // );

  try {
    // Fetch chatbot characteristics
    const { data } = await serverClient.query<GetChatbotByIdResponse>({
      query: GET_CHATBOT_BY_ID,
      variables: { id: chatbot_id },
    });
    const chatbot = data.chatbots;

    if (!chatbot) {
      console.error("Failed to fetch chatbot");
      return NextResponse.json(
        { error: "Failed to fetch chatbot, chatbot not found!" },
        { status: 500 }
      );
    }

    // Fetch previous messages
    const { data: messagesData } =
      await serverClient.query<MessagesByChatSessionIdResponse>({
        query: GET_MESSAGES_BY_CHAT_SESSION_ID,
        variables: { chat_session_id },
        fetchPolicy: "no-cache",
      });

    const previousMessages = messagesData.chat_sessions.messages;

    // Format previous messages into a structure Hugging Face API expects (role + content)
    const formattedMessages = previousMessages.map((message) => ({
      role: message.sender === "ai" ? "assistant" : "user",
      content: message.content,
    }));

    // Combine chatbot characteristics into a system prompt
    const systemPrompt = chatbot.chatbot_characteristics
      .map((characteristic) => characteristic.content)
      .join(" + ");

    // console.log("System prompt:", systemPrompt);

    // Prepare the first user message with the system prompt
    const initialUserMessage = {
      role: "user",
      content: `You are a helpful assistant talking to ${name}. Here is some key information you need to know: ${systemPrompt}.`,
    };

    // Add the current user message
    const userInputMessage = {
      role: "user",
      content: content,
    };

    // Combine all messages, ensuring alternation between user and assistant roles
    const alternatingMessages = [
      initialUserMessage,
      ...formattedMessages,
      userInputMessage,
    ];

    // Ensure roles strictly alternate
    const finalMessages = [];
    let lastRole = null;
    for (const message of alternatingMessages) {
      if (message.role !== lastRole) {
        finalMessages.push(message);
        lastRole = message.role;
      }
    }

    // console.log("Final alternating messages: ", finalMessages);

    // Call Hugging Face API with the selected model
    const chatCompletion = await client.chat.completions.create({
      model: "mistralai/Mistral-Nemo-Instruct-2407",
      messages: finalMessages,
      max_tokens: 500, // Adjust as needed
    });

    const aiResponse = chatCompletion.choices[0].message.content.trim();
    // console.log("Ai Response: ", aiResponse);

    if (!aiResponse) {
      console.error("Failed to generate AI response");
      return NextResponse.json(
        { error: "Failed to generate AI response" },
        { status: 500 }
      );
    }

    // Save the user's message to the database
    await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: { chat_session_id, content, sender: "user" },
    });

    const created_at = new Date().toISOString();
    // Save the AI's response to the database
    const aiMessageResult = await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id,
        content: aiResponse,
        sender: "ai",
        created_at,
      },
    });
    // console.log("aiMessageResult: ", aiMessageResult);

    // Return the AI response back to the user in the chat
    return NextResponse.json({
      id: aiMessageResult.data.insertMessages.id,
      content: aiResponse,
      // created_at,
    });
  } catch (error) {
    console.error("Error sending message: ", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}
