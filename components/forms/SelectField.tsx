import React from "react";
import { Label } from "../ui/label";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const baseInputClasses =
  "h-12 w-full rounded-lg bg-[#111] border border-gray-700 text-gray-100 placeholder-gray-500 px-3 shadow-[0_0_10px_rgba(255,255,0,0.15)] focus:ring-2 focus:ring-yellow-400 focus:border-yellow-500 transition-all duration-200";

const SelectField = ({
  name,
  label,
  placeholder,
  options,
  control,
  error,
  required = false,
}: SelectFieldProps) => {
  return (
    <div className="space-y-1 animate-fadeIn">
      <Label htmlFor={name} className="text-sm font-medium text-gray-200">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <div className="space-y-1">
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className={baseInputClasses}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>

              <SelectContent className="bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-lg">
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="cursor-pointer text-gray-200 hover:bg-yellow-500 hover:text-black transition-all"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {error && (
              <p className="text-sm text-red-400 font-medium animate-pulse">
                {error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default SelectField;
