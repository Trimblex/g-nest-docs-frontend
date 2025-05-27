import { DropdownMenuContent } from "@/components/ui/dropdown-menu";

export const ContextMenuDropdown = ({
  children,
  isContextMenu,
  position,
}: {
  children: React.ReactNode;
  isContextMenu?: boolean;
  position?: { x: number; y: number };
}) => (
  <DropdownMenuContent
    align={isContextMenu ? "start" : "end"}
    style={
      isContextMenu
        ? {
            position: "fixed",
            left: position?.x,
            top: position?.y,
            boxShadow: "0px 4px 16px rgba(0,0,0,0.1)",
            minWidth: "160px",
          }
        : {}
    }
  >
    {children}
  </DropdownMenuContent>
);
