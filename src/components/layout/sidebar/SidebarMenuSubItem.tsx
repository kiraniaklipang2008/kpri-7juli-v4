
import React from "react";
import { Link } from "react-router-dom";
import { 
  SidebarMenuSubItem as ShadcnSidebarMenuSubItem, 
  SidebarMenuSubButton 
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SidebarMenuSubItemProps = {
  path: string;
  icon: React.ElementType;
  title: string;
  isActive: boolean;
};

export function SidebarMenuSubItem({ path, icon: Icon, title, isActive }: SidebarMenuSubItemProps) {
  return (
    <TooltipProvider>
      <ShadcnSidebarMenuSubItem>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuSubButton 
              asChild 
              isActive={isActive} 
              className={`rounded-lg transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm border mb-1 px-3 py-2.5 min-h-[44px] ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-xl border-emerald-300' 
                  : 'hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 text-emerald-800 hover:text-emerald-900 border-emerald-200/50 hover:border-emerald-300'
              }`}
            >
              <Link to={path} className="w-full flex items-center gap-3">
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shadow-sm flex-shrink-0 ${
                  isActive ? 'bg-white/20' : 'bg-emerald-500'
                }`}>
                  <Icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className={`font-medium text-sm leading-tight flex-1 min-w-0 truncate ${
                  isActive ? 'text-white' : ''
                }`}>
                  {title}
                </span>
              </Link>
            </SidebarMenuSubButton>
          </TooltipTrigger>
          <TooltipContent 
            side="right" 
            align="center"
            className="bg-slate-900 text-white border-slate-700 shadow-2xl max-w-xs z-[99999] fixed"
            sideOffset={20}
            avoidCollisions={true}
            collisionPadding={16}
            sticky="always"
          >
            <p className="font-medium text-sm">{title}</p>
          </TooltipContent>
        </Tooltip>
      </ShadcnSidebarMenuSubItem>
    </TooltipProvider>
  );
}
