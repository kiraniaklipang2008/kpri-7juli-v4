
import { Label } from "@/components/ui/label";
import { JumlahInputProps } from "./types";
import { NominalInputField } from "@/components/ui/NominalInputField";

export function JumlahInput({ value, onChange }: JumlahInputProps) {
  const handleNominalChange = (numberValue: number) => {
    onChange(numberValue.toString(), numberValue.toLocaleString("id-ID"));
  };

  return (
    <div className="grid w-full gap-2">
      <Label htmlFor="jumlah" className="required">
        Jumlah Pinjaman (Rp)
      </Label>
      <NominalInputField
        id="jumlah"
        value={value}
        onValueChange={handleNominalChange}
        required
        placeholder="Contoh: 5.000.000"
      />
      <p className="text-sm text-muted-foreground">
        Masukkan jumlah pinjaman tanpa titik atau koma
      </p>
    </div>
  );
}
