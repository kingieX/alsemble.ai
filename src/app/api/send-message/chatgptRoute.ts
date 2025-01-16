import { serverClient } from "@/lib/server/serverClient";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import {
  GetChatbotByIdResponse,
  MessagesByChatSessionIdResponse,
} from "../../../../types/types";
import {
  GET_CHATBOT_BY_ID,
  GET_MESSAGES_BY_CHAT_SESSION_ID,
} from "../../../../graphql/queries/queries";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { INSERT_MESSAGE } from "../../../../graphql/mutations/mutations";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextResponse) {
  const { chat_session_id, chatbot_id, content, name } = await req.json();

  console.log(
    `Received message from ${chat_session_id}: ${content} (chatbot: ${chatbot_id})`
  );

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

    // fetch previous messages
    const { data: messagesData } =
      await serverClient.query<MessagesByChatSessionIdResponse>({
        query: GET_MESSAGES_BY_CHAT_SESSION_ID,
        variables: { chat_session_id },
        fetchPolicy: "no-cache",
      });

    const previousMessages = messagesData.chat_sessions.messages;

    // format the message to openai format
    const formattedPreviousMessages: ChatCompletionMessageParam[] =
      previousMessages.map((message) => ({
        role: message.sender === "ai" ? "system" : "user",
        name: message.sender === "ai" ? "system" : name,
        content: message.content,
      }));

    //   combine characteristics into a system prompt
    const systemPrompt = chatbot.chatbot_characteristics
      .map((characteristic) => characteristic.content)
      .join(" + ");

    console.log("system prompt:", systemPrompt);

    const messages: ChatCompletionMessageParam[] = [
      {
        role: "system",
        name: "system",
        content: `You are a helpful assistant talking to ${name}. If a generic question is asked which is not relevent or in the same scope or domain as the points in mentioned in the key information section, kindly inform the user they are allowed to search for  the specific content. Use Emoji's where possible and be very interactive. Here is some key information that you need to be aware of, these are elements you may be asked about: ${systemPrompt}.`,
      },
      ...formattedPreviousMessages,
      {
        role: "user",
        name: name,
        content: content,
      },
    ];

    // send the message to OpenAI's completions API.
    const openaiResonse = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-4o-mini",
    });

    const aiResponse = openaiResonse?.choices?.[0]?.message?.content?.trim();

    if (!aiResponse) {
      console.error("Failed to generate AI response");
      return NextResponse.json(
        { error: "Failed to generate AI response" },
        { status: 500 }
      );
    }

    // save the user's message to the database
    await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: { chat_session_id, content, sender: "user" },
    });

    // save the AI's response to the database
    const aiMessageResult = await serverClient.mutate({
      mutation: INSERT_MESSAGE,
      variables: { chat_session_id, content: aiResponse, sender: "ai" },
    });

    // return response back to the user in the chat
    return NextResponse.json({
      id: aiMessageResult.data.insertMessages.id,
      content: aiResponse,
    });
  } catch (error) {
    console.error("Error sending message: ", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
