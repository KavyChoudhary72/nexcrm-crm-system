import React from "react";
import { Mail } from "lucide-react";
import { Button } from "../UI/Button";

interface EmailButtonProps {
  email: string;
  name: string;
  requirement?: string;
}

export const EmailButton: React.FC<EmailButtonProps> = ({
  email,
  name,
  requirement,
}) => {
  const subject = encodeURIComponent(`CRM Lead Follow-up: Inquiry Details`);
  const body = encodeURIComponent(
    `Hello ${name},\n\nThank you for reaching out regarding your requirement: "${requirement || "inquiry"}".\n\nBest regards,\nSales Command Team`
  );
  const url = `mailto:${email}?subject=${subject}&body=${body}`;

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      onClick={() => window.open(url)}
      disabled={!email}
    >
      <Mail className="w-4 h-4 shrink-0" />
      <span>Email</span>
    </Button>
  );
};
