
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatNumberInput, cleanNumberInput } from "@/utils/formatters";

interface NumberInputProps {
  id: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  helpText?: string;
  disabled?: boolean;
}

export function NumberInput({ 
  id, 
  value, 
  onChange, 
  label, 
  placeholder = "Contoh: 500.000", 
  required = false,
  className = "",
  helpText = "Masukkan jumlah tanpa titik atau koma, pemisah ribuan akan otomatis ditampilkan",
  disabled = false
}: NumberInputProps) {
  const [formattedValue, setFormattedValue] = useState<string>("");
  
  // Initialize formatted value when component loads or value changes from outside
  useEffect(() => {
    if (value !== undefined && value !== null && value !== "") {
      setFormattedValue(formatNumberInput(value));
    } else {
      setFormattedValue("");
    }
  }, [value]);
  
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Format the value with thousand separators
    const formatted = inputValue === "" ? "" : formatNumberInput(inputValue);
    setFormattedValue(formatted);
    
    // Create a synthetic event with the cleaned numeric value
    const numericAmount = cleanNumberInput(formatted);
    const syntheticEvent = {
      ...e,
      target: { ...e.target, id: id, value: String(numericAmount) }
    } as React.ChangeEvent<HTMLInputElement>;
    
    onChange(syntheticEvent);
  };

  return (
    <div className={className}>
      {label && <Label htmlFor={id} className={required ? "required" : ""}>{label}</Label>}
      <Input 
        id={id} 
        placeholder={placeholder} 
        value={formattedValue}
        onChange={handleValueChange}
        required={required}
        disabled={disabled}
        inputMode="numeric"
        autoComplete="off"
      />
      {helpText && (
        <p className="text-xs text-muted-foreground mt-1">
          {helpText}
        </p>
      )}
    </div>
  );
}
