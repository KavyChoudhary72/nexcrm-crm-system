import React from "react";
import { Input } from "./Input";
import { Calendar } from "lucide-react";

interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="datetime-local"
        label={label}
        error={error}
        icon={<Calendar className="w-4 h-4 text-gray-400" />}
        className={className}
        {...props}
      />
    );
  }
);

DatePicker.displayName = "DatePicker";
