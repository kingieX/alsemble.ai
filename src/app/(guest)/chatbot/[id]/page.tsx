import ChatbotPage from "./ChatbotPage";

export default function ParentPage({ params }: { params: { id: string } }) {
  return <ChatbotPage id={params.id} />;
}
