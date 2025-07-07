
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Eye, Edit, Trash2 } from 'lucide-react';

interface ActionGridProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

export function ActionGrid({ onView, onEdit, onDelete, compact = true }: ActionGridProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-1">
        {onView && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-200"
                onClick={onView}
              >
                <Eye className="h-3.5 w-3.5 text-emerald-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Lihat Detail</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {onEdit && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-200"
                onClick={onEdit}
              >
                <Edit className="h-3.5 w-3.5 text-emerald-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {onDelete && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full border border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all duration-200"
                onClick={onDelete}
              >
                <Trash2 className="h-3.5 w-3.5 text-red-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hapus</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
