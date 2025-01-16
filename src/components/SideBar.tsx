import React from "react";
import Link from "next/link";
import { BotMessageSquare, PencilLine, SearchIcon } from "lucide-react";

const menuItems = [
  {
    href: "/create-chatbot",
    icon: BotMessageSquare,
    title: "Create",
    description: "New Chatbot",
  },
  {
    href: "/view-chatbots",
    icon: PencilLine,
    title: "Edit",
    description: "Chatbots",
  },
  {
    href: "/view-sessions",
    icon: SearchIcon,
    title: "View",
    description: "Sessions",
  },
];

interface SidebarItemProps {
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  href,
  Icon,
  title,
  description,
}) => (
  <li className="flex-1">
    <Link
      href={href}
      className="flex flex-col text-center lg:text-left lg:flex-row items-center gap-2 p-5 rounded-md bg-primary hover:opacity-60"
    >
      <Icon className="w-6 h-6 lg:w-8 lg:h-8" />
      <div className="hidden md:inline">
        <p className="text-xl">{title}</p>
        <p className="text-sm font-light">{description}</p>
      </div>
    </Link>
  </li>
);

function SideBar() {
  return (
    <div className="bg-white text-white p-5">
      <ul className="flex flex-row lg:flex-col gap-5">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            Icon={item.icon}
            title={item.title}
            description={item.description}
          />
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
