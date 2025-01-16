import client from "../../graphql/apolloClient";
import {
  INSERT_CHAT_SESSION,
  INSERT_GUEST,
  INSERT_MESSAGE,
} from "../../graphql/mutations/mutations";

// async function startNewChat(
//   guestName: string,
//   guestEmail: string,
//   chatbotId: number
// ) {
//   if (!chatbotId || isNaN(chatbotId)) {
//     throw new Error("Invalid chatbotId provided to startNewChat");
//   }

//   // datetime
//   const created_at = new Date().toISOString();
//   try {
//     // Create a new guest entry
//     const guestResult = await client.mutate({
//       mutation: INSERT_GUEST,
//       variables: { name: guestName, email: guestEmail, created_at },
//     });
//     console.log("Guest Result:", guestResult);

//     const guestId = guestResult.data.insertGuests.id;

//     // Initialize a new chat session
//     const chatSessionResult = await client.mutate({
//       mutation: INSERT_CHAT_SESSION,
//       variables: {
//         chatbot_id: chatbotId,
//         guest_id: guestId,
//         created_at,
//       },
//     });
//     console.log("Chat Session Result:", chatSessionResult);
//     const chatSessionId = chatSessionResult.data.insertChatSessions.id;

//     // Insert initial message (optional)
//     await client.mutate({
//       mutation: INSERT_MESSAGE,
//       variables: {
//         chat_session_id: chatSessionId,
//         content: `Welcome to the chat ${guestName}!\n How can I help you today?`,
//         sender: "ai",
//       },
//     });

//     console.log("New Chat Started");
//     return chatSessionId;
//   } catch (error) {
//     console.error("Error starting New Chat", error);
//   }
// }
async function startNewChat(
  guestName: string,
  guestEmail: string,
  chatbotId: number
) {
  if (!chatbotId || isNaN(chatbotId)) {
    throw new Error("Invalid chatbotId provided to startNewChat");
  }

  const created_at = new Date().toISOString();
  try {
    // Create a new guest entry
    const guestResult = await client.mutate({
      mutation: INSERT_GUEST,
      variables: { name: guestName, email: guestEmail, created_at },
    });

    if (!guestResult?.data?.insertGuests?.id) {
      throw new Error("Failed to insert guest");
    }

    const guestId = guestResult.data.insertGuests.id;

    // Initialize a new chat session
    const chatSessionResult = await client.mutate({
      mutation: INSERT_CHAT_SESSION,
      variables: { chatbot_id: chatbotId, guest_id: guestId, created_at },
    });

    if (!chatSessionResult?.data?.insertChat_sessions?.id) {
      throw new Error("Failed to create chat session");
    }

    const chatSessionId = chatSessionResult.data.insertChat_sessions.id;

    // Insert initial message (optional)
    await client.mutate({
      mutation: INSERT_MESSAGE,
      variables: {
        chat_session_id: chatSessionId,
        content: `Welcome to the chat ${guestName}!\n How can I help you today?`,
        sender: "ai",
        created_at,
      },
    });

    console.log("New Chat Started");
    return chatSessionId;
  } catch (error) {
    console.error("Error starting New Chat", error);
    throw error; // Rethrow the error for the calling function to handle
  }
}

export default startNewChat;
