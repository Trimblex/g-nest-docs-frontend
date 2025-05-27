"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
  pathHierarchy: Array<{ id: string; name: string }>;
  onClick: (id: string) => void;
  className?: string;
}
export const Breadcrumbs = ({
  pathHierarchy,
  onClick,
  className,
}: BreadcrumbsProps) => {
  return (
    <div
      className={cn(
        "flex items-center text-sm text-muted-foreground",
        className
      )}
    >
      <Button
        variant="ghost"
        onClick={() => onClick("0")}
        className="px-2 h-7 hover:bg-accent"
      >
        根目录
      </Button>
      {pathHierarchy.map((segment) => (
        <span key={segment.id} className="flex items-center">
          <span className="mx-1">/</span>
          <Button
            variant="ghost"
            onClick={() => onClick(segment.id)}
            className="px-2 h-7 hover:bg-accent"
          >
            {segment.name}
          </Button>
        </span>
      ))}
    </div>
  );
};
