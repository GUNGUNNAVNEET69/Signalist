import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const baseInputClasses =
  "h-12 w-full rounded-lg bg-[#111] border border-gray-700 text-gray-100 placeholder-gray-500 px-3 shadow-[0_0_10px_rgba(255,255,0,0.15)] focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 transition-all duration-200";

const InputField = ({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  validation,
  disabled,
  value,
}: FormInputProps) => {
  function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
  }

  return (
    <div className="space-y-1 animate-fadeIn">
      <Label htmlFor={name} className="text-sm font-medium text-gray-200">
        {label}
      </Label>

      <Input
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        className={cn(baseInputClasses, {
          "opacity-50 cursor-not-allowed": disabled,
        })}
        {...register(name, validation)}
      />

      {error && (
        <p className="text-sm text-red-400 mt-1 font-medium animate-pulse">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default InputField;
