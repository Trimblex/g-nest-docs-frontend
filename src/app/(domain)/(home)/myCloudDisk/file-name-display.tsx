import { useRef, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileInfoVO } from "@/interface/files";
import { getFileNameParts, truncateName } from "@/lib/utils";

interface FileNameDisplayProps {
  file: FileInfoVO;
  isRenaming: boolean;
  onRename: (newName: string) => void;
  maxLen?: number;
  className?: string;
}

export const FileNameDisplay = ({
  file,
  isRenaming,
  onRename,
  maxLen = 28,
  className,
}: FileNameDisplayProps) => {
  const [fileName, extension] = getFileNameParts(file.name);
  const [newName, setNewName] = useState(fileName);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasExtension = file.type === "FILE" && extension;

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        const valueLength = inputRef.current?.value.length || 0;
        inputRef.current?.setSelectionRange(0, valueLength);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isRenaming]);
  return isRenaming ? (
    <div className={"flex items-center gap-1" + className} draggable={false}>
      <Input
        ref={inputRef}
        autoFocus
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onBlur={() => onRename(newName)}
        onKeyDown={(e) => e.key === "Enter" && onRename(newName)}
        className="h-8 w-[160px]"
      />
      {hasExtension && (
        <span className="text-muted-foreground">.{extension}</span>
      )}
    </div>
  ) : (
    <Tooltip>
      <TooltipTrigger>
        <span className={"truncate max-w-[180px]"}>
          {truncateName(file.name, maxLen)}
        </span>
      </TooltipTrigger>
      <TooltipContent>{file.name}</TooltipContent>
    </Tooltip>
  );
};
