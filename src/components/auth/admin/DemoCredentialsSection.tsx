
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

interface DemoCredential {
  label: string;
  username: string;
  password: string;
}

interface DemoCredentialsSectionProps {
  demoCredentials: DemoCredential[];
  onDemoLogin: (username: string, password: string) => void;
}

export function DemoCredentialsSection({ 
  demoCredentials, 
  onDemoLogin 
}: DemoCredentialsSectionProps) {
  if (!demoCredentials || demoCredentials.length === 0) {
    return null;
  }

  return (
    <div className="flex w-full gap-2">
      {demoCredentials.map((cred) => (
        <Button 
          key={cred.label}
          variant="outline" 
          onClick={() => onDemoLogin(cred.username, cred.password)}
          className="flex-1 h-10 text-xs border-gray-200 bg-gray-50/50 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 rounded-lg transition-all duration-200 font-medium"
        >
          <ShieldCheck className="mr-1 h-3 w-3" /> 
          {cred.label}
        </Button>
      ))}
    </div>
  );
}
