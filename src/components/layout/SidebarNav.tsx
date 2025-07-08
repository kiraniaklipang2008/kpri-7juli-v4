
import { useLocation } from "react-router-dom";
import { LogOut, PiggyBank, Zap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { menuSections } from "./sidebar/menuData";
import { SidebarMenuSection } from "./sidebar/SidebarMenuSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

export function SidebarNav() {
  const location = useLocation();

  // Filter out hidden menu sections
  const visibleMenuSections = menuSections.filter(section => !section.hidden);

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      className="border-r border-gray-200 hidden md:flex bg-gradient-to-b from-koperasi-light via-white to-gray-50 shadow-lg z-40"
    >
      <SidebarHeader className="border-b border-gray-200 bg-gradient-to-r from-koperasi-blue to-koperasi-green shadow-lg">
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 relative">
          <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
          <div className="relative z-10 flex items-center gap-2 sm:gap-3 w-full">
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <PiggyBank className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white flex-shrink-0" />
            </div>
            <h1 className="text-base sm:text-lg md:text-xl font-bold text-white truncate group-data-[collapsible=icon]:hidden drop-shadow-sm">
              Koperasiku
            </h1>
            <SidebarTrigger className="ml-auto h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 flex-shrink-0 text-white hover:bg-white/20 hover:text-white rounded-lg backdrop-blur-sm transition-all duration-200" />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="overflow-hidden bg-gradient-to-b from-koperasi-light via-white to-gray-50">
        <ScrollArea className="h-full">
          <div className="p-2 sm:p-3">
            {/* Quick Access Link */}
            <div className="mb-4 sm:mb-5 group-data-[collapsible=icon]:hidden">
              <SidebarMenuButton 
                asChild
                className="w-full justify-start gap-3 h-auto p-3 sm:p-4 bg-gradient-to-r from-koperasi-blue to-koperasi-green hover:from-koperasi-blue/90 hover:to-koperasi-green/90 text-white border-0 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
              >
                <Link to="/akses-cepat">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                      <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-white flex-shrink-0" />
                    </div>
                    <div className="text-left min-w-0 flex-1">
                      <div className="font-bold text-white text-sm sm:text-base truncate drop-shadow-sm">Akses Cepat</div>
                      <div className="text-xs sm:text-sm text-white/80 truncate">Quick access ke semua module</div>
                    </div>
                  </div>
                </Link>
              </SidebarMenuButton>
              <Separator className="my-4 sm:my-5 bg-gray-200" />
            </div>
            
            {/* Regular Menu Sections - Only show visible ones */}
            <div className="space-y-2 sm:space-y-3">
              {visibleMenuSections.map((section, index) => (
                <SidebarMenuSection 
                  key={index} 
                  section={section} 
                  locationPath={location.pathname}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-200 bg-gradient-to-r from-koperasi-light to-gray-50 backdrop-blur-sm">
        <div className="p-3 sm:p-4">
          <SidebarMenuButton 
            variant="outline"
            tooltip="Keluar"
            className="w-full justify-start bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 hover:text-red-800 border-2 border-red-200 hover:border-red-300 text-sm sm:text-base rounded-xl transition-all duration-200 shadow-md hover:shadow-lg backdrop-blur-sm"
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden font-semibold">Keluar</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
