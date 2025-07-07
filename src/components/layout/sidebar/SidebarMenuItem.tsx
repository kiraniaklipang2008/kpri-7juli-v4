
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  SidebarMenuItem as ShadcnSidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarMenuSubItem } from "./SidebarMenuSubItem";
import { MenuItemType } from "./menuData";

type SidebarMenuItemProps = {
  item: MenuItemType;
  isActive: boolean;
  locationPath: string;
};

export function SidebarMenuItem({ item, isActive, locationPath }: SidebarMenuItemProps) {
  const hasSubItems = !!item.subItems && item.subItems.length > 0;
  
  // Check if any sub-item is active
  const hasActiveSubItem = hasSubItems && item.subItems?.some(subItem => locationPath === subItem.path);
  
  // State for collapsible - default closed, but open if has active sub-item
  const [isOpen, setIsOpen] = useState(hasActiveSubItem || false);

  // Update isOpen when location changes and there's an active sub-item
  useEffect(() => {
    if (hasActiveSubItem) {
      setIsOpen(true);
    }
  }, [hasActiveSubItem]);

  if (hasSubItems) {
    return (
      <TooltipProvider>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <ShadcnSidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive}
                    className={`font-medium w-full rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border px-4 py-3 min-h-[52px] ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-2xl border-emerald-300' 
                        : 'hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 text-emerald-800 hover:text-emerald-900 border-emerald-200/50 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md flex-shrink-0 ${
                        isActive ? 'bg-white/20' : 'bg-emerald-600'
                      }`}>
                        <item.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className={`font-semibold text-sm leading-tight flex-1 min-w-0 text-left truncate ${
                        isActive ? 'text-white' : 'text-emerald-800 group-hover:text-emerald-900'
                      }`}>
                        {item.title}
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      } ${isActive ? 'text-white' : 'text-emerald-700'}`} />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                align="center"
                className="bg-slate-900 text-white border-slate-700 shadow-2xl max-w-xs z-[9999] relative"
                sideOffset={12}
                avoidCollisions={true}
                collisionPadding={8}
                sticky="always"
              >
                <p className="font-medium text-sm">{item.title}</p>
              </TooltipContent>
            </Tooltip>
            <CollapsibleContent>
              <SidebarMenuSub className="border-l-2 border-emerald-300 ml-4 pl-3 mt-2 space-y-1">
                {item.subItems?.map((subItem, subIndex) => (
                  <SidebarMenuSubItem
                    key={subIndex}
                    path={subItem.path}
                    icon={subItem.icon}
                    title={subItem.title}
                    isActive={locationPath === subItem.path}
                  />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </ShadcnSidebarMenuItem>
        </Collapsible>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <ShadcnSidebarMenuItem>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={locationPath === item.path}
              className={`font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm border px-4 py-3 min-h-[52px] ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white shadow-2xl border-emerald-300' 
                  : 'hover:bg-gradient-to-r hover:from-emerald-100 hover:to-teal-100 text-emerald-800 hover:text-emerald-900 border-emerald-200/50 hover:border-emerald-300'
              }`}
            >
              <Link to={item.path} className="flex items-center gap-3 w-full">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md flex-shrink-0 ${
                  isActive ? 'bg-white/20' : 'bg-emerald-600'
                }`}>
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <span className={`font-semibold text-sm leading-tight flex-1 min-w-0 text-left truncate ${
                  isActive ? 'text-white' : 'text-emerald-800'
                }`}>
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent 
            side="right" 
            align="center"
            className="bg-slate-900 text-white border-slate-700 shadow-2xl max-w-xs z-[9999] relative"
            sideOffset={12}
            avoidCollisions={true}
            collisionPadding={8}
            sticky="always"
          >
            <p className="font-medium text-sm">{item.title}</p>
          </TooltipContent>
        </Tooltip>
      </ShadcnSidebarMenuItem>
    </TooltipProvider>
  );
}
