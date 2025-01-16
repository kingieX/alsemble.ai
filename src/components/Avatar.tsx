"use client";

import React from "react";
import * as Avatars from "@dicebear/avatars";
import * as IdenticonSprites from "@dicebear/avatars-identicon-sprites";

type AvatarProps = {
  seed: string; // Unique seed for the avatar
  size?: number; // Size of the avatar
  style?: "identicon" | "initials" | "bottts"; // Custom style
  backgroundColor?: string; // Optional background color
  className?: string; // Optional custom class name
};

const Avatar: React.FC<AvatarProps> = ({
  seed,
  // size = 100,
  style = "identicon",
  backgroundColor = "transparent",
  className = "",
}) => {
  let avatarGenerator;

  switch (style) {
    case "initials":
      // Import and use another DiceBear sprite if needed
      avatarGenerator = new Avatars.default(IdenticonSprites.default, {});
      break;
    default:
      avatarGenerator = new Avatars.default(IdenticonSprites.default, {});
  }

  const svg = avatarGenerator.create(seed);

  return (
    <div
      style={{
        // width: size,
        // height: size,
        backgroundColor,
        borderRadius: "50%",
        overflow: "hidden",
      }}
      className={` rounded-full overflow-hidden ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
};

export default Avatar;
