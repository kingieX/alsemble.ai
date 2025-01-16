import EditChatbot from "./EditChatbot";

export default async function ParentComponent({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params; // Await the params to resolve
  return <EditChatbot id={id} />;
}
