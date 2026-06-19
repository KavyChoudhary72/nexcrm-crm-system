import React from "react";
import { getInitials } from "../../utils/helpers";

interface UserAvatarProps {
  name?: string;
  avatar?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = "System User",
  avatar = "",
  size = "md",
  className = "",
}) => {
  const initials = getInitials(name);

  const sizeClasses = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs font-semibold",
    md: "w-10 h-10 text-sm font-bold",
    lg: "w-14 h-14 text-lg font-bold",
  };

  const isImage = avatar && (avatar.startsWith("data:image/") || avatar.startsWith("http://") || avatar.startsWith("https://") || avatar.startsWith("/"));

  return (
    <div
      className={`rounded-full bg-gradient-to-tr from-violet-600 to-purple-500 text-white flex items-center justify-center shadow-sm shrink-0 uppercase tracking-wider overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      {isImage ? (
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
};
