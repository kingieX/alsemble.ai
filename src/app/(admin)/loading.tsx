import { LoaderPinwheel } from "lucide-react";
import React from "react";

function Loading() {
  return (
    <div className="mx-auto animate-spin p-20">
      <LoaderPinwheel size={48} className="text-primary" />
    </div>
  );
}

export default Loading;
