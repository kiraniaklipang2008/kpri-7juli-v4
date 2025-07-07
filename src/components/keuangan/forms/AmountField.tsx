
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatNumberInput, parseFormattedNumber } from '@/utils/formatters';
import { TransactionFormValues } from '../schema';

interface AmountFieldProps {
  control: Control<TransactionFormValues>;
  formattedJumlah: string;
  setFormattedJumlah: (value: string) => void;
}

export function AmountField({ control, formattedJumlah, setFormattedJumlah }: AmountFieldProps) {
  return (
    <FormField
      control={control}
      name="jumlah"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Jumlah (Rp)</FormLabel>
          <FormControl>
            <Input
              placeholder="0"
              value={formattedJumlah}
              onChange={(e) => {
                const formatted = formatNumberInput(parseFormattedNumber(e.target.value));
                setFormattedJumlah(formatted);
                field.onChange(parseFormattedNumber(e.target.value));
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
