
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ControllerRenderProps } from "react-hook-form";

interface UsernameInputProps {
  field: ControllerRenderProps<any, "username">;
}

export function UsernameInput({ field }: UsernameInputProps) {
  return (
    <div className="relative">
      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        placeholder="Masukkan username Anda"
        className="pl-12 h-12 border-gray-200 bg-gray-50/50 hover:bg-white focus:bg-white rounded-xl transition-all duration-200 text-base"
        {...field}
      />
    </div>
  );
}
