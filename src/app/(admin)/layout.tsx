import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Header */}
      <Header />

      <div className="flex flex-col md:flex-row bg-gray-100 flex-1">
        {/* Sidebar */}
        <SideBar />
        <div className="flex flex-1 text-gray-900 justify-center lg:justify-start items-start max-w-5xl w-full mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
