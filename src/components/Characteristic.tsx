"use client";
import React from "react";
import { ChatbotCharacteristic } from "../../types/types";
import { OctagonX } from "lucide-react";
import { useMutation } from "@apollo/client";
import { REMOVE_CHARACTERISTIC } from "../../graphql/mutations/mutations";
import { toast } from "sonner";

function Characteristic({
  characteristic,
}: {
  characteristic: ChatbotCharacteristic;
}) {
  const [removeCharacteristic] = useMutation(REMOVE_CHARACTERISTIC, {
    refetchQueries: ["GetChatbotById"],
  });

  const handleRemoveCharacteristic = async (characteristicId: number) => {
    try {
      await removeCharacteristic({
        variables: {
          characteristicId,
        },
      });
    } catch (err) {
      console.error("Error removing characteristic:", err);
      toast.error("Error removing characteristic");
    }
  };
  return (
    <li key={characteristic.id} className="relative p-10 bg-white border ">
      {characteristic.content}
      <OctagonX
        className="w-6 h-6 text-white fill-red-500 absolute top-1 right-1 cursor-pointer hover:opacity-50"
        onClick={() => {
          const promise = handleRemoveCharacteristic(characteristic.id);
          toast.promise(promise, {
            loading: "Removing characteristic...",
            success: "Characteristic removed!",
            error: "Error removing characteristic",
          });
        }}
      />
    </li>
  );
}

export default Characteristic;
