import { FileInfoVO } from "@/interface/files";
import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
type DropItem = {
  type: "FILE" | "FOLDER";
  id: string;
  name: string;
};
type PendingMove = {
  sourceId: string;
  sourceName: string;
  targetId: string;
} | null;
export const useFileDnD = (
  file: FileInfoVO,
  onMove: (sourceId: string, targetId: string) => void
) => {
  const [pendingMove, setPendingMove] = useState<PendingMove>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: file.type,
    item: { id: file.id, type: file.type, name: file.name },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  }));

  const [{ isOver }, drop] = useDrop<DropItem, void, { isOver: boolean }>(
    () => ({
      accept: ["FILE", "FOLDER"],
      drop: (item) => {
        if (file.type === "FOLDER" && item.id !== file.id) {
          setPendingMove({
            sourceId: item.id,
            sourceName: item.name,
            targetId: file.id,
          });
        }
      },
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    })
  );

  return {
    dragDropRef: (instance: HTMLTableRowElement | null) => drag(drop(instance)),
    isDragging,
    isOver,
    pendingMove,
    confirmMove: () => {
      if (pendingMove) {
        onMove(pendingMove.sourceId, pendingMove.targetId);
        setPendingMove(null);
      }
    },
  };
};
