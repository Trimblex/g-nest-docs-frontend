import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  ExternalLinkIcon,
  MoreVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { RemoveDialog } from "../../documents/[documentId]/remove-dialog";
import { RenameDialog } from "../../documents/[documentId]/rename-dialog";

interface DocumentMenuProps {
  document: DocumentInfoVO;
  title: string;
  loadData: () => void;
  onNewTab: (id: string) => void;
}

export const DocumentMenu = ({
  document,
  loadData,
  title,
  onNewTab,
}: DocumentMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVerticalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
        <RenameDialog
          document={document}
          initialTitle={title}
          loadData={loadData}
        >
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
          >
            <PencilIcon className="size-4 mr-2" />
            重命名
          </DropdownMenuItem>
        </RenameDialog>
        <RemoveDialog document={document} loadData={loadData}>
          <DropdownMenuItem
            onSelect={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
          >
            <TrashIcon className="size-4 mr-2" />
            删除
          </DropdownMenuItem>
        </RemoveDialog>

        <DropdownMenuItem onClick={() => onNewTab(document.id)}>
          <ExternalLinkIcon className="size-4 mr-2" />
          从新窗口打开
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
