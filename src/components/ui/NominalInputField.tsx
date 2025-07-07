
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { formatNumberInput, cleanNumberInput } from "@/utils/formatters";

interface NominalInputFieldProps {
  id?: string;
  value: number | string;
  onValueChange: (numberValue: number) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function NominalInputField({
  id,
  value,
  onValueChange,
  placeholder = "Contoh: 1.000.000",
  required,
  disabled,
  className
}: NominalInputFieldProps) {
  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    if (value !== undefined && value !== null && value !== "") {
      setDisplayValue(formatNumberInput(value));
    } else {
      setDisplayValue("");
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = cleanNumberInput(inputValue);

    // Format with thousand separators
    const formatted = formatNumberInput(numericValue);
    setDisplayValue(formatted);
    
    // Return the numeric value for form state
    onValueChange(numericValue);
  };

  return (
    <Input
      id={id}
      value={displayValue}
      onChange={handleChange}
      inputMode="numeric"
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      autoComplete="off"
      className={className}
    />
  );
}
