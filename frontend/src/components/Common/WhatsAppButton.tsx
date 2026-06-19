import React from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "../UI/Button";

interface WhatsAppButtonProps {
  mobileNumber: string;
  name: string;
  requirement?: string;
  userName?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  mobileNumber,
  name,
  requirement,
  userName = "Sales Representative",
}) => {
  const cleanPhone = mobileNumber.replace(/\D/g, "");
  const message = encodeURIComponent(
    `Hello ${name}, this is ${userName} regarding your request for "${requirement || "services"}". How can I assist you today?`
  );
  const url = `https://wa.me/${cleanPhone}?text=${message}`;

  return (
    <Button
      variant="outline"
      className="!border-emerald-250 dark:!border-emerald-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 gap-1.5 min-h-[48px]"
      onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
    >
      <MessageSquare className="w-4 h-4 shrink-0" />
      <span>WhatsApp</span>
    </Button>
  );
};
